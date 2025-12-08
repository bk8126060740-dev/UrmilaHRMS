import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToasterService } from '../../../../../../common/toaster-service';
import { HttpParams } from '@angular/common/http';
import { AppConstant } from '../../../../../../common/app-constant';
import { PayrollService } from '../../../../../../domain/services/payroll.service';
import { NavigationExtras, Router } from '@angular/router';
import swal from "sweetalert";
import { BaseResponse } from '../../../../../../domain/models/base.model';
import { ApprovedAttendanceList, FileList, PayrollModel, PFChallanModel, StatusWithCountModel, TaxInvoice, UTRModel } from '../../../../../../domain/models/payroll.model';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { ProjectService } from '../../../../../../domain/services/project.service';
import { SignalRService } from '../../../../../../common/signal-R.service';
import { ProjectPayrollAttributeService } from '../../../../../../domain/services/projectPayrollAttribute.service';
import { ProjectPayrollAttributeDaum } from '../../../../../../domain/models/projectPayrollAttribute.model';
import { JwtService } from '../../../../../../common/jwtService.service';
import { BankModel } from '../../../../../../domain/models/bank.model';
import { ProjectDaum } from '../../../../../../domain/models/project.model';
import { FileHandle } from '../../../../../../directive/dragDrop.directive';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { boolean } from 'mathjs';
import { AccountreportService } from '../../../../../../domain/services/account-report.service';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './payroll.component.scss'
})

export class PayrollComponent {
  rowData: PayrollModel[] = [];
  rowData1: any[] = [];

  statusWithCounts: StatusWithCountModel[] = [];
  selectedStatus: StatusWithCountModel = new StatusWithCountModel();
  defualtSelectedStatus: StatusWithCountModel = new StatusWithCountModel();
  payrollModel: PayrollModel = new PayrollModel();
  projectDataModel: ProjectDaum = new ProjectDaum();
  totalCount: number = 0;
  payrollForm!: FormGroup;
  banksheetForm!: FormGroup;
  pfchallanForm!: FormGroup;
  esicchallanForm!: FormGroup;
  utrForm!: FormGroup;
  pageNumber: number = 1;
  recode: number = 12;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  submitted = false;
  projectId: number = 0;
  attributeArray: ProjectPayrollAttributeDaum[] = [];
  bankList: BankModel[] = [];
  pfchallan: PFChallanModel[] = [];
  pfChallanList: PFChallanModel[] = [];
  utrModel: UTRModel[] = [];
  projectName = '';
  salarySheetList: FileList[] = [];
  yearsList: { label: string, value: number }[] = [];
  selectedYear: number = new Date().getFullYear();
  monthList: { label: string, value: number }[] = AppConstant.MONTH_DATA.map(month => ({ label: month.monthName, value: month.id }));
  currentYear: any;
  UploadFlag: number = 1;
  files: FileHandle[] = [];
  selectedFile: File[] = [];
  selectedFileName: string | null = null;
  PFDocUrl: SafeResourceUrl | null = null;
  isFileInputOpen: boolean = false;
  PayrollId: any
  payrollId: number | null = null;
  bankSheetId: number = 0;
  pfuploadedPayRollId: number = 0;
  esicuploadedPayRollId: number = 0;
  utruploadedPayRollId: number = 0;
  dropdownSubscription: any;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  taxInvoiceForm!: FormGroup;
  maxDate: Date = new Date();
  tallyPartialForm!: FormGroup;
  selectedFiles: File[] = [];
  @ViewChild("tallyPartialmodal", { static: false }) public tallyPartialmodal: | ModalDirective | undefined;
  InvoicefilerowData: any = [];



  @ViewChild("payrollmodal", { static: false }) public payrollmodal: | ModalDirective | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  @ViewChild("banksheetformDirective", { static: false }) banksheetformDirective!: NgForm;
  @ViewChild("banksheetmodal", { static: false }) banksheetmodal: any | ModalDirective | undefined;
  @ViewChild("pfchallanformDirective", { static: false }) pfchallanformDirective!: NgForm;
  @ViewChild("pfchallanmodal", { static: false }) pfchallanmodal: any | ModalDirective | undefined;
  @ViewChild("esicchallanformDirective", { static: false }) esicchallanformDirective!: NgForm;
  @ViewChild("esicchallanmodal", { static: false }) esicchallanmodal: any | ModalDirective | undefined;
  @ViewChild("utrformDirective", { static: false }) utrformDirective!: NgForm;
  @ViewChild("utrmodal", { static: false }) utrmodal: any | ModalDirective | undefined;
  @ViewChild("taxInvoiceModel", { static: false }) taxInvoiceModel: any | ModalDirective | undefined;
  lastDownloadedPath?: string;
  useProxyDownload: any = boolean;



