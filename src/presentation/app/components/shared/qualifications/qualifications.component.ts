import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators } from 'ngx-editor';
import { EmployeeService } from '../../../../../domain/services/employee.service';
import { AppConstant } from '../../../../../common/app-constant';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Qualification } from '../../../../../domain/models/employee.model';
import { DatePipe } from '@angular/common';
import { ToasterService } from '../../../../../common/toaster-service';
import swal from "sweetalert";
import { CandidateService } from '../../../../../domain/services/candidate.service';
import { FileHandle } from '../../../../../directive/dragDrop.directive';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-qualifications',
  templateUrl: './qualifications.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './qualifications.component.scss'
})
export class QualificationsComponent implements OnInit {
  qualificationForm!: FormGroup;
  minEndDate: Date | null = null;
  todayDate: Date | null = null;
  qualificationData: Qualification[] = [];
  files: FileHandle[] = [];
  UploadFlag: number = 3;
  baseImageURL = AppConstant.BASE_IMAGEURL + 'uploads/';
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  @ViewChild("AddQualificationModel", { static: false }) public addQualificationModel:
    | ModalDirective
    | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;

  @Input() employeeId = 0;
  @Input() showTitle = true;
  @Input() isEmployed = true;
  @Output() qualificationsCount = new EventEmitter<number>();


  constructor(private fb: FormBuilder,
    private employeeService: EmployeeService,
    private datePipe: DatePipe,
    private toaster: ToasterService,
    private candidateService: CandidateService,
    private sanitizer: DomSanitizer,
  ) {
    this.todayDate = new Date();
  }

