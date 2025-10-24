import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from '../../../../../common/toaster-service';
import { EmployeeService } from '../../../../../domain/services/employee.service';
import { FinanceDetails } from '../../../../../domain/models/employee.model';
import { AppConstant } from '../../../../../common/app-constant';
import { FileHandle } from '../../../../../directive/dragDrop.directive';
import { HttpParams } from '@angular/common/http';
import swal from "sweetalert";

@Component({
  selector: 'app-finacial-details',
  templateUrl: './finacial-details.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './finacial-details.component.scss'
})
export class FinacialDetailsComponent implements OnInit {
  @ViewChild("AddFinacialDetailsModel", { static: false }) public addFinacialDetailsModel:
    | ModalDirective
    | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  @Input() employeeId: number = 0;
  @Input() showTitle = true;

  @Output() financeCount = new EventEmitter<number>();
  UploadFlag: number = 3;

  financeDetailsForm!: FormGroup;
  financeDetailsData: FinanceDetails[] = [];
  Bank: any;
  selectedtype = "Bank Details";
  documentType: any = [];
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  documentTypeDummy = [
    {
      name: 'Bank Details'
    }, {
      name: 'PAN Card'
    }, {
      name: 'Aadhaar Card'
    }
  ]

  accountType = [
    {
      name: 'SAVING'
    },
    {
      name: 'CURRENT'
    }
  ]

  //For File
  files: FileHandle[] = [];
  baseImageUrl = AppConstant.BASE_IMAGEURL + 'uploads/';

  constructor(private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private toaster: ToasterService,
    private employeeService: EmployeeService
  ) {
  }

  ngOnInit() {
    this.financeDetailsForm = this.fb.group({
      id: [''],
      type: [this.selectedtype, Validators.required],
      name: ['', Validators.required],
      number: ['', Validators.required],
      accountType: ['', Validators.required],
      attachmentFile: ['', Validators.required],
      ifscCode: ['', Validators.required],
    })
    this.getFinanceDetails();

  }


