import { Component, OnInit, EventEmitter, Output, ViewChild, Input, SimpleChanges } from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import { EmployeeService } from "../../../../../../domain/services/employee.service";
import { AppConstant } from "../../../../../../common/app-constant";
import { EmployeeDropdown } from "../../../../../../domain/models/project.model";

import { UnsavedChangesService } from "../../../../../../domain/services/ui-service/unsavedChanges.service";
import swal from "sweetalert";
import { AddressComponent } from "../../../shared/address/address.component";
import { BasicDetailsComponent } from "../../../shared/basic-details/basic-details.component";
import { BGVerification, Employee, EmployeeAddrssData, EmployeeBasicDetails, PayrollAttribute, PFAccountDetail } from "../../../../../../domain/models/employee.model";
import { ToasterService } from "../../../../../../common/toaster-service";
import { PfAccountDetailsComponent } from "../../../shared/pf-account-details/pf-account-details.component";
import { EsicAccountDetailsComponent } from "../../../shared/esic-account-details/esic-account-details.component";
import { BgVerficationsComponent } from "../../../shared/bg-verfications/bg-verfications.component";
import { PayrollAttributeComponent } from "../../../shared/payroll-attribute/payroll-attribute.component";
import { LocalStorageService } from "../../../../../../common/local-storage.service";
import { HeaderDropdownService } from "../../../../../../domain/services/header-dropdown.service";
import { NavigationEnd, Router } from "@angular/router";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import { HttpParams } from "@angular/common/http";
import { ProjectService } from "../../../../../../domain/services/project.service";
import { CandidateService } from "../../../../../../domain/services/candidate.service";

@Component({
  selector: "app-employee-create",
  templateUrl: "./employee-create.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrl: "./employee-create.component.scss",
})
export class EmployeeCreateComponent implements OnInit {
  @ViewChild(BasicDetailsComponent) basicDetailsComponent!: BasicDetailsComponent;
  @ViewChild(AddressComponent) addressComponent!: AddressComponent;
  @ViewChild(PfAccountDetailsComponent) pfAccountDetails!: PfAccountDetailsComponent;
  @ViewChild(EsicAccountDetailsComponent) esicAccountDetails!: EsicAccountDetailsComponent;
  @ViewChild(BgVerficationsComponent) bgVerification!: BgVerficationsComponent;
  @ViewChild(PayrollAttributeComponent) PayrollAtrributeComponent!: PayrollAttributeComponent;


  activeChildComponent: string = "basic";
  employeeDropdownData: EmployeeDropdown[] = [];
  employeeId: number = 0;
  employeeData: Employee = new Employee();

  basicDetailsData: any;
  employeeBasicDetils: EmployeeBasicDetails = new EmployeeBasicDetails();
  @Input() isEmployed: boolean = true;
  @Input() userTypeId: number = 3;
  hasError: boolean = false;
  addressData: any;
  pfAccountnumber: any;
  pfId: any;
  uanNo: any;
  esicAccountnumber: any;
  esicId: any;
  bgVerificationData: BGVerification[] = [];
  payrollAttributeData: any;
  selectedFile: any;
  UploadFlag: number = 1;
  uploadDocument: any;
  pfRegistrationDate: any;
  esicRegistrationDate: any;


  isBasicDetilsValid: boolean = false;
  isAddressDetilsValid: boolean = false;
  isPayrollAttributeValid: boolean = false;
  dropdownSubscription: any;
  salarySlipForm!: FormGroup;
  @ViewChild("salarySlipModal", { static: false }) salarySlipModal: any | ModalDirective | undefined;
  monthList: { label: string, value: number, shortName: string }[] = AppConstant.MONTH_DATA.map(month => ({ label: month.monthName, value: month.id, shortName: month.shortName }));
  profilePicUrl: string | ArrayBuffer | null = AppConstant.BASE_IMAGEURL + '/uploads/';
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;

