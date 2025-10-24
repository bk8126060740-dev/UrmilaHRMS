import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientList, ProjectClientListModel } from '../../../../../../domain/models/paymentreciveable.model';
import { FileList, PayrollListByProject } from '../../../../../../domain/models/payroll.model';
import { HttpParams } from '@angular/common/http';
import { BankSheetService } from '../../../../../../domain/services/banksheet.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { BankAccountModel } from '../../../../../../domain/models/bank.model';
import { ProjectPayrollAttributeDaum } from '../../../../../../domain/models/projectPayrollAttribute.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from '../../../../../../common/toaster-service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-bank-sheet-list',
  templateUrl: './bank-sheet-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './bank-sheet-list.component.scss'
})
export class BankSheetListComponent implements OnInit {
  bankSheetListForm!: FormGroup;
  clientList: ClientList[] = [];
  projectList: ProjectClientListModel[] = [];
  payrollList: PayrollListByProject[] = [];
  isViewMode: boolean = false;
  bankList: BankAccountModel[] = [];
  attributeArray: ProjectPayrollAttributeDaum[] = [];
  salarySheetList: FileList[] = [];
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  UTRForm!: FormGroup;
  isUploadSubmitted: boolean = false;
  @ViewChild("UTRModal", { static: false }) public UTRModal: ModalDirective | undefined;
  totalCount: number = 0;
  pageNumber: number = 1;
  recordCount: number = 100;

  constructor(private fb: FormBuilder,
    private bankSheetService: BankSheetService,
    private toasterService: ToasterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bankSheetListForm = new FormGroup({
      selectedClientId: new FormControl(null, Validators.required),
      selectedProjectId: new FormControl(null, Validators.required),
      selectedPayrollId: new FormControl(null, Validators.required),
      selectedBankId: new FormControl(null, Validators.required),
      selectedPayrollAttributeId: new FormControl(null, Validators.required)
    });

    this.UTRForm = new FormGroup({
      bankSheetId: new FormControl(null, Validators.required),
      txtFile: new FormControl(null, Validators.required),
      pdffile: new FormControl(null, Validators.required),
      excelFile: new FormControl(null, Validators.required)
    });

    this.getClientList();
    this.getBankResourceData();
  }