  ngOnInit(): void {
    this.qualificationForm = this.fb.group({
      id: [0],
      qualificationTypeId: ['', Validators.required],
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      grade: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required, this.endDateValidator]],
      yearOfPassing: ['', [Validators.required, this.yearValidator()]],
      file: [null]
    });

  }

  yearValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!/^\d{4}$/.test(value)) {
        return { invalidYear: true };
      }
      return null;
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeId']) {
      this.getQualification();
    }
  }
  async getQualification() {
    if (this.employeeId > 0) {
      if (this.isEmployed) {
        await this.employeeService.getEmployee<Qualification[]>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/Qualification").subscribe({
          next: (response) => {
            this.qualificationData = response.data;
            this.qualificationsCount.emit(this.qualificationData.length);
            this.qualificationData = response.data.map((qualification) => {
              if (qualification.endDate != null) {
                const experienceData: Qualification = {
                  ...qualification,
                  startDate: new Date(qualification.startDate),
                  endDate: new Date(qualification.endDate),
                  formattedStartDate: this.datePipe.transform(new Date(qualification.startDate), 'dd/MM/yyyy') || undefined,
                  formattedEndDate: this.datePipe.transform(new Date(qualification.endDate), 'dd/MM/yyyy') || undefined,
                };
                return experienceData;
              } else {
                if (qualification.startDate != null) {
                  const experienceData: Qualification = {
                    ...qualification,
                    startDate: new Date(qualification.startDate),
                    formattedStartDate: this.datePipe.transform(new Date(qualification.startDate), 'dd/MM/yyyy') || undefined,
                    formattedEndDate: undefined,
                  };
                  return experienceData;
                } else {
                  const experienceData: Qualification = {
                    ...qualification,
                    formattedStartDate: undefined,
                    formattedEndDate: undefined,
                  };
                  return experienceData;
                }

              }
            });
          }
        })
      } else {
        await this.candidateService.getCandidate<Qualification[]>(AppConstant.CANDIDATE + "/" + this.employeeId + "/Qualification").subscribe({
          next: (response) => {
            this.qualificationData = response.data;
            this.qualificationsCount.emit(this.qualificationData.length);
            this.qualificationData = response.data.map((qualification) => {
              if (qualification.endDate != null) {
                const experienceData: Qualification = {
                  ...qualification,
                  startDate: new Date(qualification.startDate),
                  endDate: new Date(qualification.endDate),
                  formattedStartDate: this.datePipe.transform(new Date(qualification.startDate), 'dd/MM/yyyy') || undefined,
                  formattedEndDate: this.datePipe.transform(new Date(qualification.endDate), 'dd/MM/yyyy') || undefined,
                };
                return experienceData;
              } else {
                if (qualification.startDate != null) {
                  const experienceData: Qualification = {
                    ...qualification,
                    startDate: new Date(qualification.startDate),
                    formattedStartDate: this.datePipe.transform(new Date(qualification.startDate), 'dd/MM/yyyy') || undefined,
                    formattedEndDate: undefined,
                  };
                  return experienceData;
                } else {
                  const experienceData: Qualification = {
                    ...qualification,
                    formattedStartDate: undefined,
                    formattedEndDate: undefined,
                  };
                  return experienceData;
                }

              }
            });
          }
        })

      }
    }
  }

  // Update the minimum allowed date for the end date when the start date changes
  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    const startDate = event.value;
    if (startDate) {
      this.minEndDate = new Date(startDate);
      // Reset the end date if it is before the start date
      if (new Date(this.qualificationForm.get('endDate')?.value) < this.minEndDate) {
        this.qualificationForm.get('endDate')?.setValue(null);
      }
    }
  }



  // Custom validator to ensure the end date is not before the start date
  endDateValidator(control: any) {
    const formGroup = control.parent;
    if (formGroup) {
      const startDate = formGroup.get('startDate')?.value;
      const endDate = control.value;
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        return { endDateInvalid: true };
      }
    }
    return null;
  }


  addQualifications() {
    this.files = [];
    this.formDirective.resetForm();
    this.qualificationForm.reset();
    this.addQualificationModel?.show();
  }

  closeQualifications() {
    this.files = [];
    this.formDirective.resetForm();
    this.qualificationForm.reset();
    this.addQualificationModel?.hide();
  }

  async onSubmit() {
    if (this.qualificationForm.valid) {
      let data = this.qualificationForm.value;
      let formData = new FormData();
      formData.append('QualificationTypeId', data.qualificationTypeId);
      formData.append('Institution', data.institution);
      formData.append('Degree', data.degree);
      formData.append('StartDate', new Date(data.startDate).toISOString());
      formData.append('EndDate', data.endDate === null ? '' : new Date(data.endDate).toISOString());
      formData.append('FieldOfStudy', data.fieldOfStudy);
      formData.append('YearOfPassing', data.yearOfPassing);
      formData.append('Grade', data.grade);
      formData.append('Document', data.file);
      formData.append("UploadFlag", this.UploadFlag.toString());


      if (this.isEmployed) {
        formData.append('EmployeeId', this.employeeId.toString());

        if (data.id == 0 || data.id == null) {

          await this.employeeService.postEmployee<Qualification>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/Qualification", formData).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeQualifications();
                this.qualificationForm.reset();
                this.getQualification();
              } else {
                this.toaster.errorToaster(response.message);
              }
            }
          })
        } else {
          formData.append('Id', data.id);
          await this.employeeService.putEmployee<Qualification>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/Qualification/" + data.id, formData).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeQualifications();
                this.qualificationForm.reset();
                this.getQualification();
              } else {
                this.toaster.errorToaster(response.message);
              }
            }
          })
        }
      } else {
        formData.append('CandidateId', this.employeeId.toString());

        if (data.id == 0 || data.id == null) {
          await this.candidateService.postCandidate<Qualification>(AppConstant.CANDIDATE + "/" + this.employeeId + "/Qualification", formData).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeQualifications();
                this.qualificationForm.reset();
                this.getQualification();
              } else {
                this.toaster.errorToaster(response.message);
              }
            }
          })
        } else {
          formData.append('Id', data.id);
          await this.candidateService.putCandidate<Qualification>(AppConstant.CANDIDATE + "/" + this.employeeId + "/Qualification/" + data.id, formData).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeQualifications();
                this.qualificationForm.reset();
                this.getQualification();
              } else {
                this.toaster.errorToaster(response.message);
              }
            }
          })
        }
      }
    }

  }
  async deleteQualification(item: Qualification) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        if (this.isEmployed) {
          this.employeeService.deleteEmployee<Qualification>(AppConstant.DELETE_EMPLOYEE_QUALIFICATION + "/" + item.id).subscribe({
            next: (response) => {
              if (response.success && response.status === 200) {
                this.toaster.successToaster(response.message);
                this.getQualification();
              } else {
                this.toaster.warningToaster(response.message);
              }
            }
          });
        } else {
          this.candidateService.deleteCandidate<Qualification>(AppConstant.DELETE_CANDIDATE_QUALIFICATION + "/" + item.id).subscribe({
            next: (response) => {
              if (response.success && response.status === 200) {
                this.toaster.successToaster(response.message);
                this.getQualification();
              } else {
                this.toaster.warningToaster(response.message);
              }
            }
          });
        }
      } else {
        return;
      }
    });

  }
  editQualification(item: Qualification) {

    this.qualificationForm.patchValue({
      id: item.id,
      qualificationTypeId: item.qualificationTypeId,
      degree: item.degree,
      institution: item.institution,
      grade: item.grade,
      fieldOfStudy: item.fieldOfStudy,
      startDate: item.startDate,
      endDate: item.endDate,
      yearOfPassing: item.yearOfPassing,
    });
    this.addQualificationModel?.show();

    if (item.document != null && item.document != '' && item.document != undefined && item.document != 'null') {
      let documentname = AppConstant.getActualFileName(item.document);
      this.files = [];
      this.files.push({
        url: this.baseImageURL + item.document,
        name: (documentname?.split(/[/\\]/).pop() || '') as string
      });
      this.UploadFlag = 3;

    }
  }

  filesDropped(files: FileHandle[]): void {
    this.files = files;
    this.UploadFlag = 1;
    this.qualificationForm.patchValue({
      file: this.files[0].file
    });
  }

  handleFileSizeErrors(errors: string[]) {
    errors.forEach(error => {
      this.toaster.errorToaster(error);
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

        const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        const name = file.name;
        if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
          this.files.push({ file, url, name });
          this.qualificationForm.patchValue({
            file: file
          });
        } else {
          this.toaster.warningToaster('We allow only pdf or docx file!!')
        }
      }
    }
  }

  removeFile() {
    this.UploadFlag = 2;
    this.files = [];
    this.qualificationForm.patchValue({
      file: null
    });
  }

  viewDocument(item: Qualification) {
    AppConstant.getDownloadFile(item.document)
  }

}