  constructor(
    private employeeServices: EmployeeService,
    private unsavedChangesService: UnsavedChangesService,
    private toaster: ToasterService,
    private localStorageService: LocalStorageService,
    private headerDropdownService: HeaderDropdownService,
    private router: Router,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private candidateServices: CandidateService
  ) {
    this.employeeId = 0;
  }

  ngOnInit(): void {

    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {
        this.router.navigate(['/employee/dashboard'])
      }
    });
    if (
      history.state.EmployeeData != null ||
      history.state.EmployeeData != undefined
    ) {
      this.employeeData = history.state.EmployeeData;
      if (this.employeeData.id) {
        this.employeeId = this.employeeData.id;
      }
    }

    this.salarySlipForm = this.fb.group({
      employeeId: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      selectedMonth: ['']
    })
    if (this.employeeId > 0) {
      this.getBasicDetils();
    }
  }

  downloadOfferLatter() {
    if (!this.employeeBasicDetils || !this.employeeBasicDetils.offerLetter) {
      this.toaster.errorToaster("Offer Letter not available!");
      return;
    }
    const offerLetterUrl = this.employeeBasicDetils.offerLetter;
    const anchor = document.createElement('a');
    anchor.href = offerLetterUrl;
    anchor.target = '_blank';
    anchor.download = 'Offer_Letter.pdf';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  openSalarySheetModel() {
    if (!this.employeeBasicDetils?.salarySlips || this.employeeBasicDetils.salarySlips.length === 0) {
      this.toaster.warningToaster("No salary slips available.");
      return;
    }
    this.formDirective.resetForm();
    this.salarySlipForm.patchValue({
      employeeId: this.employeeId
    })
    this.salarySlipModal.show();
  }

  onSalarySlipDownload() {
    if (this.salarySlipForm.valid) {
      let formData = new HttpParams()
        .set('employeeId', this.salarySlipForm.value.employeeId)
        .set('month', this.salarySlipForm.value.month)
        .set('year', this.salarySlipForm.value.year);

      this.projectService.getDownloadBankTransferSheet(AppConstant.GET_SALARY_SLIP, formData).subscribe({
        next: (blob: Blob) => {
          if (blob && blob instanceof Blob) {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.employeeBasicDetils.firstName.toUpperCase() + "_" + this.employeeBasicDetils.lastName.toUpperCase() + "_" + this.salarySlipForm.value.month + "_" + this.salarySlipForm.value.year + "_SalarySlip.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.salarySlipForm.reset();
            this.salarySlipModal.hide();
          }
        },
        error: (error) => {

        }
      });
    }
  }

  onMonthYearChange(event: any) {


    // Find the selected salary slip to get the year
    const selectedSlip = this.employeeBasicDetils.salarySlips.find((slip: any) => slip.id === event.value);

    if (selectedSlip) {
      this.salarySlipForm.patchValue({
        month: this.monthList.find((m: any) => m.shortName === selectedSlip.month)?.value,
        year: selectedSlip.year // Update the year based on selected month
      });
    }
  }

  async getBasicDetils() {
    if (this.employeeId > 0) {
      if (this.isEmployed) {
        if (this.userTypeId >= 3) {
          await this.employeeServices.getEmployee<EmployeeBasicDetails>(AppConstant.GET_EMPLOYEEBYID + '/' + this.employeeId).subscribe({
            next: (response) => {
              this.employeeBasicDetils = response.data
              this.employeeBasicDetils.salarySlips.forEach((element, index) => {
                element.id = index + 1;
                element.month = element.month;
                element.year = element.year;
              });
              this.profilePicUrl = this.employeeBasicDetils.profilePath;
            }
          })
        } else if (this.userTypeId === 1) {
          await this.candidateServices.getCandidate<EmployeeBasicDetails>(AppConstant.CANDIDATE + '/' + this.employeeId).subscribe({
            next: (response) => {
              this.employeeBasicDetils = response.data
              this.profilePicUrl = this.employeeBasicDetils.uploadResume;
            }
          })
        }
      } else {
        await this.candidateServices.getCandidate<EmployeeBasicDetails>(AppConstant.CANDIDATE + '/' + this.employeeId).subscribe({
          next: (response) => {
            this.employeeBasicDetils = response.data
            this.profilePicUrl = this.employeeBasicDetils.uploadResume;
          }
        })
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeId']) {
      this.getBasicDetils();
    }
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }
  setComponent(type: string) {
    this.activeChildComponent = type;
    if (this.unsavedChangesService.getUnsavedChanges()) {
      swal({
        title: "You have unsaved changes!",
        text: "Do you really want to switch components?",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: true,
      }).then((willLeave) => {
        if (willLeave) {
          this.activeChildComponent = type;
        } else {

        }
      });
    } else {
      this.activeChildComponent = type;
    }
  }

  //     .getEmployee<EmployeeDropdown[]>(AppConstant.GET_EMPLOYEEDROPDOWN).subscribe({


  getEmployeeDetails(employeeId: number) {

  }

  onEmployeChanges(event: any) {
    this.employeeId = event.id;
  }


  handleFormSubmit() { }

  getEmployeeAddress(employeeId: number) {

  }


  // Handle the event when data is emitted from BasicDetailsComponent
  onFormSubmit(formData: any, form: any) {
    if (form === 'Basic Detils') {
      this.basicDetailsData = formData;
    } else if (form == 'Address Detils') {
      this.addressData = formData;
    } else if (form == 'pfAccountDetails') {
      this.pfAccountnumber = formData.pfno;
      this.pfRegistrationDate = formData.pfRegistrationDate
        ? new Date(formData.pfRegistrationDate).toISOString()  // Convert to ISO format
        : undefined;
      this.selectedFile = formData?.uploadDocument || null;
      this.uanNo = formData.uanNo;
    } else if (form == 'pfId') {
      this.pfId = formData;
    } else if (form == 'esicAccountDetails') {
      this.esicAccountnumber = formData.esic;
      this.esicRegistrationDate = formData.esicRegistrationDate
        ? new Date(formData.esicRegistrationDate).toISOString()  // Convert to ISO format
        : undefined;
      this.selectedFile = formData?.uploadDocument || null;
    } else if (form == 'esicId') {
      this.esicId = formData
    } else if (form === 'bgVerification') {
      this.bgVerificationData = formData;
    } else if (form == 'Payroll Attributes') {
      this.payrollAttributeData = formData;
    }
  }

  formvalidation(value: any, form: any) {
    if (form === 'Basic Detils') {
      this.isBasicDetilsValid = value;
    } else if (form == 'Address Detils') {
      this.isAddressDetilsValid = value;
    } else if (form == 'Payroll Attributes') {
      this.isPayrollAttributeValid = value;
    }
  }

  async submit() {
    this.hasError = true;
    if (this.validateCurrentTab()) {

      if (this.activeChildComponent == 'basic') {
        let formData = new FormData();
        formData.append('employeeId', this.employeeId.toString());
        if (this.basicDetailsData.profilePic && this.basicDetailsData.profilePic instanceof File) {
          formData.append("ProfilePath", this.basicDetailsData.profilePic);
        } else {
          formData.append("ProfilePath", "");
        }
        formData.append('uploadFlag', this.basicDetailsData.uploadFlag === null ? '' : this.basicDetailsData.uploadFlag.toString());
        formData.append('FirstName', this.basicDetailsData.firstName === null ? '' : this.basicDetailsData.firstName.toString())
        formData.append('MidName', this.basicDetailsData.midName === null ? '' : this.basicDetailsData.midName.toString())
        formData.append('LastName', this.basicDetailsData.lastName === null ? '' : this.basicDetailsData.lastName.toString())
        formData.append('Gender', this.basicDetailsData.gender === null ? '' : this.basicDetailsData.gender.toString())
        formData.append('DateOfBirth', new Date(this.basicDetailsData.dateOfBirth).toISOString())
        formData.append('DOJ', new Date(this.basicDetailsData.doj).toISOString())
        formData.append('Email', this.basicDetailsData.email === null ? '' : this.basicDetailsData.email.toString())
        formData.append('MobileNo', this.basicDetailsData.mobileNumber === null ? '' : this.basicDetailsData.mobileNumber.toString())
        formData.append('BloodGroup', this.basicDetailsData.bloodGroup === null ? '' : this.basicDetailsData.bloodGroup.toString())
        formData.append('IsRailwayRetired', this.basicDetailsData.isRailway)
        formData.append('IsWagesRate', this.basicDetailsData.isWages)


        await this.employeeServices.putEmployee<EmployeeBasicDetails>(AppConstant.GET_EMPLOYEEBYID, formData).subscribe({
          next: async (response) => {
            if (response.status == 200 && response.success) {
              this.toaster.successToaster('Employee Basic Details are saved!!');

            }
          }
        })

      } else if (this.activeChildComponent == 'address') {
        await this.employeeServices.putEmployee<EmployeeAddrssData>(AppConstant.PUT_EMPLOYEE_ADDRESS, this.addressData).subscribe({
          next: (response) => {
            if (response.status == 200 && response.success) {
              this.toaster.successToaster('Employee Address Details are saved!!');
            }
          }
        })
      } else if (this.activeChildComponent == 'contactInfo') {
        this.toaster.successToaster('Employee Contact Info Details are saved!!');
      } else if (this.activeChildComponent == 'experience') {
        this.toaster.successToaster('Employee Experience Details are saved!!');
      } else if (this.activeChildComponent == 'qualifications') {
        this.toaster.successToaster('Employee Qualifications Details are saved!!');
      } else if (this.activeChildComponent == 'documents') {
        this.toaster.successToaster('Employee Documents Details are saved!!');
      } else if (this.activeChildComponent == 'finacialDetails') {
        this.toaster.successToaster('Employee Financial Details Details are saved!!');
      } else if (this.activeChildComponent == 'salarySlip') {
        this.toaster.successToaster('Employee Salary Slip Details are saved!!');
      } else if (this.activeChildComponent == 'bgVerfications') {
        const employeeId = this.employeeId;
        this.bgVerificationData = this.bgVerificationData
          .filter(verification => verification.visibility)
          .map(verification => ({
            ...verification,
            employeeId: employeeId,
            verificationDate: new Date().toISOString()
          }));

        let bgVerificationWithId = this.bgVerificationData.filter(verification => verification.id && verification.id > 0);
        let bgVerificationWithoutId = this.bgVerificationData.filter(verification => !verification.id || verification.id === 0);

        if (bgVerificationWithoutId.length > 0 || this.bgVerificationData.length === 0) {
          let obj = {
            employeeId: employeeId,
            //bgVerifications: bgVerificationWithoutId
            bgVerifications: this.bgVerificationData.length > 0 ? this.bgVerificationData : []
          }
          await this.employeeServices.postEmployee<BGVerification[]>(AppConstant.GET_EMPLOYEEBYID + '/BGVerification', obj).subscribe({
            next: (response) => {
              if (response.status === 200 && response.success) {
                this.toaster.successToaster('Employee Bg Verification Details are saved!!');
              }
            }
          })
        }
        if (bgVerificationWithId.length > 0) {
          let obj = {
            employeeId: employeeId,
            bgVerifications: bgVerificationWithId
          }
          await this.employeeServices.putEmployee<BGVerification[]>(AppConstant.GET_EMPLOYEEBYID + '/BGVerification', obj).subscribe({
            next: (response) => {
              if (response.status === 200 && response.success) {
                this.toaster.successToaster('Employee Bg Verification Details are saved!!');
              }
            }
          })
        }

      } else if (this.activeChildComponent == 'familyDetails') {
        this.toaster.successToaster('Employee Family Details Details are saved!!');
      } else if (this.activeChildComponent == 'pfAccountDetails') {
        let formData = new FormData();
        if (this.selectedFile instanceof File) {
          formData.append("UploadDocument", this.selectedFile);
        } else {
          formData.append("UploadDocument", "");
        }
        formData.append('Id', this.pfId);
        formData.append('EmployeeId', this.employeeId.toString());
        formData.append('UANNo', this.uanNo);
        formData.append('PFNumber', this.pfAccountnumber);
        formData.append('UploadFlag', this.UploadFlag.toString());
        formData.append('PFRegistrationDate', this.pfRegistrationDate);

        await this.employeeServices.putEmployee<PFAccountDetail>(AppConstant.GET_EMPLOYEEBYID + '/' + this.employeeId + '/PFAccountDetail/' + this.pfId, formData).subscribe({
          next: (response) => {
            if (response.status === 200 && response.success) {
              this.toaster.successToaster('Employee PF Account Details Details are saved!!');
            }
          }
        })
      } else if (this.activeChildComponent == 'esicAccountDetails') {
        const isValid = this.esicAccountDetails.clickNext();
        if (!isValid) return;
        let formData = new FormData();
        if (this.selectedFile instanceof File) {
          formData.append("UploadDocument", this.selectedFile);
        } else {
          formData.append("UploadDocument", "");
        }
        formData.append('Id', this.esicId);
        formData.append('EmployeeId', this.employeeId.toString());
        formData.append('AccountNumber', '');
        formData.append('ESICNumber', this.esicAccountnumber);
        formData.append('ESICRegistrationDate', this.esicRegistrationDate);
        formData.append('UploadFlag', this.UploadFlag.toString());

        await this.employeeServices.putEmployee<PFAccountDetail>(AppConstant.GET_EMPLOYEEBYID + '/' + this.employeeId + '/ESICAccountDetail/' + this.esicId, formData).subscribe({
          next: (response) => {
            if (response.status === 200 && response.success) {
              this.toaster.successToaster('Employee ESIC Account Details Details are saved!!');
            }
          }
        })
      } else if (this.activeChildComponent == 'payrollAttributes') {
        await this.employeeServices.postEmployee<PayrollAttribute>(AppConstant.POST_PAYROLLATTRIBUTE, this.payrollAttributeData).subscribe({
          next: (response) => {
            if (response.status == 200 && response.success) {
              this.toaster.successToaster('Payroll Attributes Details are saved!!');
            }
          }
        })
      }
    }
  }


  validateCurrentTab(): boolean {
    switch (this.activeChildComponent) {
      case "basic":
        this.basicDetailsComponent.clickNext();
        return this.isBasicDetilsValid;
      case "address":
        this.addressComponent.clickNext();
        return this.isAddressDetilsValid;
      case "contactInfo":
        return true;
      case "experience":
        return true;
      case "qualifications":
        return true;
      case "documents":
        return true;
      case "finacialDetails":
        return true;
      case "salarySlip":
        return true;
      case "bgVerfications":
        this.bgVerification.clickNext();
        return true;
      case "familyDetails":
        return true;
      case "pfAccountDetails":
        this.pfAccountDetails.clickNext();
        return this.pfAccountnumber != "" && this.pfAccountnumber != undefined && this.pfAccountnumber != null;
      // case "esicAccountDetails":
      case "esicAccountDetails":
        this.esicAccountDetails.clickNext();
        const esicNumber = this.esicAccountDetails.EsicForm?.get('esicnumber')?.value || '';
        return esicNumber.length >= 10 &&
          esicNumber.length <= 17 &&
          this.esicAccountDetails.EsicForm?.valid;
      case "payrollAttributes":
        this.PayrollAtrributeComponent.clickNext();
        return this.isPayrollAttributeValid;
      default:
        return false;
    }
  }

  cancel() {
    this.router.navigate(['/employee/dashboard']);
  }

}