  getClientList(): void {
    this.projectList = [];
    this.payrollList = [];
    this.bankSheetListForm.patchValue({
      selectedProjectId: null,
      selectedPayrollId: []
    });
    const params = new HttpParams()
      .set('isSkipPaging', true)
      .set('searchTerm', this.bankSheetListForm.value.name || '');

    this.bankSheetService.getBankSheet(AppConstant.GET_CLIENT_SEARCH, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.clientList = response.data as ClientList[];
        } else {
          this.clientList = [];
        }
      }
    });
  }

  getProjectClientList(clientId: number): void {
    const params = new HttpParams()
      .set('searchText', '')
      .set('clientId', clientId)
      .set('isSkipPaging', true)

    this.bankSheetService.getBankSheet(AppConstant.GET_PROJECT + '/Search', params).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectList = response.data as ProjectClientListModel[];
        } else {
          this.projectList = [];
        }
      }
    });
  }

  async onProjectChange(): Promise<void> {
    if (this.bankSheetListForm.value.selectedProjectId != null) {
      this.bankSheetListForm.patchValue({
        selectedPayrollId: []
      });
      let params = new HttpParams()
        .set('ProjectIds', this.bankSheetListForm.value.selectedProjectId)
        .set('isSkipPaging', true)

      await this.bankSheetService.getBankSheet<PayrollListByProject[]>(AppConstant.GET_PAYROLL_BY_PROJECT, params).subscribe({
        next: (response) => {
          if (response.success) {
            this.payrollList = [];
            response.data.forEach((payroll) => {
              this.payrollList.push({
                ...payroll,
                displayName: `(${payroll.month} - ${payroll.year})- ${payroll.name}`
              });
            });

            this.payrollList.sort((a: PayrollListByProject, b: PayrollListByProject) => {
              if (a.year !== b.year) {
                return a.year - b.year;
              }
              return a.month - b.month;
            });

          } else {
            this.payrollList = [];
          }
        }
      });

      await this.bankSheetService.getBankSheet<ProjectPayrollAttributeDaum[]>(`${AppConstant.GET_PROJECTATTRIBUTEBYPROJECTEWITHOUTFILTER}${this.bankSheetListForm.value.selectedProjectId}`).subscribe({
        next: (response) => {
          if (response) {
            this.attributeArray = response.data;
          }
        }
      });
    }
  }

  async getBankResourceData() {
    let params = new HttpParams()
      // .set("RecordCount", this.recode.toString())
      // .set("PageNumber", this.pageNumber.toString())
      // .set("FilterBy", this.searchTerm)
      // .set("OrderBy", this.orderby);

      .set("SearchTerm", '')
      .set("IsSkipPaging", true);

    await this.bankSheetService.getBankSheet<BankAccountModel[]>(AppConstant.GET_BANKRESOURCE + '/Search', params).subscribe({
      next: (response) => {
        if (response) {
          this.bankList = response.data;
        }
      }
    });
  }
  downloadOldBankTransferSheet() {
    this.bankSheetListForm.controls['selectedBankId'].setValidators(Validators.required);
    this.bankSheetListForm.controls['selectedPayrollAttributeId'].setValidators(Validators.required);
    this.bankSheetListForm.controls['selectedBankId'].updateValueAndValidity();
    this.bankSheetListForm.controls['selectedPayrollAttributeId'].updateValueAndValidity();
    if (this.bankSheetListForm.valid) {
      const item: FileList = {
        payrollId: this.bankSheetListForm.value.selectedPayrollId,
        payrollName: this.bankSheetListForm.value.selectedPayrollId,
        payrollAttributeId: this.bankSheetListForm.value.selectedPayrollAttributeId,
        payrollAttributeName: this.bankSheetListForm.value.selectedPayrollAttributeId,
        month: this.bankSheetListForm.value.selectedPayrollId.month,
        bankResourceId: this.bankSheetListForm.value.selectedBankId,
        bankSheetId: this.bankSheetListForm.value.selectedPayrollId.id,
        bankResources: this.bankSheetListForm.value.selectedPayrollId.name,
        errorFilePath: null,
        status: 0,
        statusName: "",
        attachments: [],
        colorCode: ""
      }
      this.reDownloadbankSheet(item);

    }

  }


  async reDownloadbankSheet(fileList: FileList) {

    const params = new HttpParams()
      .set('payrollId', fileList.payrollId)
      .set('payrollAttributeId', fileList.payrollAttributeId)
      .set('bankId', fileList.bankResourceId);

    await this.bankSheetService.getDownloadBankSheet(AppConstant.PAYROLL_BANK_SHEET + '/BankTransferExcelSheet', params).subscribe({
      next: (blob: Blob) => {
        if (blob && blob instanceof Blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const payrollId = fileList.payrollId;
          const payroll = this.payrollList.find(p => p.id === payrollId);
          let bankname = this.bankList.find(bank => bank.id === fileList.bankResourceId)?.bankName || 'UnknownBank';
          let projectName = '';
          if (payroll) {
            if (this.bankSheetListForm.value.selectedProjectId) {
              projectName = this.projectList.find(p => p.id === this.bankSheetListForm.value.selectedProjectId)?.name || '';
            }
            a.download = `${projectName.toUpperCase()}_${fileList.month}_${bankname.toUpperCase()}_EmployeeBank_Sheet.xlsx`;
          }
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      },
      error: (error) => {
      }
    });
  }


  onClientChange(): void {
    this.getProjectClientList(this.bankSheetListForm.value.selectedClientId);
  }

  async viewDetails() {
    this.bankSheetListForm.controls['selectedBankId'].clearValidators();
    this.bankSheetListForm.controls['selectedPayrollAttributeId'].clearValidators();
    this.bankSheetListForm.controls['selectedBankId'].updateValueAndValidity();
    this.bankSheetListForm.controls['selectedPayrollAttributeId'].updateValueAndValidity();

    this.isViewMode = true;
    if (this.bankSheetListForm.valid) {
      let param = new HttpParams().set('payrollId', this.bankSheetListForm.value.selectedPayrollId);
      await this.bankSheetService.getPaginationData<FileList>(`${AppConstant.GET_PAYROLL_BANK_SHEET}`, param).subscribe({
        next: (response) => {
          if (response) {
            this.salarySheetList = response.data.list;
            this.totalCount = response.data.totalCount;
          }
        }
      });
    }
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files && event.target.files.length ? event.target.files[0] : null;
    if (file) {
      if (controlName === 'txtFile') {
        // Check if file is CSV
        if (!file.name.toLowerCase().endsWith('.txt')) {
          this.toasterService.warningToaster('Please upload only TXT files', 'warning');
          event.target.value = ''; // Clear the file input
          return;
        }
      } else if (controlName === 'pdffile') {
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          this.toasterService.warningToaster('Please upload only PDF files', 'warning');
          event.target.value = ''; // Clear the file input
          return;
        }
      } else if (controlName === 'excelFile') {
        if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.csv')) {
          this.toasterService.warningToaster('Please upload only Excel or CSV files', 'warning');
          event.target.value = ''; // Clear the file input
          return;
        }
      }

    }
    this.UTRForm.patchValue({ [controlName]: file });
    this.UTRForm.get(controlName)?.updateValueAndValidity();
  }

  clearFile(controlName: string): void {
    this.UTRForm.patchValue({ [controlName]: null });
    this.UTRForm.get(controlName)?.updateValueAndValidity();
  }

  closeUTRModal() {
    this.isUploadSubmitted = false;
    this.UTRModal?.hide();
    this.UTRForm.reset();
  }

  uploadUTRDocument() {
    this.isUploadSubmitted = true;
    if (this.UTRForm.valid) {
      const formData = new FormData();
      formData.append('bankSheetId', this.UTRForm.value.bankSheetId.toString());

      formData.append('UTRAttachments[0].filePath', this.UTRForm.value.txtFile);
      formData.append('UTRAttachments[0].fileType', '588');

      formData.append('UTRAttachments[1].filePath', this.UTRForm.value.pdffile);
      formData.append('UTRAttachments[1].fileType', '587');


      formData.append('UTRAttachments[2].filePath', this.UTRForm.value.excelFile);
      formData.append('UTRAttachments[2].fileType', '586');

      this.bankSheetService.postBankSheet(AppConstant.PAYROLL_BANK_SHEET_UTR_UPLOAD, formData).subscribe({
        next: (response) => {
          this.toasterService.successToaster('UTR document uploaded successfully', 'success');
          this.closeUTRModal();
          this.getBankResourceData();
        }
      });
    }
  }

  openUTRModal(item: FileList) {
    this.UTRForm.patchValue({
      bankSheetId: item.bankSheetId
    });
    this.UTRModal?.show();

  }

  viewRecord(item: FileList) {
    const navigationExtras: NavigationExtras = {
      state: {
        UTRData: item
      },
    };
    this.router.navigate(['/payroll/bank-sheet-report'], navigationExtras);
  }
}