  constructor(
    private toaster: ToasterService,
    private formBuilder: FormBuilder,
    private payrollService: PayrollService,
    private router: Router,
    private headerDropdownService: HeaderDropdownService,
    private localStorageService: LocalStorageService,
    private projectService: ProjectService,
    private signalRService: SignalRService,
    private projectPayrollAttributeService: ProjectPayrollAttributeService,
    private jwtService: JwtService,
    private sanitizer: DomSanitizer,
    private accountreportService: AccountreportService,

  ) {
    this.taxInvoiceForm = this.formBuilder.group({
      invoiceNumber: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      invoiceAmount: ['', [Validators.required, Validators.min(0)]],
      remarks: ['', Validators.required],
      file: [null, Validators.required]
    });

    this.projectName = this.localStorageService.getItem(AppConstant.PROJECTNAME) ?? '';

    this.projectId = this.jwtService.getProjectId() ?? 0;

    this.signalRService.on('PayrollProcessed', (message: string) => {
      this.getPayrollallData();

    });

    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);
      if (value != project) {
        this.getPayrollallData();
      }
    });
    this.banksheetForm = this.formBuilder.group({
      payrollId: ['', Validators.required],
      attrubuteId: ['', Validators.required],
      bankId: ['', Validators.required]
    });
    this.payrollForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      month: ['', Validators.required],
      year: [this.currentYear, Validators.required],
      desciption: ['', Validators.required],
      projectAttendanceId: ['', Validators.required],
      status: [''],
    });
    this.pfchallanForm = this.formBuilder.group({
      payrollId: ['', Validators.required],
      file: [File, Validators.required]
    });
    this.esicchallanForm = this.formBuilder.group({
      payrollId: ['', Validators.required],
      file: [File, Validators.required]
    });
    this.utrForm = this.formBuilder.group({
      bankSheetId: ['', Validators.required],
      file: [File, Validators.required]
    });


    this.getPayrollallData();
    this.selectedYear = new Date().getFullYear();
    this.getPayrollYears();


    this.payrollForm.controls['month'].valueChanges.subscribe((newValue) => {
      if (newValue != null && this.payrollForm.controls['year'].value != '' && this.payrollForm.controls['year'].value != null) {
        this.getPayrollList();
      }
    });

    this.payrollForm.controls['year'].valueChanges.subscribe((newValue) => {
      if (newValue != null && this.payrollForm.controls['month'].value != '' && this.payrollForm.controls['month'].value != null) {
        this.getPayrollList();
      }
    });

  }

  approvedAttendanceList: ApprovedAttendanceList[] = [];
  async getPayrollList() {
    let params = new HttpParams()
      .set("Year", this.payrollForm.controls['year'].value)
      .set("Month", this.payrollForm.controls['month'].value);
    await this.payrollService.getPayrollAllData<ApprovedAttendanceList[]>(AppConstant.GET_PAYROLL_ATTENDANCE, params).subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.approvedAttendanceList = response.data;
        } else {
          this.approvedAttendanceList = [];
          this.toaster.warningToaster("No attendance records found for the selected month and year.");
        }
      }
    })
  }

  isFilterVisible = false;
  recodeCount: number = 10;
  currentPage: number = 1;
  startItem: number = 1;
  endItem: number = this.recodeCount;

  getPayrollYears(): void {
    this.currentYear = new Date().getFullYear();
    for (let year = this.currentYear - 5; year <= this.currentYear; year++) {
      this.yearsList.push({ label: year.toString(), value: year });
    }
  }

  onYearChange(event: any): void {
    const YearObj = {
      year: this.selectedYear,
    };
    this.getPayrollallData(YearObj);
  }

  onRecodeChange(event: Event) {
    this.endItem = parseInt((event.target as HTMLSelectElement).value);
    this.recodeCount = parseInt((event.target as HTMLSelectElement).value);

  }

  pageChanged(event: any): void {
    this.startItem = ((event.page - 1) * event.itemsPerPage) + 1;
    this.endItem = this.totalCount < event.page * event.itemsPerPage ? this.totalCount : event.page * event.itemsPerPage;

  }

  async getPayrollallData(YearObj: any | null = null) {
    let params = new HttpParams()
      .set("Year", this.selectedYear)
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby)
      .set("IsPagingSkip", true);

    await this.payrollService.getPayrollAllData<PayrollModel[]>(AppConstant.PAYROLL, params).subscribe({
      next: (responce: any) => {
        this.statusWithCounts = [];
        if (responce && responce.success) {
          this.rowData = responce.data.payrolls.filter(
            (payroll: any) => payroll.year === this.selectedYear
          );

          this.rowData = responce.data.payrolls.map((item: PayrollModel) => ({
            ...item,
            monthName: AppConstant.MONTH_DATA.find(month => month.id === item.month)?.monthName
          }));
          const prevSelectedStatus = this.selectedStatus ? { ...this.selectedStatus } : null;

          const totalRecordStatus = new StatusWithCountModel();
          totalRecordStatus.count = responce.data.statusCount;
          totalRecordStatus.id = 0;
          totalRecordStatus.name = "Total Records";
          this.statusWithCounts.push(totalRecordStatus);
          this.statusWithCounts.push(...responce.data.statusWithCounts);


          this.totalCount = responce.data.statusCount;

          this.selectedStatus = this.statusWithCounts.find(status => status.id === prevSelectedStatus?.id) || totalRecordStatus;

          const selectedStatus = this.statusWithCounts.find(status => status.id === this.selectedStatus?.id);
          this.totalCount = selectedStatus ? selectedStatus.count : 0;

          this.startItem = this.rowData.length > 0 ? 1 : 0;
          this.endItem = Math.min(this.rowData.length, this.totalCount);

          this.rowData.forEach((payroll) => {
            const matchingStatus = responce.data.statusWithCounts.find(
              (status: any) => status.id === payroll.status
            );
            if (matchingStatus) {
              payroll.colorCode = matchingStatus.colorCode;
            }


            payroll.statusColorCode = payroll.colorCode;
          });
        } else {
          this.rowData = [];
          this.statusWithCounts = [];
          this.totalCount = 0;
        }
      }
    });
  }

  DownloadInvoice(item: any) {
    const filePath: string = item.payrollPath;
    if (filePath) {
      item.downloadUrl = filePath;
      this.lastDownloadedPath = filePath;

      if (this.useProxyDownload) {
        AppConstant.getDownloadFile(filePath);
      } else {
        this.downloadPdfFile(filePath);
      }
    } else {
      this.toaster.warningToaster('No file available for download.');
    }
  }

  downloadPdfFile(fileUrl: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'invoice.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  InvoiceFile(PayrollId: any) {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to generate the invoice?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then(async (willGenerate) => {
      if (!willGenerate) return;

      let formData = new FormData();
      formData.append('PayrollId', PayrollId.id.toString());

      this.projectService.postFormProject(formData, AppConstant.GET_PROJECT + '/GenerateInvoice')
        .subscribe({

          next: (res: any) => {
            if (res?.success) {
              this.toaster.successToaster(res.message || "Invoice generated successfully");
              this.getPayrollallData();
            }
            // else {
            //   this.toaster.warningToaster(res?.message || "Failed to generate invoice");
            // }
          },
          error: () => {
            this.toaster.successToaster("Invoice generated successfully");

            //this.toaster.errorToaster("Something went wrong");
          }
        });
    });
  }



  // InvoiceFile(PayrollId: any) {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Are you sure that you want to generate the invoice?",
  //     icon: "warning",
  //     buttons: ["No", "Yes"],
  //     dangerMode: true,
  //   }).then(async (willDelete) => {
  //     if (willDelete) {

  //       let formData = new FormData();
  //       formData.append('PayrollId', PayrollId.id.toString())
  //       this.projectService.getDownloadUploadFile(AppConstant.GET_PROJECT + '/GenerateInvoice', formData).subscribe({
  //         next: (blob: Blob) => {

  //           if (blob && blob instanceof Blob) {
  //             const url = window.URL.createObjectURL(blob);
  //             const a = document.createElement('a');
  //             a.href = url;
  //             a.download = this.projectName.toUpperCase() + "_" + PayrollId.monthName.slice(0, 3) + "_" + PayrollId.year + "_Invoice.pdf";
  //             document.body.appendChild(a);
  //             a.click();
  //             document.body.removeChild(a);
  //             window.URL.revokeObjectURL(url);
  //             this.getPayrollallData();
  //           }
  //         },
  //         error: (error) => {

  //         }
  //       });
  //     }
  //   });
  // }

  taxInvoice: TaxInvoice[] = [];

  uploadTaxInvoiceFile(PayrollId: any) {
    this.payrollId = PayrollId.id;
    this.payrollService.getPayrollAllData<TaxInvoice[]>(AppConstant.PAYROLL_TEXT_INVOICE_ATTACHMENT + "/" + PayrollId.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.taxInvoice = response.data;
          if (this.taxInvoice.length > 0) {
            // Disable the form when tax invoices exist
            this.taxInvoiceForm.disable();
            this.taxInvoiceForm.patchValue({
              invoiceNumber: this.taxInvoice[0].number,
              invoiceDate: this.taxInvoice[0].invoiceDate,
              invoiceAmount: this.taxInvoice[0].amount,
              remarks: this.taxInvoice[0].remarks,
              file: null
            });
          } else {

            // Enable the form when no tax invoices exist
            this.taxInvoiceForm.enable();
          }
        } else {
          this.taxInvoice = [];
          this.taxInvoiceForm.enable();
        }
      }, error: (error) => {
        this.taxInvoice = [];
        this.taxInvoiceForm.enable();
      }
    })
    this.taxInvoiceModel.show()
  }


  downloadTaxInvoice(filePath: any) {
    AppConstant.getDownloadFile(filePath);
  }

  deleteTaxInvoice(item: any) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {

        this.payrollService.deletePayrollById<TaxInvoice>(AppConstant.PAYROLL_TEXT_INVOICE_ATTACHMENT + "/" + item).subscribe({
          next: (response) => {
            if (response.success) {
              this.toaster.successToaster(response.message);
              this.taxInvoice = [];
              this.uploadTaxInvoiceFile({ id: item });
            } else {
              this.toaster.errorToaster(response.message);
            }
          }, error: (error) => {
            this.toaster.errorToaster(error.message);
          }
        })
      }
    });
  }

  uploadTaxInvoice() {
    this.taxInvoiceForm.markAllAsTouched();
    if (this.taxInvoiceForm.valid) {
      const formData = new FormData();
      formData.append('Number', this.taxInvoiceForm.get('invoiceNumber')?.value);
      formData.append('InvoiceDate', new Date(this.taxInvoiceForm.get('invoiceDate')?.value).toISOString());
      formData.append('Amount', this.taxInvoiceForm.get('invoiceAmount')?.value);
      formData.append('Remarks', this.taxInvoiceForm.get('remarks')?.value);
      formData.append('PayrollId', this.payrollId ? this.payrollId.toString() : '');
      formData.append('File', this.taxInvoiceForm.get('file')?.value);


      this.payrollService.postPayroll(formData, AppConstant.PAYROLL_TEXT_INVOICE_ATTACHMENT).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.successToaster(response.message);
            this.taxInvoiceModel?.hide();
            this.taxInvoiceForm.reset();
          }
        },
        error: (error) => {
          this.toaster.errorToaster(error.message);
        }
      });

    }
  }

  downloadOldBankTransferSheet(item: FileList) {
    this.banksheetForm.patchValue({
      attrubuteId: item.payrollAttributeId,
      payrollId: item.payrollId,
      bankId: item.bankResourceId
    });
    this.downloadBankTransferSheet();

  }


  async downloadBankTransferSheet() {

    if (this.banksheetForm.valid) {
      //   title: "Are you sure?",
      //   text: "Are you sure that you want to download the bank transfer sheet?",
      //   icon: "warning",
      //   dangerMode: true,

      const params = new HttpParams()
        .set('payrollId', this.banksheetForm.value.payrollId)
        .set('payrollAttributeId', this.banksheetForm.value.attrubuteId)
        .set('bankId', this.banksheetForm.value.bankId);

      await this.projectService.getDownloadBankTransferSheet(AppConstant.PAYROLL_BANK_SHEET + '/BankTransferExcelSheet', params).subscribe({
        next: (blob: Blob) => {
          if (blob && blob instanceof Blob) {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const payrollId = this.banksheetForm.value.payrollId;
            const payroll = this.rowData.find(p => p.id === payrollId);
            let bankname = this.bankList.find(bank => bank.id === this.banksheetForm.value.bankId)?.bankName || 'UnknownBank';

            if (payroll) {
              if (this.projectName === 'undefined') {
                this.projectName = this.localStorageService.getItem(AppConstant.PROJECTNAME) ?? '';
              }
              const monthName = payroll.monthName;
              const year = payroll.year;
              a.download = `${this.projectName.toUpperCase()}_${monthName.slice(0, 3)}_${year}_${bankname.toUpperCase()}_EmployeeBank_Sheet.xlsx`;
            }
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.closebanksheetmodal();
            this.getPayrollallData();
          }
        },
        error: (error) => {
        }
      });
    }
  }

  async onStatusCardClick(status: any, event: Event) {
    this.searchTerm = "";
    this.selectedStatus = status;
    if (status.name == "Total Records") {
      this.getPayrollallData();
    } else {
      this.searchTerm = `status eq ${status.id}`;
      await this.getPayrollallData();
    }
  }

  onSearch(event: any) {
    const monthValue = event?.month && !isNaN(Number(event.month)) ? event.month : 12;
    const queryString = `month = ${monthValue}`;
    const encodedQuery = encodeURIComponent(queryString);
    this.searchTerm = `${encodedQuery}`;
    this.getPayrollallData();
  }

  onSubmit() {
    this.submitted = true;
    if (this.payrollForm.invalid) {
      return;
    }
    this.savePayroll();
  }

  savePayroll() {
    const data = this.payrollForm.value;
    let obj = {
      name: data.name,
      month: data.month,
      year: data.year,
      desciption: data.desciption,
      projectAttendanceId: data.projectAttendanceId
    };
    if (data.id == null && data.status == null) {
      this.payrollService.postPayroll(obj, AppConstant.PAYROLL).subscribe({
        next: (response: any) => {
          if (response.success == true) {
            this.toaster.successToaster(response.message);
            this.payrollmodal?.hide();
            this.formDirective.resetForm();
            this.getPayrollallData();
          }
        }
      });
    }
    this.getPayrollallData();
  }

  onEdit(event: any) {
    this.payrollForm.patchValue({
      id: event.id,
      name: event.name,
      month: event.month,
      year: event.year,
      desciption: event.description,
      status: event.status,
    });
    this.payrollmodal?.show();
  }

  onDelete(event: any): void {
    if (event && event.id && event.status != 146) {
      this.onDeletePayroll(event.id);
    }
  }

  onDeletePayroll(id: number): void {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.deletePayroll(id);
      }
    });
  }

  deletePayroll(id: number): void {
    this.payrollService.deletePayrollById(`${AppConstant.PAYROLL}/${id}`).subscribe({
      next: (response: BaseResponse<any>) => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
          this.getPayrollallData();
        } else {
          this.toaster.errorToaster(response.message);
        }
      }
    });
  }

  viewRecord(row: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        payrollEmployeeSummaryData: row
      },
    };
    this.router.navigate(['/payroll/payrolldetails'], navigationExtras);
  }


  changePayrollStatus(event: any) {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to regenerate the payroll?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let updateObj = {
          id: event.id,
          status: 144
        };
        this.payrollService.putPayroll(updateObj, `${AppConstant.PAYROLL}/${event.id}`).subscribe({
          next: (response: any) => {
            if (response.success == true) {
              this.toaster.successToaster(response.message);
              this.payrollmodal?.hide();
              this.formDirective.resetForm();
              this.getPayrollallData();
            }
          }
        });
      }
    });
  }

  onInsert() {
    this.payrollModel = new PayrollModel();
    this.formDirective.resetForm();
    this.payrollmodal?.show();
  }

  onPageChange(page: any) {
    this.pageNumber = page;
    this.getPayrollallData();
  }

  onTotalPayrollValueChange(totalDepartment: any) {
    this.recode = totalDepartment;
    this.pageNumber = 1;
    this.getPayrollallData();
  }

  orderBy(event: any) {
    event = event.replace(/monthName/g, "month");
    this.orderby = event;
    this.getPayrollallData();
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }

  async openModel(event: any) {
    let bankParam = new HttpParams()
      .set('IsSkipPaging', true);
    await this.payrollService.getPayrollAllData<BankModel[]>(AppConstant.GET_BANK_SEARCH, bankParam).subscribe({
      next: (response) => {
        if (response) {
          this.bankList = response.data;
        }
      }
    });

    await this.projectPayrollAttributeService.getProjectPayrollAttribute(`${AppConstant.GET_PROJECTATTRIBUTEBYPROJECTEWITHOUTFILTER}${this.projectId}`).subscribe({
      next: (response) => {
        if (response) {
          this.attributeArray = response.data;
        }
      }
    });

    this.banksheetForm.patchValue({
      payrollId: event.id,
    })


    //     attrubuteId: -1,
    this.banksheetmodal?.show();
  }

  closebanksheetmodal() {
    this.banksheetformDirective.resetForm();
    this.banksheetForm.reset();
    this.banksheetmodal?.hide();
  }

  closebanksheetmodalUTR() {
    this.banksheetmodal?.hide();
  }

  closeTaxInvoiceModel() {
    this.payrollId = 0;
    this.taxInvoice = [];
    this.taxInvoiceForm.enable();
    this.taxInvoiceForm.reset();
    this.taxInvoiceModel?.hide();
  }

  closepfchallanmodal() {
    this.pfchallanformDirective.resetForm();
    this.pfchallanForm.reset();
    this.selectedFile = [];
    this.pfchallanmodal?.hide();
    this.pfChallanList = [];
  }

  closeesicchallanmodal() {
    this.esicchallanformDirective.resetForm();
    this.esicchallanForm.reset();
    this.selectedFile = [];
    this.esicchallanmodal?.hide();
  }

  //       file: this.selectedFile,

  filesDropped(files: FileHandle[]): void {
    if (files.length > 0) {
      const droppedFile = files[0].file;

      if (!droppedFile) {
        this.toaster.warningToaster('No file was dropped.', 'warning');
        return;
      }

      const isDuplicate = this.selectedFile.some(existingFile =>
        existingFile.name === droppedFile.name &&
        existingFile.size === droppedFile.size &&
        existingFile.lastModified === droppedFile.lastModified
      );

      if (isDuplicate) {
        this.toaster.warningToaster(`File is already uploaded.`);
        return;
      }

      this.selectedFile.push(droppedFile);
      this.files = files;

      this.banksheetForm.patchValue({
        file: this.selectedFile,
      });

      this.UploadFlag = 1;
    }
  }

  taxInvoicefilesDropped(files: FileHandle[]): void {
    if (files.length > 0) {
      const file = files[0].file;
      const fileName = file?.name ?? '';
      const fileSize = file?.size ?? 0;

      const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];
      const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        this.toaster.warningToaster("We allow only JPG, JPEG, PNG, PDF, DOC, and DOCX files!", 'warning');
        return;
      }

      if (fileSize > AppConstant.FILE5MB) {
        this.toaster.warningToaster(`File "${fileName}" exceeds the size limit of 5MB.`, 'warning');
        return;
      }

      this.taxInvoiceForm.patchValue({
        file: file,
      });
    }
  }

  onTaxInvoiceFileSelected(event: Event) {
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
        this.toaster.warningToaster("We allow only JPG, JPEG, PNG, PDF, DOC, and DOCX files!", 'warning');
        return;
      }
      this.taxInvoiceForm.patchValue({
        file: file,
      });
    }
  }

  onPFDocumentFileSelected(event: Event) {
    this.UploadFlag = 1;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files?.[0];

    if (file.size > AppConstant.FILE5MB) {
      this.toaster.warningToaster(`File "${file.name}" exceeds the size limit of 5MB.`, 'warning');
      input.value = '';
      return;
    }

    // Check for duplicate by name and size
    const isDuplicate = this.selectedFile.some(existingFile =>
      existingFile.name === file.name && existingFile.size === file.size && existingFile.lastModified === file.lastModified
    );

    if (isDuplicate) {
      this.toaster.warningToaster(`File is already uploaded.`);
      input.value = '';
      return;
    }

    this.selectedFile.push(file);
    this.files = [];
    const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    const name = file.name;
    this.files.push({ file, url, name });
    this.pfchallanForm.patchValue({
      file: this.selectedFile,
    });
    input.value = '';
  }

  onESICDocumentFileSelected(event: Event) {
    this.UploadFlag = 1;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (file.size > AppConstant.FILE5MB) {
      this.toaster.warningToaster(`File "${file.name}" exceeds the size limit of 5MB.`, 'warning');
      input.value = '';
      return;
    }

    const isDuplicate = this.selectedFile.some(existingFile =>
      existingFile.name === file.name &&
      existingFile.size === file.size &&
      existingFile.lastModified === file.lastModified
    );

    if (isDuplicate) {
      this.toaster.warningToaster(`File "${file.name}" is already uploaded.`, 'warning');
      input.value = '';
      return;
    }

    this.selectedFile.push(file);
    this.files = [];
    const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    const name = file.name;
    this.files.push({ file, url, name });
    this.esicchallanForm.patchValue({
      file: this.selectedFile,
    });

    input.value = '';

  }

  triggerProfileFileInput(fileInput: HTMLInputElement) {
    this.UploadFlag = 1;
    fileInput.click();
  }

  removeFileTaxInvoice() {
    this.taxInvoiceForm.patchValue({
      file: null,
    });
  }


  removeFilePF(fileToRemove: File) {
    this.UploadFlag = 2;

    // Remove from selectedFile
    this.selectedFile = this.selectedFile.filter(file => file !== fileToRemove);

    // Also update the 'files' array if needed
    this.files = this.files.filter(f => f.file !== fileToRemove);

    // Update form value
    this.pfchallanForm.patchValue({
      file: this.selectedFile.length > 0 ? this.selectedFile : null,
    });
  }



  removeFileESIC(fileToRemove: File) {
    this.UploadFlag = 2;

    // Remove from selectedFile
    this.selectedFile = this.selectedFile.filter(file => file !== fileToRemove);

    // Also update the 'files' array if needed
    this.files = this.files.filter(f => f.file !== fileToRemove);

    // Update form value
    this.esicchallanForm.patchValue({
      file: this.selectedFile.length > 0 ? this.selectedFile : null,
    });
  }

  handleFileSizeErrors(errors: any) {
    errors.forEach((error: any) => {
      this.toaster.errorToaster(error);
    });
  }

  openModelPFChallan(payrollId: any) {
    this.payrollId = payrollId;
    this.pfchallanmodal?.show();
    this.getAllPfChallan(payrollId);
  }

  getAllPfChallan(payrollId: any) {
    let param = new HttpParams().set('payrollId', payrollId.id);
    this.payrollService.getPayrollAllData<PFChallanModel[]>(AppConstant.PAYROLL_PDF_ATTACHMENT, param).subscribe({
      next: (response: any) => {
        this.pfChallanList = response.data;
      }
    });
  }

  getAllESICChallan(payrollId: any) {
    let param = new HttpParams().set('payrollId', payrollId.id);
    this.payrollService.getPayrollAllData<PFChallanModel[]>(AppConstant.PAYROLL_ESIC_ATTACHMENT, param).subscribe({
      next: (response: any) => {
        this.pfChallanList = response.data;
      }
    });
  }

  deletePF(payrollId: any, id: any) {
    this.payrollService.deletePayrollById(AppConstant.PAYROLL_PDF_ATTACHMENT + "/" + id).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
          this.getAllPfChallan({ id: payrollId });
        }
      }
    });
  }

  deleteESIC(payrollId: any, id: any) {
    this.payrollService.deletePayrollById(AppConstant.PAYROLL_ESIC_ATTACHMENT + "/" + id).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
          this.getAllESICChallan({ id: payrollId });
        }
      }
    });
  }

  PFChallan(payrollId: any) {
    this.pfuploadedPayRollId = 0;
    if (!this.selectedFile) {
      this.toaster.warningToaster('Please Select file');
      return;
    }
    this.selectedFile.forEach((file, index) => {
      let formData = new FormData();

      if (file) {
        formData.append('File', file);
      }
      formData.append('PayrollId', payrollId.id.toString());
      this.projectService.postPFChallan(formData, AppConstant.PAYROLL_PDF_ATTACHMENT).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            if (index === this.selectedFile.length - 1) {
              this.pfchallan = response?.data;
              this.toaster.successToaster(response.message);
              this.closepfchallanmodal();
              this.pfuploadedPayRollId = payrollId.id;
              this.getPayrollallData();
            }
          }
        }
      });
    });
  }

  openModelESICChallan(payrollId: any) {
    this.payrollId = payrollId;
    this.esicchallanmodal?.show();
    this.getAllESICChallan(payrollId);
  }

  ESICChallan(payrollId: any) {
    this.esicuploadedPayRollId = 0;
    if (!this.selectedFile) {
      this.toaster.warningToaster('Please Select file');
      return;
    }
    this.selectedFile.forEach((file, index) => {
      let formData = new FormData();

      if (this.selectedFile) {
        formData.append('File', file);
      }
      formData.append('PayrollId', payrollId.id.toString());
      this.projectService.postPFChallan(formData, AppConstant.PAYROLL_ESIC_ATTACHMENT).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            if (index === this.selectedFile.length - 1) {
              this.pfchallan = response?.data;
              this.toaster.successToaster(response.message);
              this.closeesicchallanmodal();
              this.esicuploadedPayRollId = payrollId.id;
              this.getPayrollallData();
            }
          }
        }
      });
    });
  }

  closeutrmodal() {
    this.utrformDirective.resetForm();
    this.utrForm.reset();
    this.selectedFile = [];
    this.utrmodal?.hide();
  }

  downloadFileUTR(bankSheetId: any) {
    this.bankSheetId = bankSheetId;
    this.utrmodal?.show();
  }

  onUTRDocumentFileSelected(event: Event, bankSheetId: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!bankSheetId || bankSheetId === 0) {
      this.toaster.warningToaster('Invalid Bank Sheet ID');
      return;
    }
    if (file) {
      if (file.size > AppConstant.FILE5MB) {
        this.toaster.warningToaster(`File "${file.name}" exceeds the size limit of 5MB.`, 'warning');
        input.value = '';
        return;
      }
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
      if (!allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
        this.toaster.warningToaster('Allowed file types: JPG, JPEG, PNG, PDF, DOC, DOCX.', 'warning');
        input.value = '';
        return;
      }
      this.selectedFile.push(file);
      this.UTR(bankSheetId, input); // Call UTR function to upload file
    }
  }

  UTR(bankSheetId: any, input: HTMLInputElement) {
    if (!this.selectedFile) {
      this.toaster.warningToaster('Please select a file');
      return;
    }
    let formData = new FormData();
    formData.append('File', this.selectedFile[0]);
    formData.append('BankSheetId', bankSheetId.bankSheetId.toString());

    this.projectService.postPFChallan(formData, AppConstant.PAYROLL_BANK_SHEET).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
          this.selectedFile = [];
          input.value = '';
          this.closebanksheetmodal();
          this.getPayrollallData();
        } else {
          this.toaster.errorToaster('File upload failed. Please try again.');
        }
      },
      error: () => {
        this.toaster.errorToaster('Error uploading file. Please check your network and try again.');
      }
    });
  }

  onDocumentFileSelectedUTR(event: Event) {
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
        this.toaster.warningToaster("We allow only JPG, JPEG, PNG, PDF, DOC, and DOCX files!", 'warning');
        return;
      }
      this.selectedFile.push(file);
      this.files = [];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      const name = file.name;
      this.files.push({ file, url, name });
      this.utrForm.patchValue({
        file: this.selectedFile,
      });
    }
  }

  removeFileUTR() {
    this.UploadFlag = 2;
    this.selectedFile = [];
    this.files = [];
    this.utrForm.patchValue({ file: null });
  }
  viewDetails(item: any): void {
    let params = new HttpParams()
      .set('isSkipPaging', 'false')
      .set('AttachmentId', item.id)
    this.accountreportService.getAccountreport(AppConstant.Get_Invoice_Files, params)
      .subscribe({
        next: (response) => {

          this.InvoicefilerowData = response.data || [];

          if (this.InvoicefilerowData.length > 0) {
            this.totalCount = this.rowData1[0].TotalRecord || this.rowData.length;
          } else {
            this.totalCount = 0;
          }

        },
        error: (error) => {
          this.toaster.errorToaster('Failed to load data');
          console.error('Error fetching data:', error);
          this.rowData = [];
          this.totalCount = 0;
        }
      });

    this.tallyPartialmodal?.show();

  }

    DownloadAttachmentfile(item: any) {
    const filePath: string = item.FilePath;
    if (filePath) {
      item.downloadUrl = filePath;
      this.lastDownloadedPath = filePath;

      if (this.useProxyDownload) {
        AppConstant.getDownloadFile(filePath);
      } else {
        this.downloadPdfFile(filePath);
      }
    } else {
      this.toaster.warningToaster('No file available for download.');
    }
  }

   


}
