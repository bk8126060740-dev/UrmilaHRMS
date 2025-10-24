import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ToasterService } from "../../../../../../common/toaster-service";
import { FormGroup } from "@angular/forms";
import { BasicDetailsComponent } from "../../../shared/basic-details/basic-details.component";
import { AddressComponent } from "../../../shared/address/address.component";
import { EmployeeService } from "../../../../../../domain/services/employee.service";
import {
  Employee,
  EmployeeAddrssData,
  EmployeeBasicDetails,
} from "../../../../../../domain/models/employee.model";
import { AppConstant } from "../../../../../../common/app-constant";
import swal from "sweetalert";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { FinacialDetailsComponent } from "../../../shared/finacial-details/finacial-details.component";
import { LocalStorageService } from "../../../../../../common/local-storage.service";
import { CandidateService } from "../../../../../../domain/services/candidate.service";
import {
  Candidate,
  CandidateAddrssData,
  JobPositionList,
} from "../../../../../../domain/models/candidate.model";
import { HeaderDropdownService } from "../../../../../../domain/services/header-dropdown.service";

@Component({
  selector: "app-candidate-create",
  templateUrl: "./candidate-create.component.html",
  styleUrl: "./candidate-create.component.scss",
})
export class CandidateCreateComponent implements OnInit {
  @ViewChild(BasicDetailsComponent)
  basicDetailsComponent!: BasicDetailsComponent;
  @ViewChild(AddressComponent) addressComponent!: AddressComponent;
  @ViewChild(FinacialDetailsComponent)
  finacialDetailsComponent!: FinacialDetailsComponent;

  employeeId = -1;
  basicDetailsData: any;
  addressData: any;
  experienceCount = 0;
  qualificationsCount = 0;
  salarySlipCount = 0;
  financeCount = 0;
  qualificationData: any; // Similar variable for qualifications
  salarySlipData: any; // Variable for salary slips
  financeDetailsData: any; // Variable for finance details
  isBasicDetilsValid: boolean = false;
  isAddressDetilsValid: boolean = false;
  jobPositionList: JobPositionList[] = [];
  selectedJobPostion: number | null = null;
  isJobPositionValid: boolean = true;

