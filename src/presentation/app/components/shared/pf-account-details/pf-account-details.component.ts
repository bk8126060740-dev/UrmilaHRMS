import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { EmployeeService } from '../../../../../domain/services/employee.service';
import { AppConstant } from '../../../../../common/app-constant';
import { PFAccountDetail } from '../../../../../domain/models/employee.model';
import { ToasterService } from '../../../../../common/toaster-service';
import { FileHandle } from '../../../../../directive/dragDrop.directive';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pf-account-details',
  templateUrl: './pf-account-details.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './pf-account-details.component.scss'
})
export class PfAccountDetailsComponent implements OnInit {

  @Input() employeeId: number = 0;
  @Output() pfnumber = new EventEmitter<any>();
  @Output() pfId = new EventEmitter<any>();

  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;

  PfAccountForm!: FormGroup;
  pfAccountDetail: PFAccountDetail = new PFAccountDetail();
  UploadFlag: number = 3;
  files: FileHandle[] = [];
  profilePicUrl: any;
  selectedFile: File | any | String | null = null;
  selectedFileName: string | null = null;
  PFDocUrl: SafeResourceUrl | null = null;
  isFileInputOpen: boolean = false;
  fileDownloadUrlPF: string = '';
  uploadDocument: string | null = null;
  uploadFlag: number = 3;
  today: Date = new Date();

  constructor(private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toaster: ToasterService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
  ) {

  }

  ngOnInit(): void {
    this.PfAccountForm = this.fb.group({
      pfnumber: ['', Validators.required],
      uannumber: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^\d+$/)]],
      pfRegistrationDate: ['', Validators.required],
      uploadDocument: [File, Validators.required]
    });
    if (history.state?.employeeData) {
      this.uploadDocument = history.state.employeeData.uploadDocument
        ? history.state.employeeData.uploadDocument.split(/[/\\]/).pop() || ''
        : '';
      if (this.uploadDocument) {
        this.getDownloadFile(this.uploadDocument);
        this.UploadFlag = 3;
      }
    }
    this.getPfAccountDetils();
  }

  restrictInput(event: any): void {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\D/g, '');
    if (inputValue.length > 12) {
      inputValue = inputValue.substring(0, 12);
    }
    event.target.value = inputValue;
    this.PfAccountForm.controls['uannumber'].setValue(inputValue);
  }

  async getPfAccountDetils() {
    this.employeeService.getEmployee<PFAccountDetail>(AppConstant.GET_EMPLOYEEBYID + '/' + this.employeeId + '/PFAccountDetail').subscribe({
      next: (response) => {
        this.pfAccountDetail = response.data;
        if (this.pfAccountDetail.uploadDocument) {
          let fileName = AppConstant.getActualFileName(this.pfAccountDetail.uploadDocument);
          this.selectedFile = { name: fileName };
        } else {
          this.selectedFile = null;
        }
        this.PfAccountForm.patchValue({
          pfnumber: this.pfAccountDetail.pfNumber,
          uannumber: this.pfAccountDetail.uaNno,
          uploadDocument: this.selectedFile,
          pfRegistrationDate: this.pfAccountDetail.pfRegistrationDate ? new Date(this.pfAccountDetail.pfRegistrationDate) : null,
        })
      }
    })
  }

  onDateChange(event: any) {
    if (event.value) {
      const formattedDate = new Date(event.value).toISOString();
      this.PfAccountForm.patchValue({ pfRegistrationDate: formattedDate });
    }
  }

  filesDropped(files: FileHandle[]): void {
    if (files.length > 0) {
      this.files = files;
      this.selectedFile = files[0].file;

      this.PfAccountForm.patchValue({
        uploadDocument: this.selectedFile,
      });

      this.UploadFlag = 1;
    }
  }

  clickNext() {
    this.PfAccountForm.markAllAsTouched();

    if (!this.selectedFile) {
      this.toaster.warningToaster("Please select a file before submitting.");
      return;
    }

    if (this.PfAccountForm.valid) {
      let data = {
        pfno: this.PfAccountForm.value.pfnumber,
        uanNo: this.PfAccountForm.value.uannumber,
        uploadDocument: this.selectedFile || this.PfAccountForm.value.uploadDocument,
        pfRegistrationDate: this.datePipe.transform(new Date(this.PfAccountForm.value.pfRegistrationDate).toISOString()) || undefined
      }
      this.pfnumber.emit(data);
      this.pfId.emit(this.pfAccountDetail.id);
    }
  }

  handleFileSizeErrors(errors: any) {
    errors.forEach((error: any) => {
      this.toaster.errorToaster(error);
    });
  }

  onDocumentFileSelected(event: Event) {
    this.UploadFlag = 1;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      if (file.size > AppConstant.FILE5MB) {
        this.toaster.warningToaster(`File "${file.name}" exceeds the size limit of 5MB.`, 'warning');
        input.value = ''; // Reset input
        return;
      }
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];
      if (!allowedExtensions.some(ext => file.name.endsWith(ext))) {
        this.toaster.warningToaster("We allow only PDF, DOC, and DOCX files!", 'warning');
        return;
      }
      this.selectedFile = file;
      this.files = [];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      const name = file.name;
      this.files.push({ file, url, name });
      this.PfAccountForm.patchValue({
        uploadDocument: this.selectedFile,
      });
    }
  }

  triggerProfileFileInput(fileInput: HTMLInputElement) {
    this.UploadFlag = 1;
    fileInput.click();
  }

  removeFile() {
    this.selectedFile = null;
    this.UploadFlag = 2;
    this.pfAccountDetail.uploadDocument = "";
    const fileInput = document.getElementById('inputFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getDownloadFile(path: any) {
    AppConstant.getDownloadFile(path);
  }

}
