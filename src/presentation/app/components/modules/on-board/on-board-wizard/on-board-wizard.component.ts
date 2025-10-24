import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToasterService } from '../../../../../../common/toaster-service';
import { FormGroup } from '@angular/forms';
import { BasicDetailsComponent } from '../../../shared/basic-details/basic-details.component';
import { AddressComponent } from '../../../shared/address/address.component';
import { EmployeeService } from '../../../../../../domain/services/employee.service';
import { Employee, EmployeeAddrssData, EmployeeBasicDetails } from '../../../../../../domain/models/employee.model';
import { AppConstant } from '../../../../../../common/app-constant';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FinacialDetailsComponent } from '../../../shared/finacial-details/finacial-details.component';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { JwtService } from '../../../../../../common/jwtService.service';
import { Candidate, OfferStatus } from '../../../../../../domain/models/candidate.model';
import { PermissionService } from '../../../../../../domain/services/permission.service';
import { UserGroupModel } from '../../../../../../domain/models/permission.model';
import { HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../../../../../../domain/services/authentication.service';

@Component({
  selector: 'app-on-board-wizard',
  templateUrl: './on-board-wizard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './on-board-wizard.component.scss'
})
export class OnBoardWizardComponent implements OnInit {
  @ViewChild(BasicDetailsComponent) basicDetailsComponent!: BasicDetailsComponent;
  @ViewChild(AddressComponent) addressComponent!: AddressComponent;
  @ViewChild(FinacialDetailsComponent) finacialDetailsComponent!: FinacialDetailsComponent;

  employeeId = 0;
  candidateId = 0;
  basicDetailsData: any;
  addressData: any;
  experienceCount = 0;
  qualificationsCount = 0;
  salarySlipCount = 0;
  financeCount = 0;
  qualificationData: any; // Similar variable for qualifications
  salarySlipData: any; // Variable for salary slips
  financeDetailsData: any; // Variable for finance details
  username: any;
  isBasicDetilsValid: boolean = false;
  isAddressDetilsValid: boolean = false;
  userTypeId: number = 3;
  userId: number = 0;

  constructor(private toaster: ToasterService,
    private employeeServices: EmployeeService,
    private router: Router,
    private localstorage: LocalStorageService,
    private jwtService: JwtService,
    private permissionService: PermissionService,
    private authenticationService: AuthenticationService
  ) {
    this.username = this.localstorage.getItem('username');
  }
  ngOnInit(): void {
    this.userTypeId = this.jwtService.getUserTypeId() ?? 0  // this.jwtService.getUserTypeId() : 3;
    this.userId = parseInt(this.jwtService.getNameIdentifier() ?? '0') ?? 0
    this.getemployeeId()
    this.tabList.forEach(tab => {
      if (tab.id < this.selectedTabId) {
        tab.completed = true;
      } else {
        tab.completed = false;
      }
    });
  }

  async getemployeeId() {

    await this.employeeServices.getEmployee<Employee>(AppConstant.GET_ALLEMPLOYEE_ID).subscribe({
      next: (response) => {
        if (this.userTypeId === 3) {
          this.employeeId = response.data.employeeId;
        } else {
          if (response.data.employeeId > 0) {
            this.employeeId = response.data.employeeId;
            this.candidateId = response.data.candidateId;
            this.userTypeId = 4;
          } else {
            this.employeeId = response.data.candidateId;
            this.candidateId = response.data.candidateId;
          }
        }
      }
    })
  }

  selectedTabId = 1;
  tabList = [
    {
      id: 1,
      name: 'Personal',
      completed: false,
    }, {
      id: 2,
      name: 'Experience',
      completed: false,
    }, {
      id: 3,
      name: 'Qualification',
      completed: false,
    }, {
      id: 4,
      name: 'Financial Details',
      completed: false,
    }

    // , {
    //   id: 4,
    //   name: 'Salary Slips',
    //   completed: false,
  ]

  handleExperienceCount(count: number) {
    this.experienceCount = count;
  }

  handleQualificationsCount(count: number) {
    this.qualificationsCount = count;
  }
  handlesalarySlipCount(count: number) {
    this.salarySlipCount = count;
  }

  handlefinanceCount(count: number) {
    this.financeCount = count;
  }
  // Handle the event when data is emitted from BasicDetailsComponent
  onFormSubmit(formData: any, form: any) {
    if (form === 'Basic Detils') {
      this.basicDetailsData = formData;
    } else if (form == 'Address Detils') {
      this.addressData = formData;
    }
  }

  formvalidation(value: any, form: any) {
    if (form === 'Basic Detils') {
      this.isBasicDetilsValid = value;
    } else if (form == 'Address Detils') {
      this.isAddressDetilsValid = value;
    }
  }

  onTabClick(item: any) {
    this.selectedTabId = item.id;
  }

  async submit() {
    if (this.validateCurrentTab()) {

      if (this.selectedTabId == 1) {
        console.log(this.addressData);
        let formData = new FormData();
        formData.append('employeeId', this.employeeId.toString());
        if (this.basicDetailsData.profilePic && this.basicDetailsData.profilePic instanceof File) {
          formData.append("ProfilePath", this.basicDetailsData.profilePic);
        } else {
          formData.append("ProfilePath", "");
        }
        formData.append('uploadFlag', this.basicDetailsData.uploadFlag != null ? this.basicDetailsData.uploadFlag.toString() : '');


        formData.append('FirstName', this.basicDetailsData.firstName.toString() || '')
        formData.append('MidName', this.basicDetailsData.midName != null && this.basicDetailsData.midName != undefined ? this.basicDetailsData.midName.toString() : '')
        formData.append('LastName', this.basicDetailsData.lastName.toString() || '')
        formData.append('Gender', this.basicDetailsData.gender.toString() || '')
        formData.append('DateOfBirth', new Date(this.basicDetailsData.dateOfBirth).toISOString() || '')
        formData.append('DOJ', new Date(this.basicDetailsData.doj).toISOString() || '')
        formData.append('Email', this.basicDetailsData.email.toString() || '')
        formData.append('MobileNo', this.basicDetailsData.mobileNumber.toString() || '')
        formData.append('BloodGroup', this.basicDetailsData.bloodGroup.toString() != null ? this.basicDetailsData.bloodGroup.toString() || '' : '')

        if (this.userTypeId === 1) {
          await this.employeeServices.postEmployee<EmployeeBasicDetails>(AppConstant.GET_EMPLOYEEBYID + '/Employee', formData).subscribe({
            next: async (response) => {
              if (response.status == 200 && response.success) {
                //
                formData.append('employeeId', "" + response.data.id);

                this.addressData.communicationAddress.employeeId = response.data.id;
                this.addressData.permanentAddress.employeeId = response.data.id;
                this.employeeId = response.data.id;
                this.userTypeId = 4;

                await this.employeeServices.postEmployee<EmployeeAddrssData>(AppConstant.GET_EMPLOYEEBYID + '/Addresses', this.addressData).subscribe({
                  next: (response) => {
                    if (response.status == 200 && response.success) {
                      this.toaster.successToaster('Your Basic Details are saved!!');
                      this.moveToNextTab();
                    }
                  }
                })
              }
            }
          })
        } else if (this.userTypeId >= 3) {
          await this.employeeServices.putEmployee<EmployeeBasicDetails>(AppConstant.GET_EMPLOYEEBYID, formData).subscribe({
            next: async (response) => {
              if (response.status == 200 && response.success) {
                await this.employeeServices.putEmployee<EmployeeAddrssData>(AppConstant.PUT_EMPLOYEE_ADDRESS, this.addressData).subscribe({
                  next: (response) => {
                    if (response.status == 200 && response.success) {
                      this.toaster.successToaster('Your Basic Details are saved!!');
                      this.moveToNextTab();
                    }
                  }
                })
              }
            }
          })
        }

      } else if (this.selectedTabId === 2) {
        if (this.experienceCount <= 0) {
          swal({
            title: "No past experience?",
            text: "No worries! You can still proceed.",
            icon: "warning",
            buttons: ["No", "Yes"],
            dangerMode: true,
          }).then((willDelete) => {
            if (willDelete) {
              this.moveToNextTab();
            } else {
              return
            }
          });
        } else {
          this.moveToNextTab();
        }
      } else if (this.selectedTabId === 3) {
        if (this.qualificationsCount <= 0) {
          swal({
            title: "No past Qualifications?",
            text: "No worries! You can still proceed.",
            icon: "warning",
            buttons: ["No", "Yes"],
            dangerMode: true,
          }).then((willDelete) => {
            if (willDelete) {
              this.moveToNextTab();
            } else {
              return
            }
          });
        } else {
          this.moveToNextTab();
        }
      } /*else if (this.selectedTabId === 4) {
        if (this.salarySlipCount <= 0) {
          swal({
            title: "No past Salary Slip?",
            text: "No worries! You can still proceed.",
            icon: "warning",
            buttons: ["No", "Yes"],
            dangerMode: true,
          }).then((willDelete) => {
            if (willDelete) {
              this.moveToNextTab();
            } else {
              return
            }
          });
        } else {
          this.moveToNextTab();
        }
      }*/ else if (this.selectedTabId === 4) {

        this.financeCount = this.finacialDetailsComponent.getcount();
        if (this.financeCount <= 2) {
          this.toaster.errorToaster('Please upload your Aadhaar Card, PAN Card, and a cheque photo. Make sure they are clear and legible.')
        } else {
          console.log('User Id : ', this.employeeId);
          console.log('User Type Id : ', this.userTypeId);

          if (this.userTypeId === 3) {
            let params = new HttpParams()
              .set('employeeId', this.employeeId);
            this.employeeServices.postEmployee<UserGroupModel[]>(AppConstant.GET_EMPLOYEEBYID + '/WizardComplete', {}, params).subscribe({
              next: (response: any) => {
                if (response.status === 200 && response.success) {
                  Swal.fire({
                    position: 'center',
                    title: 'Congratulations!',
                    text: 'You have successfully completed the onboarding process. Welcome to the team!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Thank You',
                    allowOutsideClick: false
                  }).then((result) => {
                    if (result.value) {
                      this.authenticationService.logout();
                    }
                  })
                } else {
                  this.toaster.warningToaster("Error: " + response.message);
                }
              }
            });

          } else {
            let params = new HttpParams()
              .set('candidateId', this.candidateId);
            await this.employeeServices.postEmployee<OfferStatus>(AppConstant.CANDIDATE + '/OnboardingCompleted', {}, params).subscribe({
              next: (response) => {
                if (response.status == 200 && response.success) {
                  Swal.fire({
                    position: 'center',
                    title: 'Congratulations!',
                    text: 'You have successfully completed the onboarding process. Welcome to the team!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Thank You',
                    allowOutsideClick: false
                  }).then((result) => {
                    if (result.value) {
                      this.router.navigate(['dashboard'])
                    }
                  })
                } else {
                  this.toaster.warningToaster('Something want wrong please try after some time.')
                }
              }
            })
          }
        }
      }
    } else {
      this.toaster.errorToaster('Kindly fill in the required details.');

    }
  }

  validateCurrentTab(): boolean {
    switch (this.selectedTabId) {
      case 1:
        this.basicDetailsComponent.clickNext();
        this.addressComponent.clickNext();
        return this.isBasicDetilsValid ? this.isAddressDetilsValid ? true : false : false;
      case 2:
        return true; // Validate experience tab 
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  }

  moveToNextTab() {
    const currentTabIndex = this.tabList.findIndex(tab => tab.id === this.selectedTabId);
    if (currentTabIndex < this.tabList.length - 1) {
      this.selectedTabId = this.tabList[currentTabIndex + 1].id;
    }
  }
  moveToPreviousTab() {
    const currentTabIndex = this.tabList.findIndex(tab => tab.id === this.selectedTabId);
    if (currentTabIndex > 0) {
      this.selectedTabId = this.tabList[currentTabIndex - 1].id;
    }
  }
}
