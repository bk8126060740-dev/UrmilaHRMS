import { Component, ViewEncapsulation } from "@angular/core";
import { AppConstant } from "../../../../../../common/app-constant";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../../../../../domain/services/authentication.service";
import { GlobalConfiguration } from "../../../../../../common/global-configration";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LocalStorageService } from "../../../../../../common/local-storage.service";
import { MenuService } from "../../../../../../domain/services/menu.service";
import { MenuDaum } from "../../../../../../domain/models/menu.model";
import { ToasterService } from "../../../../../../common/toaster-service";
import { AuthService } from "../../../core/guards/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  hide: boolean = true;
  loginForm!: FormGroup;
  forgotForm!: FormGroup;
  menu: MenuDaum[] = [];
  loginErrorMessage = "";

  constructor(
    private loginRepo: AuthenticationService,
    private route: Router,
    private fb: FormBuilder,
    private localstorage: LocalStorageService,
    private menuService: MenuService,
    private toaster: ToasterService,
    private authService: AuthService
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", [Validators.required]],
    });

    this.forgotForm = this.fb.group({
      email: ["", Validators.required],
    });
  }

  async onForgotPasswordSubmit() {
    if (this.forgotForm.valid) {
      let obj = {
        emailId: this.forgotForm.get("email")?.value,
        "platform": 1
      };
      await this.loginRepo.authentication(obj, `${AppConstant.FORGOT_PASSWORD}`).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.successToaster(response.message);
          } else {
            this.toaster.successToaster(response.message);
          }
        }
      })

    }
  }

  async onSubmit() {


    if (this.loginForm.valid) {
      let obj = {
        userName: this.loginForm.get("username")?.value,
        password: this.loginForm.get("password")?.value,
      };
      await this.loginRepo.authentication(obj, `${AppConstant.LOGIN}`).subscribe({
        next: async (response) => {
          if (response) {
            this.loginErrorMessage = "";

            let username: string = this.loginForm.get("username")?.value;
            this.localstorage.setItem("username", username.toUpperCase());
            this.localstorage.setItem("fullName", response.data.user.fullName);
            this.localstorage.setItem("emailId", response.data.user.emailId);
            this.localstorage.setItem("profilePic", response.data.user.profilePic);
            this.localstorage.setItem("isCheckIn", response.data.user.isCheckIn);
            this.localstorage.setItem("isHo", response.data.user.isHo);
            this.localstorage.setItem("isOnboardComplete", response.data.user.isOnboardComplete);



            await this.menuService.getMenu<MenuDaum[]>(AppConstant.GET_MENUS).subscribe({
              next: (menu) => {
                if (menu) {

                  this.menu = menu.data;
                  this.localstorage.setSession(AppConstant.GET_MENUS, JSON.stringify(menu.data));
                  let defaultRoute = '/dashboard';

                  if (this.menu.length != 0) {
                    if (response.data.user.userTypeId === 3 && response.data.user.isOnboardComplete === false) {
                      defaultRoute = '/onboard/create';
                    } else {
                      if (this.menu[0].link === '#' && this.menu[0].subMenus.length != 0) {
                        defaultRoute = this.menu[0].subMenus[0].link
                      } else if (this.menu[0].link != '#' && this.menu[0].subMenus.length == 0) {
                        defaultRoute = this.menu[0].link;

                      } else {
                        defaultRoute = '/dashboard';
                      }
                    }
                  } else {
                    this.toaster.warningToaster("You do not have the necessary permissions to access the Urmila Web Application.");
                  }

                  this.route.navigate([defaultRoute], { replaceUrl: true });

                } else {
                  this.toaster.warningToaster("You do not have the necessary permissions to access the Urmila Web Application.");
                }
              }
            });
          }
        },
        error: (error) => {
          const errMsg = error?.error?.message || "";
          if (errMsg.includes("UserName")) {
            this.loginForm.get("username")?.setErrors({ serverError: true });
            this.loginErrorMessage = 'Invalid username. Please try again.';
          } else if (errMsg.includes("Password")) {
            this.loginForm.get("password")?.setErrors({ serverError: true });
            this.loginErrorMessage = 'Invalid password. Please try again.';
          } else {
            this.loginErrorMessage = 'Login failed. Please try again.';
          }
          this.loginForm.setErrors({ invalidCredentials: true });
        }
      });
    }
  }

  onFocus(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      target.classList.add("has-value");
    }
  }

  onBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      target.classList.add("has-value");
    } else {
      target.classList.remove("has-value");
    }
  }

  forgotPasswordScreen: boolean = false;

  forgotPassword() {
    this.forgotPasswordScreen = !this.forgotPasswordScreen;
  }
}
