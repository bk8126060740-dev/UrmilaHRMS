import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { EsicDetail } from '../../../../../domain/models/employee.model';
import { EmployeeService } from '../../../../../domain/services/employee.service';
import { AppConstant } from '../../../../../common/app-constant';
import { FileHandle } from '../../../../../directive/dragDrop.directive';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToasterService } from '../../../../../common/toaster-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-esic-account-details',
  templateUrl: './esic-account-details.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './esic-account-details.component.scss'
})
export class EsicAccountDetailsComponent implements OnInit {

  @Input() employeeId: number = 0;
  @Output() esic = new EventEmitter<any>();
  @Output() esicId = new EventEmitter<any>();

  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;

  EsicForm!: FormGroup;
  EsicDetail: EsicDetail = new EsicDetail();
  UploadFlag: number = 3;
  uploadFlag: number = 3;
  files: FileHandle[] = [];
  profilePicUrl: any;
  selectedFile: File | any | null = null;
  selectedFileName: string | null = null;
  PFDocUrl: SafeResourceUrl | null = null;
  isFileInputOpen: boolean = false;
  uploadDocument: string | null = null;
  today: Date = new Date();

  constructor(private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toaster: ToasterService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {
    this.EsicForm = this.fb.group({
      esicnumber: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(17),
      Validators.pattern(/^[0-9]*$/)]],
      esicRegistrationDate: ['', Validators.required],
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

  onEsicNumberChange(event: any) {
    const value = event.target.value;
    this.esic.emit({ esic: value });
  }

  async getPfAccountDetils() {
    this.employeeService.getEmployee<EsicDetail>(AppConstant.GET_EMPLOYEEBYID + '/' + this.employeeId + '/ESICAccountDetail').subscribe({
      next: (response) => {
        this.EsicDetail = response.data;
        if (this.EsicDetail.uploadDocument) {
          let fileName = AppConstant.getActualFileName(this.EsicDetail.uploadDocument);
          this.selectedFile = { name: fileName };
        } else {
          this.selectedFile = null;
        }
        this.EsicForm.patchValue({
          esicnumber: this.EsicDetail.esicNumber,
          uploadDocument: this.selectedFile,
          esicRegistrationDate: this.EsicDetail.esicRegistrationDate ? new Date(this.EsicDetail.esicRegistrationDate) : null,
        })
      }
    })
  }

  onDateChange(event: any) {
    if (event.value) {
      const formattedDate = new Date(event.value).toISOString();
      this.EsicForm.patchValue({ esicRegistrationDate: formattedDate });
    }
  }

  clickNext() {
    this.EsicForm.markAllAsTouched();

    const esicNumber = this.EsicForm.get('esicnumber')?.value || '';

    if (esicNumber.length < 10 || esicNumber.length > 17) {
      this.toaster.warningToaster('ESIC Number should be between 10 to 17 digits');
      return false;
    }

    if (this.EsicForm.valid) {
      const data = {
        esic: esicNumber,
        uploadDocument: this.selectedFile,
        esicRegistrationDate: this.datePipe.transform(
          new Date(this.EsicForm.value.esicRegistrationDate).toISOString()
        )
      };
      this.esic.emit(data);
      this.esicId.emit(this.EsicDetail.id);
      return true;
    }
    return false;
  }

  handleFileSizeErrors(errors: any) {
    errors.forEach((error: any) => {
      this.toaster.errorToaster(error);
    });
  }

  filesDropped(files: FileHandle[]): void {
    if (files.length > 0) {
      this.files = files;
      this.selectedFile = files[0].file;

      this.EsicForm.patchValue({
        uploadDocument: this.selectedFile,
      });

      this.UploadFlag = 1;
    }
  }

  onDocumentFileSelected(event: Event) {
    this.UploadFlag = 1;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (file.size > AppConstant.FILE5MB) {
        this.toaster.warningToaster(`File "${file.name}" exceeds the size limit of 5MB.`, 'warning');
        input.value = '';
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
      this.EsicForm.patchValue({
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
    this.EsicDetail.uploadDocument = "";
    const fileInput = document.getElementById('inputFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getDownloadFile(path: any) {
    AppConstant.getDownloadFile(path);
  }

}
