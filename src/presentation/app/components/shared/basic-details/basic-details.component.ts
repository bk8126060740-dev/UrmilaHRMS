import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CodeService } from '../../../../../domain/services/code.service';
import { AppConstant } from '../../../../../common/app-constant';
import { EmployeeService } from '../../../../../domain/services/employee.service';
import { EmployeeBasicDetails } from '../../../../../domain/models/employee.model';
import { ToasterService } from '../../../../../common/toaster-service';
import { CandidateService } from '../../../../../domain/services/candidate.service';
import { EmployeeDropdown, UserDropdown } from '../../../../../domain/models/project.model';
import { debounceTime, Subject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProjectService } from '../../../../../domain/services/project.service';
import { valHooks } from 'jquery';


@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './basic-details.component.scss'
})
export class BasicDetailsComponent {
  uploadFlag: number = 3;
  basicDetailsForm!: FormGroup;
  profilePic: File | null = null;
  hasError: boolean = false; // Track if there's an error
  file: any;
  genderList: any[] = [];
  employeeBasicDetils: EmployeeBasicDetails = new EmployeeBasicDetails();
  todayDate: Date = new Date();
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  reffralBy = [] = [
    { Id: 2, Name: "Facebook" },
    { Id: 3, Name: "Instagram" },
    { Id: 4, Name: "LinkedIn" },
    { Id: 5, Name: "Google" },
    { Id: 6, Name: "Carrier Side" },
    { Id: 7, Name: "Employee" }
  ]
  salarySlipForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private codeService: CodeService,
    private employeeServices: EmployeeService,
    private toaster: ToasterService,
    private candidateServices: CandidateService,
    private cdr: ChangeDetectorRef,
    private projectService: ProjectService
  ) { }

  @Output() formSubmit = new EventEmitter<FormGroup>();
  @Output() isFormValid = new EventEmitter<boolean>();
  @Input() employeeId: number = 0;
  @Input() isEmployed: boolean = true;
  @Input() userTypeId: number = 3;

  baseUrl = AppConstant.BASE_IMAGEURL + '/uploads/';
  profilePicUrl: string | ArrayBuffer | null = AppConstant.BASE_IMAGEURL + '/uploads/';
  employeeDropdownData: EmployeeDropdown[] = [];
  isEmployeedReffral: boolean = false;
  searchText: string = '';
  private searchSubject: Subject<string> = new Subject<string>();
  EmployeeData: any;
  isEditMode: boolean = false;
  monthList: { label: string, value: number, shortName: string }[] = AppConstant.MONTH_DATA.map(month => ({ label: month.monthName, value: month.id, shortName: month.shortName }));
  yearsList: { label: string, value: number }[] = [];
  selectedYear: number = new Date().getFullYear();
  currentYear: any;

  @ViewChild("salarySlipModal", { static: false }) salarySlipModal: any | ModalDirective | undefined;

  ngOnInit(): void {

    this.salarySlipForm = this.fb.group({
      employeeId: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      selectedMonth: ['']
    })

    if (this.isEmployed) {
      this.basicDetailsForm = this.fb.group({
        profilePic: ['', Validators.required],
        firstName: ['', [Validators.required, Validators.minLength(2),Validators.pattern('^[A-Za-z]{2,}(?:\\s[A-Za-z]+)*$')]],
        midName: ['', [Validators.required, Validators.minLength(2),Validators.pattern('^[A-Za-z]{2,}(?:\\s[A-Za-z]+)*$')]],
        lastName: [''],
        gender: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        bloodGroup: [''],
        doj: ['', Validators.required],
        bkcNo: [''],
        isWages: [false],
        isRailway: [false],
        uploadFlag: [this.uploadFlag]//number = 3;
      });
      this.basicDetailsForm.get('bkcNo')?.disable();

    } else {
      this.basicDetailsForm = this.fb.group({
        firstName: ['', Validators.required],
        midName: ['', Validators.required],
        lastName: [''],
        gender: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        bloodGroup: [''],
        TDOJ: ['', Validators.required],
        status: [''],
        UploadResume: [''],
        reffralby: [''],
        reffralempId: [''],

        uploadFlag: [this.uploadFlag]//number = 3;

      });
    }
    this.getPayrollYears();

    this.GetGenderData();

    // Emit the form on value changes
    this.basicDetailsForm.valueChanges.subscribe((changes) => {
      if (changes.profilePic !== this.file) {
        this.emitFormData();
      }
    });

    if (this.employeeId > 0) {
      this.getBasicDetils();
    }


    this.fetchEmployeesWithProject();
    this.setupSearchSubscription();
    if (window.history.state && window.history.state.EmployeeData) {
      this.EmployeeData = window.history.state.EmployeeData;
      this.isEditMode = !!this.EmployeeData?.id; // If ID exists, it's Edit mode
    }
  }

  getPayrollYears(): void {
    this.currentYear = new Date().getFullYear();
    for (let year = this.currentYear - 5; year <= this.currentYear; year++) {
      this.yearsList.push({ label: year.toString(), value: year });
    }
  }




  onReffralChange(event: any) {
    const reffralId = event.value;
    const reffralempIdControl = this.basicDetailsForm.get('reffralempId');

    if (reffralId === AppConstant.EmployeeReffral) {
      this.isEmployeedReffral = true;
      reffralempIdControl?.setValidators([Validators.required]);
      reffralempIdControl?.setValue(null);
    } else {
      this.isEmployeedReffral = false;
      reffralempIdControl?.clearValidators();
      reffralempIdControl?.setValue('');
    }

    reffralempIdControl?.updateValueAndValidity();
    reffralempIdControl?.markAsTouched();

    // Force UI update
    this.cdr.detectChanges();
  }

  async fetchEmployeesWithProject(): Promise<void> {
    const params = new HttpParams()
      .set('SearchText', this.searchText)
    await this.employeeServices.getEmployee<EmployeeDropdown[]>(`${AppConstant.GET_EMPLOYEE_SEARCH}`, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.employeeDropdownData = response.data;
        } else {
          this.employeeDropdownData = [];
        }
      }
    });
  }

  getEmployeeData() {
    this.employeeServices.getEmployee<UserDropdown[]>(AppConstant.GET_EMPLOYEEDROPDOWN).subscribe({
      next: (data) => {
        if (data.success) {
          this.employeeDropdownData = data.data;
        }
        else {
          this.employeeDropdownData = [];
        }
      }
    });
  }

  setupSearchSubscription() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.fetchEmployeesWithProject();
    });
  }

  onSearchChange(searchText: string) {
    this.searchSubject.next(searchText);
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
              this.bindData();
              this.profilePicUrl = this.employeeBasicDetils.profilePath;
            }
          })
        } else if (this.userTypeId === 1) {
          await this.candidateServices.getCandidate<EmployeeBasicDetails>(AppConstant.CANDIDATE + '/' + this.employeeId).subscribe({
            next: (response) => {
              this.employeeBasicDetils = response.data
              this.bindData();
              if (this.employeeBasicDetils.referralId === AppConstant.EmployeeReffral) {
                this.isEmployeedReffral = true;
              }

              this.basicDetailsForm.patchValue({
                doj: this.employeeBasicDetils.tdoj,
                dateOfBirth: this.employeeBasicDetils.dob,

              })
              this.profilePicUrl = this.employeeBasicDetils.uploadResume;

            }
          })
        }
      } else {
        await this.candidateServices.getCandidate<EmployeeBasicDetails>(AppConstant.CANDIDATE + '/' + this.employeeId).subscribe({
          next: (response) => {
            this.employeeBasicDetils = response.data
            this.bindData();
            if (this.employeeBasicDetils.referralId === AppConstant.EmployeeReffral) {
              this.isEmployeedReffral = true;
            }
            this.basicDetailsForm.patchValue({
              TDOJ: this.employeeBasicDetils.tdoj,
              dateOfBirth: this.employeeBasicDetils.dob,
              status: this.employeeBasicDetils.status,
              UploadResume: this.employeeBasicDetils.uploadResume,
              reffralby: this.employeeBasicDetils.referralId,
              reffralempId: this.employeeBasicDetils.referralEmpId
            })
            this.profilePicUrl = this.employeeBasicDetils.uploadResume;

          }
        })
      }
    }
  }

  bindData() {
    this.basicDetailsForm.patchValue({
      profilePic: this.employeeBasicDetils.profilePath,
      firstName: this.employeeBasicDetils.firstName,
      midName: this.employeeBasicDetils.midName,
      lastName: this.employeeBasicDetils.lastName,
      gender: this.employeeBasicDetils.gender == 0 ? null : this.employeeBasicDetils.gender,
      dateOfBirth: this.employeeBasicDetils.dateOfBirth,
      email: this.employeeBasicDetils.email,
      mobileNumber: this.employeeBasicDetils.mobileNumber,
      bloodGroup: this.employeeBasicDetils.bloodGroup,
      doj: this.employeeBasicDetils.doj,
      bkcNo: this.employeeBasicDetils.bkcRegNo,
      isWages: this.employeeBasicDetils.isWagesRate,
      isRailway: this.employeeBasicDetils.isRailwayRetired,
    })
  }
  async GetGenderData() {
    let obj = { codeTypeIds: AppConstant.GETGENDER };
    await this.codeService.getAllCodesByCodeTypesDropdownData(obj, AppConstant.GET_ALLCODESBYCODETYPES).subscribe({
      next: (response) => {
        this.genderList = response.data[0].codes;
      }
    })
  }

  triggerProfileFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }



  onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!this.isValidProfileFileType(file)) {
        this.toaster.errorToaster("Choose a JPG/PNG file.", "Invalid File Type");
        input.value = "";
        this.profilePicUrl = null;
        return;
      }

      if (!this.isValidProfileFileSize(file)) {
        this.toaster.errorToaster("Choose a file under 2 MB.", "File Too Large");
        input.value = "";
        this.profilePicUrl = null;
        return;
      }

      this.profilePic = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicUrl = reader.result;

        if (this.isEmployed) {
          const control = this.basicDetailsForm.get('profilePic');
          control?.setValue(file);
          control?.setErrors(null);
          this.basicDetailsForm.patchValue({ uploadFlag: 1 });
        } else {
          const control = this.basicDetailsForm.get('UploadResume');
          control?.setValue(file);
          control?.setErrors(null);
          this.basicDetailsForm.patchValue({ uploadFlag: 1 });
        }

        this.hasError = false;
      };
      reader.readAsDataURL(file);
    }
  }

  private isValidProfileFileType(file: File): boolean {
    if (this.isEmployed) {
      const validTypes = ["image/jpeg", "image/png"];
      return validTypes.includes(file.type);
    } else {
      return true
    }
  }

  private isValidProfileFileSize(file: File): boolean {
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    return file.size <= maxSize;
  }

  // Emit form data to parent component
  public emitFormData() {
    // this.basicDetailsForm.patchValue({
    //   profilePic: this.file
    // });

    this.formSubmit.emit(this.basicDetailsForm.value);
    this.isFormValid.emit(this.basicDetailsForm.valid);
  }

  // removeFile() {
  //   this.profilePic = null;
  //   this.profilePicUrl = this.baseUrl;
  //   this.uploadFlag = 2;
  //   this.basicDetailsForm.patchValue({
  //     uploadFlag: 2
  //   });
  // }

  removeFile(): void {
    this.file = null;
    this.profilePicUrl = this.baseUrl;

    this.uploadFlag = 2;

    if (this.basicDetailsForm.contains('UploadResume')) {
      this.basicDetailsForm.patchValue({
        UploadResume: '',
        uploadFlag: 2
      });
    }
  }


  // removeProfilePic() {
  //   this.profilePic = null;
  //   this.profilePicUrl = null;
  //   this.uploadFlag = 2;
  //   this.basicDetailsForm.patchValue({
  //     uploadFlag: 2
  //   });
  // }

  removeProfilePic(): void {
    this.profilePic = null;
    this.profilePicUrl = null;
    this.uploadFlag = 2;

    if (this.basicDetailsForm.contains('profilePic')) {
      this.basicDetailsForm.patchValue({
        profilePic: '',
        uploadFlag: 2
      });
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeId']) {
      this.getBasicDetils();
    }
  }

  // clickNext() {
  //   if (this.isEmployed) {
  //     if (this.profilePicUrl == this.baseUrl || this.profilePicUrl == null || this.profilePicUrl == undefined || this.profilePicUrl == null) {
  //       if (!this.profilePic) {
  //   //       }
  //     }
  //   }
  //   //else {
  //   //   this.basicDetailsForm.patchValue({
  //   //     profilePic: this.file
  //   //   });
  //   // }

  //   this.formSubmit.emit(this.basicDetailsForm.value);
  //   this.isFormValid.emit(this.basicDetailsForm.valid);
  //   this.basicDetailsForm.markAllAsTouched();
  // }

  clickNext() {
    this.basicDetailsForm.markAllAsTouched();
    this.hasError = false;
    if (this.isEmployed) {
      const noProfilePic = !this.profilePicUrl || this.profilePicUrl === this.baseUrl;
      if (noProfilePic && !this.profilePic) {
        this.hasError = true;
      }
    }
    const genderControl = this.basicDetailsForm.get('gender');
    if (!genderControl?.value) {
      genderControl?.setErrors({ required: true });
    }
    const isFormValid = this.basicDetailsForm.valid && !this.hasError;
    this.formSubmit.emit(this.basicDetailsForm.value);
    this.isFormValid.emit(isFormValid);
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
    if (!this.employeeBasicDetils.salarySlips || this.employeeBasicDetils.salarySlips.length === 0) {
      this.toaster.warningToaster("No salary slips available.");
      return;
    }
    this.salarySlipModal.show();
    this.salarySlipForm.patchValue({
      employeeId: this.employeeId
    })
  }
  onMonthYearChange(event: any) {

    // Find the selected salary slip to get the year
    const selectedSlip = this.employeeBasicDetils.salarySlips.find(slip => slip.id === event.value);

    if (selectedSlip) {
      this.salarySlipForm.patchValue({
        month: this.monthList.find(m => m.shortName === selectedSlip.month)?.value,
        year: selectedSlip.year // Update the year based on selected month
      });
    }
  }
  trackByFn(index: number, slip: any): string {
    return slip.month + '-' + slip.year; // Unique identifier for each option
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
          // Handle error
        }
      });
    }
  }
}