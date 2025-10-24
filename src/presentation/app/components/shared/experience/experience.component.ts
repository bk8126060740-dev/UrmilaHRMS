import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation, } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { ModalDirective } from "ngx-bootstrap/modal";
import { EmployeeService } from "../../../../../domain/services/employee.service";
import { Experience } from "../../../../../domain/models/employee.model";
import { AppConstant } from "../../../../../common/app-constant";
import { FileHandle } from "../../../../../directive/dragDrop.directive";
import { DomSanitizer } from "@angular/platform-browser";
import { ToasterService } from "../../../../../common/toaster-service";
import { DatePipe } from "@angular/common";
import swal from "sweetalert";
import { CandidateService } from "../../../../../domain/services/candidate.service";

@Component({
  selector: "app-experience",
  templateUrl: "./experience.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrl: "./experience.component.scss",
})
export class ExperienceComponent implements OnInit {
  experience!: FormGroup;
  minEndDate: Date | null = null;
  experienceData: Experience[] = [];

  baseImageURL = AppConstant.BASE_IMAGEURL + "uploads/";

  //For File
  files: FileHandle[] = [];
  UploadFlag: number = 3;

  @ViewChild("AddExperienceModel", { static: false })
  public addExperienceModel: ModalDirective | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  todayDate: Date | null = null;

