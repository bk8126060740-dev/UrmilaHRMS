import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BasicLayoutComponent } from "./components/core/basic-layout/basic-layout.component";
import { BlankLayoutComponent } from "./components/core/blank-layout/blank-layout.component";
import { LoginComponent } from "./components/modules/auth/login/login.component";
import { AuthService } from "./components/core/guards/auth.service";
import { BreadcrumbService } from "./components/core/breadcrumb/breadcrumb.service";
import { ResetPasswordComponent } from "./components/modules/auth/reset-password/reset-password.component";
import { ValidateTokenComponent } from "./components/modules/auth/validate-token/validate-token.component";
import { TokenGuard } from "./components/core/guards/token-guard.service";
import { RedirectToAndroidComponent } from "./components/modules/auth/redirect-to-android/redirect-to-android.component";
import { PrivacyPolicyComponent } from "./components/modules/auth/privacy-policy/privacy-policy.component";
import { DeleteAccountComponent } from "./components/modules/auth/delete-account/delete-account.component";
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'reset', component: ResetPasswordComponent },
      { path: 'redirect', component: RedirectToAndroidComponent },
      { path: 'privacypolicy', component: PrivacyPolicyComponent },
      { path: 'deleteaccount', component: DeleteAccountComponent },

    ]
  },
  {
    path: 'eonboard', component: BlankLayoutComponent,
    children: [
      { path: ':token', component: ValidateTokenComponent, canActivate: [TokenGuard] }
    ]

  }, {
    path: '',
    component: BasicLayoutComponent,
    canActivate: [AuthService],
    data: {
      text: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./components/modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'master',
        loadChildren: () => import('./components/modules/master/master.module').then(m => m.MasterModule),
        data: {
          title: 'Master'
        }
      },
      {
        path: 'client',
        loadChildren: () => import('./components/modules/client/client.module').then(m => m.ClientModule),
        data: {
          title: 'Client'
        }
      },
      {
        path: 'project',
        loadChildren: () => import('./components/modules/project/project.module').then(m => m.ProjectModule),
        data: {
          title: "Project",
        },
      },
      {
        path: 'recruitment',
        loadChildren: () => import('./components/modules/recruitment/recruitment.module').then(m => m.RecruitmentModule),
        data: {
          title: "Recruitment",
        },
      }, {
        path: 'onboard',
        loadChildren: () => import('./components/modules/on-board/on-board.module').then(m => m.OnBoardModule),
        data: {
          title: "OnBoard",
        },
      }, {
        path: 'employee',
        loadChildren: () => import('./components/modules/employee/employee.module').then(m => m.EmployeeModule),
        data: {
          title: "Employees",
        },
      }, {
        path: 'attendance',
        loadChildren: () => import('./components/modules/attandance/attandance.module').then(m => m.AttandanceModule),
        data: {
          title: "Attendance",
        },
      }, {
        path: 'grievance',
        loadChildren: () => import('./components/modules/grievance/grievance.module').then(m => m.GrievanceModule),
        data: {
          title: "Grievance",
        },
      }, {
        path: 'payroll',
        loadChildren: () => import('./components/modules/payroll/payroll.module').then(m => m.PayrollModule),
        data: {
          title: "Payroll",
        },

      }, {
        path: 'reporting',
        loadChildren: () => import('./components/modules/reporting/reporting.module').then(m => m.ReportingModule),
        data: {
          title: "Reporting",
        },
      }, {
        path: 'permission',
        loadChildren: () => import('./components/modules/permission/permission.module').then(m => m.PermissionModule),
        data: {
          title: "Permission",
        },
      }, {
        path: 'paymentin',
        loadChildren: () => import('./components/modules/payment-recivable/payment-recivable.module').then(m => m.PaymentRecivableModule),
        data: {
          title: "Payment In",
        },
      }, {
        path: 'compliance',
        loadChildren: () => import('./components/modules/compliance/compliance.module').then(m => m.ComplianceModule),
        data: {
          title: "Compliance",
        },

      },
      {
        path: 'account',
        loadChildren: () => import('./components/modules/account-report/account-report.module').then(m => m.AccountReportModule),
        data: {
          title: "Account Report",
        },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [BreadcrumbService],

})
export class AppRoutingModule { }
