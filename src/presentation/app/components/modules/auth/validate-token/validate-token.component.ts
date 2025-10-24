import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeAccountService } from '../../../../../../domain/services/employee-account.service';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import { EmployeeAccountModel } from '../../../../../../domain/models/employee-account.model';
import { AppConstant } from '../../../../../../common/app-constant';
import { LoginModel } from '../../../../../../domain/models/login.model';
@Component({
  selector: 'app-validate-token',
  templateUrl: './validate-token.component.html',
  styleUrl: './validate-token.component.scss'
})
export class ValidateTokenComponent implements OnInit {

  token: string | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private employeeAccountService: EmployeeAccountService,
    private localStorageService: LocalStorageService,
    private toaster: ToasterService
  ) { }

  ngOnInit(): void {
    //
    // To capture the fragment from the URL
    this.route.params.subscribe(params => {
      this.token = params['token']; // 'token' should match the path ':token'
      console.log(this.token); // This will log 'CA33470F0B1EDB4526FA7A0311D0D9A9'
      let body = {
        token: this.token
      }
      this.employeeAccountService.post<EmployeeAccountModel>(AppConstant.VALIDATE_TOKEN, body).subscribe({
        next: (response) => {
          if (response.success && response.status == 200) {
            if (response.data.isValid) {
              if (response.data.jwtToken) {
                this.localStorageService.setItem(AppConstant.T_TOKEN, response.data.jwtToken);
              }
              this.router.navigate(['reset']);
            } else {
              this.toaster.errorToaster('Token is expired please contact Administrator!!')
              this.router.navigate(['login']);
            }
          } else {
            this.toaster.errorToaster('Token is expired please contact Administrator!!')
            this.router.navigate(['login']);
          }
        },

        error: (error) => {

        }
      })
    });
  }
}
