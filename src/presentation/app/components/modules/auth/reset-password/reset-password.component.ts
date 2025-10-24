import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeAccountService } from '../../../../../../domain/services/employee-account.service';
import { EmployeeAccountModel } from '../../../../../../domain/models/employee-account.model';
import { AppConstant } from '../../../../../../common/app-constant';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  hide = true;
  hide_two = true;
  resetPasswordForm!: FormGroup;
  constructor(private fb: FormBuilder,
    private employeeAccountService: EmployeeAccountService,
    private localStorageService: LocalStorageService,
    private toaster: ToasterService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      'conPassword': ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get('conPassword')?.value
      ? null : { passwordMismatch: true };
  }


  ngOnInit(): void { }

  onSubmit(): void {

    if (this.resetPasswordForm.valid) {
      let body = {
        jwtToken: this.localStorageService.getItem(AppConstant.T_TOKEN),
        password: this.resetPasswordForm?.get('password')?.value
      }
      this.employeeAccountService.post<EmployeeAccountModel>(AppConstant.RESET_PASSWORD, body).subscribe({
        next: (response) => {
          if (response.success && response.status == 200) {
            this.toaster.successToaster('Password Changed sucessfully!!')
            this.router.navigate(['/login']);
          } else {
            this.toaster.errorToaster('Token is expired please contact Administrator!!')
          }
        },

        error: (error) => {

        }
      })
    }

  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get conPassword() {
    return this.resetPasswordForm.get('conPassword');
  }
}