  async submit() {
    //
    if (!this.financeDetailsForm.get('attachmentFile')?.value) {
      this.toaster.errorToaster('Please select a file before submitting.', 'File Required')
      return; // Stop the submission
    }
    if (this.financeDetailsForm.valid) {
      if (this.financeDetailsForm.valid) {
        let data = this.financeDetailsForm.value;
        let formData = new FormData();
        formData.append('EmployeeId', this.employeeId.toString());
        formData.append('Type', data.type);
        formData.append('Name', data.name);
        formData.append('Number', data.number);
        formData.append('AccountType', data.accountType);
        formData.append('AttachmentFile', data.attachmentFile);
        formData.append('IFSCCode', data.ifscCode);
        formData.append("UploadFlag", this.UploadFlag.toString());

        if (data.id == 0 || data.id == null) {
          await this.employeeService.postEmployee<FinanceDetails>(AppConstant.GET_EMPLOYEEBYID + "/FinDetails", formData).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeFinacialDetails();
                this.financeDetailsForm.reset();
                this.getFinanceDetails();
              } else {
                this.toaster.errorToaster(response.message);
              }
            }
          })
        } else {
          formData.append('Id', data.id);
          let params = new HttpParams()
            // .set('employeeId', this.employeeId)
            .set('finDetailId', data.id)
          await this.employeeService.putEmployee<FinanceDetails>(AppConstant.POST_EMPLOYEE_FINANCE, formData, params).subscribe({
            next: (response) => {
              if (response.status == 200 && response.status) {
                this.toaster.successToaster(response.message);
                this.closeFinacialDetails();
                this.financeDetailsForm.reset();
                this.getFinanceDetails();
              } else {
                this.toaster.errorToaster(response.message);
              }
            }
          })
        }
      }
    }
  }
  onTypeChange(event: any) {
    this.updateForm(event.value);
  }

  updateForm(value: any) {
    this.selectedtype = value;
    const numberControl = this.financeDetailsForm.get('number');

    if (this.selectedtype === 'Bank Details') {
      numberControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{9,18}$')]); // Example for 9 to 18 digits

      this.financeDetailsForm.get('ifscCode')?.setValidators([]);
      this.financeDetailsForm.get('accountType')?.setValidators([]);
      this.financeDetailsForm.get('ifscCode')?.updateValueAndValidity();
      this.financeDetailsForm.get('accountType')?.updateValueAndValidity();
    } else if (this.selectedtype === 'PAN Card' || this.selectedtype === 'Aadhaar Card') {
      this.financeDetailsForm.get('ifscCode')?.clearValidators();
      this.financeDetailsForm.get('accountType')?.clearValidators();
      this.financeDetailsForm.get('ifscCode')?.updateValueAndValidity();
      this.financeDetailsForm.get('accountType')?.updateValueAndValidity();
    }

    if (this.selectedtype === 'PAN Card') {
      numberControl?.setValidators([Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]);
    } else if (this.selectedtype === 'Aadhaar Card') {
      numberControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{12}$')]);
    }

    numberControl?.updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeId']) {
      this.getFinanceDetails();
    }
  }
  async getFinanceDetails() {
    if (this.employeeId > 0) {

      await this.employeeService.getEmployee<FinanceDetails[]>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/FinDetails").subscribe({
        next: (response) => {

          this.financeDetailsData = response.data;
          let uniqueTypes = new Set();

          this.financeDetailsData.forEach(element => {
            if (
              element.type === 'Bank Details' ||
              element.type === 'PAN Card' ||
              element.type === 'Aadhaar Card'
            ) {
              uniqueTypes.add(element.type); // Add unique types to the set
            }
          });

          this.documentType = this.documentTypeDummy.filter(
            (item) => !this.financeDetailsData.some((doc) => doc.type === item.name)
          );

          let count = uniqueTypes.size;
          this.financeCount.emit(count);
          this.financeDetailsData = response.data.map((finance) => {
            const financeData: FinanceDetails = {
              ...finance,
              attachmentURL: finance.attachmentFile
            };
            return financeData;

          });
        }
      })
    }
  }

  addFinacialDetails() {
    this.files = [];
    this.formDirective.resetForm();
    this.financeDetailsForm.reset();
    this.addFinacialDetailsModel?.show();
  }

  closeFinacialDetails() {
    this.formDirective.resetForm();
    this.financeDetailsForm.reset();
    this.files = [];
    this.addFinacialDetailsModel?.hide();
  }


  filesDropped(files: FileHandle[]): void {
    if (files[0].name.endsWith('.jpg') || files[0].name.endsWith('.jpeg') || files[0].name.endsWith('.png')) {
      this.files = files;
      this.financeDetailsForm.patchValue({
        attachmentFile: this.files[0].file
      });

      this.UploadFlag = 1;

    } else {
      this.toaster.warningToaster('We allow only JPG, JPEG and PNG file!!')

    }

  }

  handleFileSizeErrors(errors: string[]) {
    errors.forEach(error => {
      this.toaster.errorToaster(error);
    });
  }

  triggerProfileFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
    this.UploadFlag = 1;

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
        if (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png')) {
          this.files.push({ file, url, name });
          this.financeDetailsForm.patchValue({
            attachmentFile: file
          });
          this.UploadFlag = 1;

        } else {
          this.toaster.warningToaster('We allow only JPG, JPEG and PNG file!!')

        }
      }
    }
  }

  removeFile() {
    this.UploadFlag = 2;
    this.files = [];
  }

  editdoc(item: FinanceDetails) {

    if (item.attachmentFile != null && item.attachmentFile != '' && item.attachmentFile != undefined && item.attachmentFile != 'null') {
      let documentname = AppConstant.getActualFileName(item.attachmentFile);
      this.files = [];
      this.files.push({
        url: this.baseImageUrl + item.attachmentFile,
        name: (documentname?.split(/[/\\]/).pop() || "") as string,
      });

      this.UploadFlag = 3;

    }
    this.financeDetailsForm.patchValue({
      id: item.id,
      type: item.type,
      name: item.name,
      number: item.number,
      accountType: item.accountType,
      attachmentFile: item.attachmentFile,
      ifscCode: item.ifscCode
    });

    this.updateForm(item.type);

    this.addFinacialDetailsModel?.show();
  }

  async deletedoc(item: FinanceDetails) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        let params = new HttpParams().set('Id', item.id);
        await this.employeeService.deleteEmployee<FinanceDetails>(AppConstant.POST_EMPLOYEE_FINANCE, params).subscribe({
          next: (response) => {
            if (response.success && response.status === 200) {
              this.toaster.successToaster(response.message);
              this.getFinanceDetails();
            } else {
              this.toaster.warningToaster(response.message);
            }
          }
        })
      } else {
        return;
      }
    });
  }
  getcount(): number {
    let uniqueTypes = new Set();

    this.financeDetailsData.forEach(element => {
      if (
        element.type === 'Bank Details' ||
        element.type === 'PAN Card' ||
        element.type === 'Aadhaar Card'
      ) {
        uniqueTypes.add(element.type); // Add unique types to the set
      }
    });

    let count = uniqueTypes.size;
    this.financeCount.emit(count);
    return count;
  }
}