  dropdownSubscription: any;
  constructor(
    private toaster: ToasterService,
    private candidateService: CandidateService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private headerDropdownService: HeaderDropdownService
  ) {
    if (
      history.state.candidateData != null ||
      history.state.candidateData != undefined
    ) {
      this.employeeId = history.state.candidateData.id;
      this.selectedJobPostion = history.state.candidateData.jobId;
    }
  }
  ngOnInit(): void {
    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {

        this.getJobPosition();
      }

    });
    this.getJobPosition();
    this.tabList.forEach((tab) => {
      if (tab.id < this.selectedTabId) {
        tab.completed = true;
      } else {
        tab.completed = false;
      }
    });
  }
  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }

  async getJobPosition() {
    await this.candidateService
      .getCandidate<JobPositionList[]>(
        AppConstant.JOBPOSTOION + "/GetListOfIdAndName"
      )
      .subscribe({
        next: (response) => {
          this.jobPositionList = response.data;
        },
      });
  }

  selectedTabId = 1;
  tabList = [
    {
      id: 1,
      name: "Personal",
      completed: false,
    },
    {
      id: 2,
      name: "Experience",
      completed: false,
    },
    {
      id: 3,
      name: "Qualification",
      completed: false,
    },
  ];

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
    if (form === "Basic Detils") {
      this.basicDetailsData = formData;
    } else if (form == "Address Detils") {
      this.addressData = formData;
    }
  }

  formvalidation(value: any, form: any) {
    if (form === "Basic Detils") {
      this.isBasicDetilsValid = value;
    } else if (form == "Address Detils") {
      this.isAddressDetilsValid = value;
    }
  }

  onTabClick(item: any) {
    // 
    this.submit(item.id);
  }

  async submit(tabId?: any) {
    if (!tabId) {
      tabId = 0;
    }
    if (this.validateCurrentTab()) {
      this.isJobPositionValid = this.selectedJobPostion != null;
      if (this.selectedTabId == 1) {



        let formData = new FormData();
        if (this.basicDetailsData.UploadResume &&
          this.basicDetailsData.UploadResume instanceof File) {
          formData.append("UploadResume", this.basicDetailsData.UploadResume);
        } else {
          formData.append("UploadResume", "");
        }
        formData.append('uploadFlag', this.basicDetailsData.uploadFlag.toString());

        if (this.selectedJobPostion) {
          formData.append("JobPositionId", this.selectedJobPostion.toString());
        }
        formData.append("FirstName", this.basicDetailsData.firstName.toString());
        formData.append("MidName", this.basicDetailsData.midName != null && this.basicDetailsData.midName != undefined ? this.basicDetailsData.midName.toString() : '');
        formData.append("LastName", this.basicDetailsData.lastName.toString());
        formData.append("Gender", this.basicDetailsData.gender.toString());
        formData.append("Email", this.basicDetailsData.email.toString());
        formData.append("MobileNumber", this.basicDetailsData.mobileNumber.toString());
        formData.append("BloodGroup", this.basicDetailsData.bloodGroup.toString());
        if (this.basicDetailsData.reffralby != 0 && this.basicDetailsData.reffralby != null) {
          formData.append("ReferralId", this.basicDetailsData.reffralby.toString());
        }
        if (this.basicDetailsData.reffralempId != 0 && this.basicDetailsData.reffralempId != null) {
          formData.append("ReferralEmpId", this.basicDetailsData.reffralempId.toString());
        }

        const DOB = new Date(this.basicDetailsData.dateOfBirth);
        const TDOJ = new Date(this.basicDetailsData.TDOJ);

        const DOBISO = new Date(DOB.getTime() - DOB.getTimezoneOffset() * 60000).toISOString();
        const TDOJISO = new Date(TDOJ.getTime() - TDOJ.getTimezoneOffset() * 60000).toISOString()

        formData.append("DOB", DOBISO);
        formData.append("TDOJ", TDOJISO);

        let URL = "";
        if (this.employeeId === -1) {
          formData.append("Status", "108");
          URL = AppConstant.CANDIDATE;

          await this.candidateService
            .postCandidate<Candidate>(URL, formData)
            .subscribe({
              next: async (response) => {
                if (response.status == 200 && response.success) {
                  if (this.addressData.communicationAddress.id == "" ||
                    this.addressData.permanentAddress.id === null) {
                    this.addressData.communicationAddress.candidateId = response.data.id;
                    this.addressData.permanentAddress.candidateId = response.data.id;
                    this.addressData.permanentAddress.postalCode = this.addressData.permanentAddress.zipCode;
                    this.addressData.communicationAddress.postalCode = this.addressData.communicationAddress.zipCode;

                    this.employeeId = response.data.id;
                    await this.candidateService.postCandidate<CandidateAddrssData>(AppConstant.CANDIDATE + "/Addresses", this.addressData).subscribe({
                      next: (response) => {
                        if (response.status == 200 && response.success) {
                          this.toaster.successToaster(
                            "Your Personal Details are saved!!"
                          );
                          this.moveToNextTab(tabId);
                        }
                      },
                    });
                  } else {
                    this.addressData.permanentAddress.postalCode =
                      this.addressData.permanentAddress.zipCode;
                    this.addressData.communicationAddress.postalCode =
                      this.addressData.communicationAddress.zipCode;
                    await this.candidateService
                      .putCandidate<CandidateAddrssData>(
                        AppConstant.CANDIDATE + "/UpdateAddresses",
                        this.addressData
                      )
                      .subscribe({
                        next: (response) => {
                          if (response.status == 200 && response.success) {
                            this.toaster.successToaster(
                              "Your Personal Details are saved!!"
                            );
                            this.moveToNextTab(tabId);
                          }
                        },
                      });
                  }
                }
              },
            });
        } else {
          URL = AppConstant.CANDIDATE + "/" + this.employeeId;
          formData.append("Id", this.employeeId.toString());

          await this.candidateService
            .putCandidate<Candidate>(URL, formData)
            .subscribe({
              next: async (response) => {
                if (response.status == 200 && response.success) {
                  if (
                    this.addressData.communicationAddress.id == "" ||
                    this.addressData.permanentAddress.id === null
                  ) {
                    this.addressData.communicationAddress.candidateId =
                      response.data.id;
                    this.addressData.permanentAddress.candidateId =
                      response.data.id;
                    this.addressData.permanentAddress.postalCode =
                      this.addressData.communicationAddress.zipCode;
                    await this.candidateService
                      .postCandidate<CandidateAddrssData>(
                        AppConstant.CANDIDATE + "/Addresses",
                        this.addressData
                      )
                      .subscribe({
                        next: (response) => {
                          if (response.status == 200 && response.success) {
                            this.toaster.successToaster(
                              "Your Personal Details are saved!!"
                            );
                            this.moveToNextTab(tabId);
                          }
                        },
                      });
                  } else {
                    this.addressData.permanentAddress.postalCode =
                      this.addressData.permanentAddress.zipCode;
                    this.addressData.communicationAddress.postalCode =
                      this.addressData.communicationAddress.zipCode;
                    await this.candidateService
                      .putCandidate<CandidateAddrssData>(
                        AppConstant.CANDIDATE + "/UpdateAddresses",
                        this.addressData
                      )
                      .subscribe({
                        next: (response) => {
                          if (response.status == 200 && response.success) {
                            this.toaster.successToaster(
                              "Your Personal Details are saved!!"
                            );
                            this.moveToNextTab(tabId);
                          }
                        },
                      });
                  }
                }
              },
            });
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
              this.moveToNextTab(tabId);
            } else {
              return;
            }
          });
        } else {
          this.moveToNextTab(tabId);
        }
      } else if (this.selectedTabId === 3) {
        if (!tabId) {
          if (this.qualificationsCount <= 0) {
            swal({
              title: "No past Qualifications?",
              text: "No worries! You can still proceed.",
              icon: "warning",
              buttons: ["No", "Yes"],
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                Swal.fire({
                  position: "center",
                  title: "Congratulations!",
                  text: "You have successfully created the candidate for the job position!",
                  icon: "success",
                  showCancelButton: false,
                  confirmButtonText: "Thank You",
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.value) {
                    this.router.navigate(["/recruitment/jobapplication"]);
                  }
                });
              } else {
                return;
              }
            });
          } else {
            Swal.fire({
              position: "center",
              title: "Congratulations!",
              text: "You have successfully created the candidate for the job position!",
              icon: "success",
              showCancelButton: false,
              confirmButtonText: "Thank You",
              allowOutsideClick: false,
            }).then((result) => {
              if (result.value) {
                this.router.navigate(["/recruitment/jobapplication"]);
              }
            });
          }
        } else {
          this.moveToNextTab(tabId);
        }
      } else if (this.selectedTabId === 4) {
        if (this.salarySlipCount <= 0) {
          swal({
            title: "No past Salary Slip?",
            text: "No worries! You can still proceed.",
            icon: "warning",
            buttons: ["No", "Yes"],
            dangerMode: true,
          }).then((willDelete) => {
            if (willDelete) {
              this.moveToNextTab(tabId);
            } else {
              return;
            }
          });
        } else {
          this.moveToNextTab(tabId);
        }
      } else if (this.selectedTabId === 5) {
        this.financeCount = this.finacialDetailsComponent.getcount();
        if (this.financeCount <= 2) {
          this.toaster.errorToaster(
            "Please upload your Aadhaar Card, PAN Card, and a cheque photo. Make sure they are clear and legible."
          );
        } else {
          Swal.fire({
            position: "center",
            title: "Congratulations!",
            text: "You have successfully completed the onboarding process. Welcome to the team!",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "Thank You",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.value) {
              this.router.navigate(["dashboard"]);
            }
          });
        }
      } else {
        this.router.navigate(["/recruitment/jobapplication"]);
      }
    } else {
      if (
        this.selectedJobPostion == null ||
        this.selectedJobPostion == undefined ||
        this.selectedJobPostion === 0
      ) {
        this.toaster.errorToaster("Please select job position first.");
      } else {
        this.toaster.errorToaster("Please enter the required details.");
      }
    }
  }

  onJobPostionChange(event: any) {
    this.selectedJobPostion = event.id;
    this.isJobPositionValid = true;
  }

  validateCurrentTab(): boolean {
    switch (this.selectedTabId) {
      case 1:
        this.basicDetailsComponent.clickNext();
        this.addressComponent.clickNext();
        //   ? this.isAddressDetilsValid
        //     ? this.selectedJobPostion != null
        //       ? true
        //       : false
        //     : false
        //   : false;
        // start add 3 line
        this.isJobPositionValid = this.selectedJobPostion != null;
        if (!this.isBasicDetilsValid || !this.isAddressDetilsValid) {
          return false;
        }
        return this.isJobPositionValid;
      // end add 3 line
      case 2:
        return true; // Validate experience tab
      case 3:
        return true;
      default:
        return false;
    }
  }

  moveToNextTab(tabId: any) {
    if (tabId > 0) {
      this.selectedTabId = tabId;
    } else {
      const currentTabIndex = this.tabList.findIndex(
        (tab) => tab.id === this.selectedTabId
      );
      if (currentTabIndex < this.tabList.length - 1) {
        this.selectedTabId = this.tabList[currentTabIndex + 1].id;
      }
    }
  }
  moveToPreviousTab() {
    const currentTabIndex = this.tabList.findIndex(
      (tab) => tab.id === this.selectedTabId
    );
    if (currentTabIndex > 0) {
      this.selectedTabId = this.tabList[currentTabIndex - 1].id;
    }
  }
}
