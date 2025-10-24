import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { ApiService } from "./base-service/api.service";
import { ClientDropdownModel, CodesByCodeTypeDropdownModel, EmployeeDropdownModel, ProjectModel } from "../models/project.model";
import { AppConstant } from "../../common/app-constant";
import { PFChallanModel } from "../models/payroll.model";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  getProject(URL: any, params?: HttpParams): Observable<ProjectModel> {
    return this.apiService.get<ProjectModel>(URL, params)
  }

  postProject(Obj: any, URL: any): Observable<ProjectModel> {
    return this.apiService.post<ProjectModel>(URL, Obj);
  }

  postFormProject(formData: FormData, URL: any): Observable<ProjectModel> {
    return this.apiService.postFormData<ProjectModel>(URL, formData);
  }

  PutFormProject(formData: FormData, URL: any): Observable<ProjectModel> {
    return this.apiService.putFormData<ProjectModel>(URL, formData);
  }

  putProject(Obj: any, URL: any, params: HttpParams): Observable<ProjectModel> {
    return this.apiService.put<ProjectModel>(URL, Obj, params);
  }

  deleteProject(URL: any, params?: HttpParams): Observable<ProjectModel> {
    return this.apiService.delete<ProjectModel>(URL, params);
  }

  getClientDropdownData(URL: any, params?: HttpParams): Observable<ClientDropdownModel> {
    return this.apiService.get<ClientDropdownModel>(URL, params);
  }
    
  getAllCodesByCodeTypesDropdownData(obj: any, URL: string): Observable<CodesByCodeTypeDropdownModel> {
    return this.apiService.post<CodesByCodeTypeDropdownModel>(URL, obj);
  }

  getEmployeeDropdownData(URL: any, params?: HttpParams): Observable<EmployeeDropdownModel> {
    return this.apiService.get<EmployeeDropdownModel>(URL, params);
  }

  postEmployeeDropdownData(URL: any, obj?: any): Observable<EmployeeDropdownModel> {
    return this.apiService.post<EmployeeDropdownModel>(URL, obj);
  }

  getDownloadUploadFile(url: string, params?: FormData): Observable<Blob> {
    return this.http.post<Blob>(
      `${AppConstant.BASE_URL}${url}`,
        params, 
      { responseType: 'blob' as 'json' } 
    );
  }

  postPFChallan(formData: FormData, URL: any): Observable<any> {
    return this.apiService.post<any>(URL, formData);
  }

  getFileName(url: string, params?: HttpParams): Observable<any> {
    return this.apiService.get<any>(url, params);
  }

  getDownloadBankTransferSheet(url: string, params?: HttpParams): Observable<Blob | any> {
    return this.http.get(`${AppConstant.BASE_URL}${url}`, {
      responseType: 'blob' as 'json',
      params: params,
      observe: 'response'
    }).pipe(
      map(response => {
        if (response.body instanceof Blob) {
          return response.body;
        } else {
          throw new Error('Unexpected response type');
        }
      }),
      catchError(error => {
        if (error.error instanceof Blob) {
          return this.handleBlobError(error.error);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handleBlobError(blob: Blob): Observable<any> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const errorJson = JSON.parse(event.target.result);
          observer.error(errorJson);
        } catch (e) {
          observer.error(blob);
        }
      };
      reader.onerror = () => {
        observer.error(blob);
      };
      reader.readAsText(blob);
    });
  }

}