  @Input() employeeId = 0;
  @Input() showTitle = true;
  @Input() isEmployed = true;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  @Output() experienceCount = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private eployeeService: EmployeeService,
    private candidateService: CandidateService,
    private sanitizer: DomSanitizer,
    private toaster: ToasterService,
    private datePipe: DatePipe
  ) {
    this.todayDate = new Date();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["employeeId"]) {
      this.getExperience();
    }
  }

  ngOnInit() {
    this.experience = this.fb.group({
      id: [0],
      companyName: ["", Validators.required],
      designation: ["", Validators.required],
      location: ["", Validators.required],
      currentJob: [false],
      startDate: [Date, Validators.required],
      endDate: [Date, [Validators.required, this.endDateValidator.bind(this)]],
      description: [""],
      file: [null],
    });
    this.minEndDate = null;

    // Watch the 'currentJob' checkbox value changes
    this.experience.get("currentJob")?.valueChanges.subscribe((currentJob) => {
      if (currentJob) {
        // If 'Current Job' is checked, remove the 'endDate' control validators
        this.experience.patchValue({
          endDate: null,
        });
        this.experience.get("endDate")?.clearValidators();
        this.experience.get("endDate")?.updateValueAndValidity();
      } else {
        // If 'Current Job' is unchecked, add back the validators for 'endDate'
        this.experience.patchValue({
          endDate: this.experience.get("endDate")?.value,
        });
        this.experience.get("endDate")?.setValidators([Validators.required, this.endDateValidator.bind(this),]);
        this.experience.get("endDate")?.updateValueAndValidity();
      }
    });

  }
  async getExperience() {
    if (this.isEmployed) {
      if (this.employeeId > 0) {
        await this.eployeeService.getEmployee<Experience[]>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/Experiences").subscribe({
          next: (response) => {
            // 
            this.experienceData = response.data;
            this.experienceCount.emit(this.experienceData.length);
            this.experienceData = response.data.map((experience) => {
              if (experience.endDate != null) {
                const experienceData: Experience = {
                  ...experience, startDate: new Date(experience.startDate), endDate: new Date(experience.endDate),
                  formattedStartDate: this.datePipe.transform(new Date(experience.startDate), "dd/MM/yyyy") || undefined,
                  formattedEndDate: this.datePipe.transform(new Date(experience.endDate), "dd/MM/yyyy") || undefined,
                };
                return experienceData;
              } else {
                if (experience.startDate != null) {
                  const experienceData: Experience = {
                    ...experience,
                    startDate: new Date(experience.startDate),
                    formattedStartDate: this.datePipe.transform(new Date(experience.startDate), "dd/MM/yyyy") || undefined,
                    formattedEndDate: undefined,
                  };
                  return experienceData;
                } else {
                  const experienceData: Experience = {
                    ...experience,
                    formattedStartDate: undefined,
                    formattedEndDate: undefined,
                  };
                  return experienceData;
                }
              }
            });
          },
        });
      }
    } else {
      if (this.employeeId > 0) {
        await this.candidateService.getCandidate<Experience[]>(AppConstant.CANDIDATE + "/" + this.employeeId + "/Experiences").subscribe({
          next: (response) => {
            // 
            this.experienceData = response.data;
            this.experienceCount.emit(this.experienceData.length);
            this.experienceData = response.data.map((experience) => {
              if (experience.endDate != null) {
                const experienceData: Experience = {
                  ...experience,
                  startDate: new Date(experience.startDate),
                  endDate: new Date(experience.endDate),
                  formattedStartDate: this.datePipe.transform(new Date(experience.startDate), "dd/MM/yyyy") || undefined,
                  formattedEndDate: this.datePipe.transform(new Date(experience.endDate), "dd/MM/yyyy") || undefined,
                };
                return experienceData;
              } else {
                if (experience.startDate != null) {
                  const experienceData: Experience = {
                    ...experience,
                    startDate: new Date(experience.startDate),
                    formattedStartDate: this.datePipe.transform(new Date(experience.startDate), "dd/MM/yyyy") || undefined,
                    formattedEndDate: undefined,
                  };
                  return experienceData;
                } else {
                  const experienceData: Experience = {
                    ...experience,
                    formattedStartDate: undefined,
                    formattedEndDate: undefined,
                  };
                  return experienceData;
                }
              }
            });
          },
        });
      }
    }
  }

  // Submit form
  async onSubmit() {
    // 
    if (this.experience.valid) {
      let data = this.experience.value;
      let formData = new FormData();
      formData.append("JobTitle", data.designation);
      formData.append("StartDate", new Date(data.startDate).toISOString());
      formData.append("EndDate", data.endDate === null ? "" : new Date(data.endDate).toISOString());
      formData.append("Location", data.location);
      formData.append("DesignationRole", data.designation);
      formData.append("ExperienceCertificateDoc", data.file);
      formData.append("Responsibilities", "");
      formData.append("UploadFlag", this.UploadFlag.toString());

      if (this.isEmployed) {
        formData.append("EmployeeId", this.employeeId.toString());
        formData.append("CompanyName", data.companyName);
        if (data.id == 0 || data.id == null) {
          await this.eployeeService.postEmployee<Experience>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/Experience", formData).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeExperience();
                this.experience.reset();
                this.getExperience();
              } else {
                this.toaster.errorToaster(response.message);
              }
            },
          });
        } else {
          formData.append("EmployeeId", this.employeeId.toString());
          formData.append("CompanyName", data.companyName);
          formData.append("Id", data.id);
          await this.eployeeService.putEmployee<Experience>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/Experience/" + data.id, formData).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeExperience();
                this.experience.reset();
                this.getExperience();
              } else {
                this.toaster.errorToaster(response.message);
              }
            },
          });
        }
      } else {
        formData.append("CandidateId", this.employeeId.toString());
        formData.append("Company", data.companyName);
        if (data.id == 0 || data.id == null) {
          await this.candidateService.postCandidate<Experience>(AppConstant.CANDIDATE + "/" + this.employeeId + "/Experience", formData).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeExperience();
                this.experience.reset();
                this.getExperience();
              } else {
                this.toaster.errorToaster(response.message);
              }
            },
          });
        } else {
          formData.append("Id", data.id);
          formData.append("Company", data.companyName);
          formData.append("CandidateId", this.employeeId.toString());

          await this.candidateService
            .putCandidate<Experience>(AppConstant.CANDIDATE + "/" + this.employeeId + "/Experience/" + data.id, formData).subscribe({
              next: (response) => {
                if (response.status == 200 && response.status) {
                  this.toaster.successToaster(response.message);
                  this.closeExperience();
                  this.experience.reset();
                  this.getExperience();
                } else {
                  this.toaster.errorToaster(response.message);
                }
              },
            });
        }
      }
    }
  }

  addExperience() {
    this.formDirective.resetForm();
    this.experience.reset();
    this.files = [];
    this.addExperienceModel?.show();
  }

  viewDocument(item: Experience) {
    AppConstant.getDownloadFile(item.experienceCertificateDoc)
  }

  closeExperience() {
    this.formDirective.resetForm();
    this.experience.reset();
    this.files = [];
    this.addExperienceModel?.hide();
  }

  deleteExp(item: Experience) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete: any) => {
      if (willDelete) {
        if (this.isEmployed) {
          this.eployeeService.deleteEmployee<Experience>(AppConstant.DELETE_EMPLOYEE_EXPERIENCE + "/" + item.id).subscribe({
            next: (response) => {
              if (response.success && response.status === 200) {
                this.toaster.successToaster(response.message);
                this.getExperience();
              } else {
                this.toaster.warningToaster(response.message);
              }
            },
          });
        } else {
          this.candidateService
            .deleteCandidate<Experience>(AppConstant.DELETE_CANDIDATE_EXPERIENCE + "/" + item.id).subscribe({
              next: (response) => {
                if (response.success && response.status === 200) {
                  this.toaster.successToaster(response.message);
                  this.getExperience();
                } else {
                  this.toaster.warningToaster(response.message);
                }
              },
            });
        }
      } else {
        return;
      }
    });
  }

  editExp(item: Experience) {

    if (item.endDate == null) {
      // If 'Current Job' is checked, remove the 'endDate' control validators
      this.experience.get("endDate")?.clearValidators();
      this.experience.get("endDate")?.updateValueAndValidity();
    } else {
      // If 'Current Job' is unchecked, add back the validators for 'endDate'
      this.experience.get("endDate")?.setValidators([]);
      this.experience.get("endDate")?.updateValueAndValidity();
    }

    if (item.experienceCertificateDoc != null && item.experienceCertificateDoc != '') {
      let documentname = item.experienceCertificateDoc.replace(/\d+_/, "");
      this.files = [];
      this.files.push({
        url: this.baseImageURL + item.experienceCertificateDoc,
        name: (documentname?.split(/[/\\]/).pop() || "") as string,
      });
      this.UploadFlag = 3;
    }
    this.experience.patchValue({
      id: item.id,
      companyName: item.companyName,
      designation: item.designationRole,
      location: item.location,
      currentJob: item.endDate == null,
      startDate: item.startDate,
      endDate: item.endDate,
      file: item.experienceCertificateDoc,
    });

    if (!this.isEmployed) {
      this.experience.patchValue({
        companyName: item.company,
      });
    }
    this.addExperienceModel?.show();
  }
  // Custom validator to check if endDate is after startDate
  endDateValidator(control: any) {
    const startDate = this.experience?.get("startDate")?.value;
    const endDate = control.value;
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { endDateBeforeStartDate: true };
    }
    return null;
  }

  // Update the minimum allowed date for the end date when the start date changes
  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    const startDate = event.value;
    if (startDate) {
      this.minEndDate = new Date(startDate);
      // Reset the end date if it is before the start date
      if (new Date(this.experience.get("endDate")?.value) < this.minEndDate) {
        this.experience.get("endDate")?.setValue(null);
      }
    }
  }

  filesDropped(files: FileHandle[]): void {

    this.files = files;
    this.UploadFlag = 1;
    this.experience.patchValue({
      file: this.files[0].file,
    });
  }

  triggerProfileFileInput(fileInput: HTMLInputElement) {
    this.UploadFlag = 1;
    fileInput.click();
  }

  onDocumentFileSelected(event: Event) {
    this.UploadFlag = 1;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      if (file.size > AppConstant.FILE5MB) {
        this.toaster.errorToaster(`File "${file.name}" exceeds the size limit of 5MB.`);
      } else {
        this.files = [];

        const url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        );
        const name = file.name;
        if (file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
          this.files.push({ file, url, name });
          this.experience.patchValue({
            file: file,
          });
        } else {
          this.toaster.warningToaster("We allow only pdf or docx file!!");
        }
      }
    }
  }

  removeFile() {
    this.UploadFlag = 2;
    this.files = [];
    this.experience.patchValue({
      file: null,
    });
  }

  handleFileSizeErrors(errors: string[]) {
    errors.forEach(error => {
      this.toaster.errorToaster(error);
    });
  }
}
