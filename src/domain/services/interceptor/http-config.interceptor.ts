import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { map, catchError, take, switchMap, filter } from "rxjs/operators";
import { AuthenticationService } from "../authentication.service";
import { AppConstant } from "../../../common/app-constant";
import { LocalStorageService } from "../../../common/local-storage.service";
import { ErrorModel, Errors } from "../../models/error.model";
import { Token } from "../../models/login.model";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MatDialog } from "@angular/material/dialog";
import { ReAuthDialogComponent } from "../../../presentation/app/components/shared/re-auth-dialog/re-auth-dialog.component";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  errorModel: ErrorModel = new ErrorModel();
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private injector: Injector,
    public router: Router,
    public toastrService: ToastrService,
    private localStorageService: LocalStorageService,
    private authenticationService: AuthenticationService,
    private ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog
  ) {
    setTimeout(
      () =>
        (this.authenticationService = this.injector.get(AuthenticationService))
    );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let clonedRequest = request;
    if (!clonedRequest.url.includes('Search')) {
      this.ngxLoader.start();
    }
    let loginToken = this.authenticationService?.currentTokenValue;
    
    if (loginToken) {
      if (loginToken.expiresIn && Date.now() > Date.now() + loginToken.expiresIn) {
        this.toastrService.error("Your session has expired, please login");
        this.authenticationService.logout();
      }
      const refererUrl = window.location.href; 

      clonedRequest = request.clone({
        headers: request.headers.set("Authorization", `${loginToken.tokenType} ${loginToken.token}`)
          .set("customReferer", refererUrl),
      });
    }




    return next.handle(clonedRequest).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          
          this.ngxLoader.stop();
        }

        return event;
      }),

      catchError((error: HttpErrorResponse) => {
        
        this.ngxLoader.stop();

        let errorMessages = [];
        switch (error.status) {
          case 200:
            break;
          case 400:
            if (error.error) {
              this.toastrService.error(error.error.detail);
            }
            break;
          case 401:
            
            return this.handle401Error(clonedRequest, next);
          case 403:
            this.toastrService.error(
              "access to the requested resource is forbidden"
            );
            break;
          case 404:
            this.toastrService.error("404 - Request Not Found");
            break;
          case 405:
            this.toastrService.error("Method Not Allowed");
            break;
          case 415:
            this.toastrService.error("Media Type Not Supported");
            break;
          case 500:
            this.toastrService.error(error.error.title ? error.error.title : "We encountered an issue while processing your request.");
            break;
          case 422:
            if (!clonedRequest.url.includes(AppConstant.LOGIN) && !clonedRequest.url.includes(AppConstant.GET_EMPLOYEE_ID)) {
              
              if (error.error instanceof Blob) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                  try {
                    const errorJson = JSON.parse(e.target.result);
                    let message = "";
                    for (let i = 0; i < errorJson.errors.length; i++) {
                      message += `<li>${errorJson.errors[i].message.toString().replace(/'/g, "")}</li>`;
                    }
                    message = `<ul list-style: circle !important>${message}</ul>`;
                    this.toastrService.error(message, "", {
                      enableHtml: true,
                      closeButton: false,
                      timeOut: 10000,
                    });
                  } catch (err) {
                    this.toastrService.error("An unknown error occurred.");
                  }
                };
                reader.readAsText(error.error);
              } else if (error.error && error.error.errors) {
                let message = "";
                for (let i = 0; i < error.error.errors.length; i++) {
                  message += `<li>${error.error.errors[i].message.toString().replace(/'/g, "")}</li>`;
                }
                message = `<ul list-style: circle !important>${message}</ul>`;
                this.toastrService.error(message, "", {
                  enableHtml: true,
                  closeButton: false,
                  timeOut: 10000,
                });
              }
            }
            return throwError(() => new Error("Validation error"));
          default:
            this.toastrService.error(
              "Unauthorazation Acess Try to Re Login !!"
            );
            this.authenticationService.logout();
            break;
        }
        return throwError(() => new Error(error.error));
      })
    );
  }
  processErrors(errors: any): string {
    let errorMessages: string = "";
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        errorMessages = errorMessages + " " + errors[field];
      }
    }
    return errorMessages;
  }


  private addToken(request: HttpRequest<any>, tokenType: string, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set("Authorization", `${tokenType} ${token}`)
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authenticationService.refreshAccessToken().pipe(
        switchMap((newToken: Token) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newToken.token);
          return next.handle(this.addToken(request, newToken.tokenType, newToken.token));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          

          const dialogRef = this.dialog.open(ReAuthDialogComponent, {
            width: '400px',
            disableClose: true
          });

          return dialogRef.afterClosed().pipe(
            switchMap(result => {
              this.isRefreshing = false;
              if (result) {
                
                const loginToken = this.authenticationService.currentTokenValue;
                if (loginToken) {
                  this.refreshTokenSubject.next(loginToken.token);
                  return next.handle(this.addToken(request, loginToken.tokenType, loginToken.token));
                }
              }
              
              this.authenticationService.logout();
              return throwError(() => new Error('Authentication failed'));
            })
          );
        })
      );
    } else {
      
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, 'Bearer', token!));
        })
      );
    }
  }

}
