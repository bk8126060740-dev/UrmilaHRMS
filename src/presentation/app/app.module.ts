import { NgModule, isDevMode } from "@angular/core";
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./components/core/core.module";
import { LoginComponent } from "./components/modules/auth/login/login.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import {
  NgxUiLoaderConfig,
  NgxUiLoaderHttpModule,
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule,
} from "ngx-ui-loader";
import { HttpConfigInterceptor } from "../../domain/services/interceptor/http-config.interceptor";
import { StoreModule } from "@ngrx/store";
import { editFormReducer } from "../../common/state/state.reducer";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../../environments/environment";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BreadcrumbService } from "./components/core/breadcrumb/breadcrumb.service";
import { MatIconModule } from '@angular/material/icon';
import { ResetPasswordComponent } from './components/modules/auth/reset-password/reset-password.component';
import { ValidateTokenComponent } from './components/modules/auth/validate-token/validate-token.component';
import { RedirectToAndroidComponent } from './components/modules/auth/redirect-to-android/redirect-to-android.component';
import { PrivacyPolicyComponent } from './components/modules/auth/privacy-policy/privacy-policy.component';
import { DeleteAccountComponent } from './components/modules/auth/delete-account/delete-account.component';
import { HighchartsChartModule } from "highcharts-angular";
import { NgSelectModule } from "@ng-select/ng-select";
import { ReAuthDialogComponent } from './components/shared/re-auth-dialog/re-auth-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TongGridModule } from "@teamopine/to-ng-grid";


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "#ED6605",
  bgsOpacity: 0.5,
  bgsPosition: "center-center",
  bgsSize: 60,
  bgsType: "three-strings",
  blur: 5,
  fgsColor: "#ED6605",
  fgsPosition: "center-center",
  fgsSize: 60,
  fgsType: "three-strings",
  gap: 24,
  logoPosition: "center-center",
  logoSize: 120,
  logoUrl: "",
  masterLoaderId: "master",
  overlayBorderRadius: "0",
  overlayColor: "rgba(40, 40, 40, 0.8)",
  pbColor: "#ED6605",
  pbDirection: "ltr",
  pbThickness: 3,
  hasProgressBar: true,
  text: "",
  textColor: "#FFFFFF",
  textPosition: "center-center",
};

@NgModule({
  declarations: [AppComponent, LoginComponent, ResetPasswordComponent, ValidateTokenComponent, 
    RedirectToAndroidComponent, PrivacyPolicyComponent, DeleteAccountComponent, ReAuthDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: "toast-top-right",
      preventDuplicates: true,
      progressBar: true,
    }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    StoreModule.forRoot({ editForm: editFormReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode in production
    }),
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    NgSelectModule,
    MatDialogModule,
    TongGridModule
  ],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
    provideAnimationsAsync(),
    BreadcrumbService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
