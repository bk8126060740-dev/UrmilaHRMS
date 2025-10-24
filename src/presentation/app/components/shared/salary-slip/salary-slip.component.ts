import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FileHandle } from '../../../../../directive/dragDrop.directive';
import { DomSanitizer } from '@angular/platform-browser';
import { ToasterService } from '../../../../../common/toaster-service';
import { EmployeeService } from '../../../../../domain/services/employee.service';
import { Experience, SalarySlip } from '../../../../../domain/models/employee.model';
import { AppConstant } from '../../../../../common/app-constant';
import swal from "sweetalert";

@Component({
  selector: 'app-salary-slip',
  templateUrl: './salary-slip.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './salary-slip.component.scss'
})
export class SalarySlipComponent implements OnInit {

  @ViewChild("AddSalarySlipModel", { static: false }) public addSalarySlipModel:
    | ModalDirective
    | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  @Input() employeeId = 0;
  @Input() showTitle = true;
  @Output() salarySlipCount = new EventEmitter<number>;
  baseImageURL = AppConstant.BASE_IMAGEURL + 'uploads/'

  salarySlipForm!: FormGroup;
  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  years: number[] = [];
  //For File
  files: FileHandle[] = [];
  experienceData: Experience[] = [];
  salarySlipData: SalarySlip[] = [];


  constructor(private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private sanitizer: DomSanitizer,
    private toaster: ToasterService,
    private employeeService: EmployeeService
  ) {
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('en-GB');  // Change locale if needed
    this.salarySlipForm = this.fb.group({
      id: [''],
      company: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^\d{4}$/)]],
      salaryAmount: ['', Validators.required],
      file: [null, Validators.required]
    });
    const currentYear = new Date().getFullYear();
    for (let year = 1980; year <= currentYear; year++) {
      this.years.push(year);
    }
    this.getExperience();
    this.getSalarySlip();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeId']) {

      this.getExperience();
      this.getSalarySlip();
    }
  }


  async getSalarySlip() {
    if (this.employeeId > 0) {

      await this.employeeService.getEmployee<SalarySlip[]>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/SalarySlips").subscribe({
        next: (response) => {
          this.salarySlipData = response.data;
          this.salarySlipCount.emit(this.salarySlipData.length);
        }
      })
    }
  }

  async getExperience() {
    if (this.employeeId > 0) {


      await this.employeeService.getEmployee<Experience[]>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/Experiences").subscribe({
        next: (response) => {
          this.experienceData = response.data;
        }
      })
    }
  }

  addSalarySlip() {
    this.formDirective.resetForm();
    this.salarySlipForm.reset();
    this.addSalarySlipModel?.show();
  }


  closeSalarySlip() {
    this.formDirective.resetForm();
    this.salarySlipForm.reset();
    this.files = [];
    this.addSalarySlipModel?.hide();
  }


  chosenYearHandler(normalizedYear: any, datepicker: MatDatepicker<any>) {
    const ctrlValue = this.salarySlipForm.get('year')?.value || new Date();
    ctrlValue.setFullYear(normalizedYear.year());
    this.salarySlipForm.get('year')?.setValue(normalizedYear.year());
    datepicker.close();  // Closes after year selection
  }

  chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const ctrlValue = this.salarySlipForm.get('month')?.value || new Date();
    ctrlValue.setMonth(normalizedMonth.month());
    this.salarySlipForm.get('month')?.setValue(normalizedMonth.month() + 1); // Stores month (1-12)
    datepicker.close();  // Closes after month selection
  }



  async onSubmit() {

    if (!this.salarySlipForm.get('file')?.value) {
      this.toaster.errorToaster('Please select a file before submitting.', 'File Required')
      return; // Stop the submission
    }
    if (this.salarySlipForm.valid) {
      if (this.salarySlipForm.valid) {
        let data = this.salarySlipForm.value;
        let formData = new FormData();
        formData.append('EmployeeId', this.employeeId.toString());
        formData.append('CompanyName', data.company);
        formData.append('MonthYear', data.month + "-" + data.year);
        formData.append('SalaryAmount', data.salaryAmount);
        formData.append('SalarySlipDoc', data.file);

        if (data.id == 0 || data.id == null) {
          await this.employeeService.postEmployee<SalarySlip>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/SalarySlip", formData).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeSalarySlip();
                this.salarySlipForm.reset();
                this.getSalarySlip();
              } else {
                this.toaster.errorToaster(response.message);
              }
            }
          })
        } else {
          formData.append('salarySlipId', data.id);
          await this.employeeService.putEmployee<SalarySlip>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/SalarySlip/" + data.id, formData).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeSalarySlip();
                this.salarySlipForm.reset();
                this.getSalarySlip();
              } else {
                this.toaster.errorToaster(response.message);
              }
            }
          })
        }
      }
    }
  }


  filesDropped(files: any): void {
    this.files = files;
    this.salarySlipForm.patchValue({
      file: this.files[0].file
    });
  }


  handleFileSizeErrors(errors: string[]) {
    errors.forEach(error => {
      this.toaster.errorToaster(error);
    });
  }
  triggerProfileFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onDocumentFileSelected(event: Event) {
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
          this.salarySlipForm.patchValue({
            file: file
          });
        } else {
          this.toaster.warningToaster('We allow only pdf or docx file!!')

        }
      }
    }
  }

  removeFile() {
    this.files = [];
  }

  viewdocument(item: SalarySlip) {
    let url = this.baseImageURL + item.salarySlipDoc;
    window.open(url, "_blank");
  }
  editSlip(item: SalarySlip) {
    if (item.salarySlipDoc != null) {
      this.files.push({
        url: this.baseImageURL + item.salarySlipDoc,
        name: item.salarySlipDoc
      });
    }
    this.salarySlipForm.patchValue({
      id: item.id,
      company: item.companyName,
      salaryAmount: item.salaryAmount,
      file: item.salarySlipDoc,
    });
    this.splitMonthYear(item.monthYear)
    this.addSalarySlipModel?.show();

  }
  deleteSlip(item: SalarySlip) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.employeeService.deleteEmployee<SalarySlip>(AppConstant.DELETE_EMPLOYEE_SALARYSLIP + "/" + item.id).subscribe({
          next: (response) => {
            if (response.success && response.status === 200) {
              this.toaster.successToaster(response.message);
              this.getSalarySlip();
            } else {
              this.toaster.warningToaster(response.message);
            }
          }
        });
      } else {
        return;
      }
    });

  }

  splitMonthYear(value: string) {

    if (value != null && value != undefined && value != "") {
      const parts = value.split('-');
      if (parts.length === 2) {
        this.salarySlipForm.patchValue({
          month: Number(parts[0]), // Set month
          year: Number(parts[1])   // Set year
        });
      }
    }
  }

}
