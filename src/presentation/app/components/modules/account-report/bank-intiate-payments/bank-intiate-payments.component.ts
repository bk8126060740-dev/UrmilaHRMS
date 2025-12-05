import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Data, ToasterService } from '@teamopine/to-ng-grid';
import { PayrollService } from '../../../../../../domain/services/payroll.service';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { ProjectService } from '../../../../../../domain/services/project.service';
import { ProjectPayrollAttributeService } from '../../../../../../domain/services/projectPayrollAttribute.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { BankModel } from '../../../../../../domain/models/bank.model';
import { BankintiateService } from '../../../../../../domain/services/bankintiate.service';
import { SignalRService } from '../../../../../../common/signal-R.service';
import { JwtService } from '../../../../../../common/jwtService.service';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { PayrollModel, StatusWithCountModel } from '../../../../../../domain/models/payroll.model';
import { ProjectDaum } from '../../../../../../domain/models/project.model';
import { BankIniateModel } from '../../../../../../domain/models/bankiniate.model';
import { ExportService } from '../../../../../../domain/services/export.service';
import { GrantPermissionService } from '../../../../../../domain/services/permission/is-granted.service';
import { BasicLayoutComponent } from '../../../core/basic-layout/basic-layout.component';

@Component({
  selector: 'app-bank-intiate-payments',
  templateUrl: './bank-intiate-payments.component.html',
  styleUrl: './bank-intiate-payments.component.scss'
})
export class BankIntiatePaymentsComponent implements OnInit {

  PayrollData: PayrollModel[] = [];
  statusWithCounts: StatusWithCountModel[] = [];
  selectedStatus: StatusWithCountModel = new StatusWithCountModel();
  defualtSelectedStatus: StatusWithCountModel = new StatusWithCountModel();
  payrollModel: PayrollModel = new PayrollModel();
  projectDataModel: ProjectDaum = new ProjectDaum();
  totalCount: number = 0;
  yearsList: { label: string, value: number }[] = [];
  selectedYear: number = new Date().getFullYear();
  recodeCount: number = 10;
  startItem: number = 1;
  endItem: number = this.recodeCount;
  //pageNumber: number=1;
  RowpageNumber: string = "1";
  recode: number = 12;
  searchTerm: string = '';
  filterTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  orderby: string = '';
  currentYear = new Date().getFullYear();
  monthsList: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedMonth: number = new Date().getMonth();
  selectedDate: Date = new Date();
  filteredRowData: any[] = [];
  rowData: any[] = [];


  dropdownSubscription: any;

  bankinfoForm: any;
  store: Store;
  projectId: number = 0;
  bankList: BankModel[] = [];
  attributeArray: any[] = [];
  payrollList: any[] = [];
  projectName: string = '';
  BankpaymentList: any = [];

  constructor(
    private toaster: ToasterService,
    private formBuilder: FormBuilder,
    private payrollService: PayrollService,
    private headerDropdownService: HeaderDropdownService,
    private exportService: ExportService,
    private basicLayoutComponent: BasicLayoutComponent,

    private localStorageService: LocalStorageService,
    private projectService: ProjectService,
    private projectPayrollAttributeService: ProjectPayrollAttributeService,
    private bankintiateService: BankintiateService,
    store: Store,
    private signalRService: SignalRService,
    private jwtService: JwtService,

  ) {
    this.store = store;
    this.bankinfoForm = this.formBuilder.group({
      payrollId: ['', Validators.required],
      attrubuteId: ['', Validators.required],
      bankId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.projectName = this.localStorageService.getItem(AppConstant.PROJECTNAME) ?? '';

    this.projectId = this.jwtService.getProjectId() ?? 0;

    // Initialize selectedDate with current month
    this.selectedDate = new Date(this.currentYear, this.selectedMonth, 1);

    this.signalRService.on('PayrollProcessed', (message: string) => {
      this.getPayrollAllData();

    });

    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);
      if (value != project) {
        this.getPayrollAllData();
      }
    });
    this.getClients({});
    this.store.select((state: any) => state.editForm).subscribe((data) => { });
  }
  async getPayrollAllData() {
    let bankParam = new HttpParams()
      .set('IsSkipPaging', true);
    await this.payrollService.getPayrollAllData<BankModel[]>(AppConstant.GET_BANK_SEARCH, bankParam).subscribe({
      next: (response) => {
        if (response) {
          this.bankList = response.data;
        }
      }
    });
  }

 

  async getClients(event: any) {
    await this.projectService.getProject(this.projectId).subscribe({
      next: (response) => {
        if (response && response.data && response.data.length > 0) {
          this.projectName = response.data[0].name;
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

    await this.getPayrollAllData();

    if (this.payrollList.length > 0) {
      this.bankinfoForm.patchValue({
        payrollId: this.payrollList[0].id,
      });
    }

  }

  onMonthChange() {
    this.selectedDate = new Date(this.currentYear, this.selectedMonth, 1);
    this.filterDataByDate();
    this.getPayrollalllist();
  }
  showpayrollList: any[] = [];
  async getPayrollalllist(YearObj: any | null = null) {
    let params = new HttpParams()
      .set("Year", this.selectedYear)
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.RowpageNumber)
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby)
      .set("IsPagingSkip", true);

    await this.payrollService.getPayrollAllData<BankIniateModel[]>(AppConstant.PAYROLL, params).subscribe({
      next: (responce: any) => {
        this.statusWithCounts = [];
        if (responce && responce.success) {
          this.payrollList = responce.data.payrolls.filter(
            (payroll: any) => payroll.year === this.selectedYear
          ).map((payroll: any) => ({
            id: payroll.id,
            name: payroll.name
          }));
        } else {
          this.rowData = [];
          this.statusWithCounts = [];
          this.totalCount = 0;
        }
      }
    });
  }


  filterDataByDate() {
    if (this.selectedDate) {
      this.filteredRowData = this.rowData.filter(item => {
        const itemDate = new Date(item.year, item.month - 1, 1);
        return (
          itemDate.getFullYear() === this.currentYear &&
          itemDate.getMonth() === this.selectedDate.getMonth()

        );
      });
    } else {
      this.filteredRowData = [...this.rowData];
    }
  }
  PayrollId: number = 0;
  // async GetBankTransferSheet(payrollId: number) {

  //   const monthName = this.monthsList[this.selectedMonth] || '';

  //   if (this.bankinfoForm.valid) {
  //     const params = new HttpParams()
  //       .set('projectId', this.projectId)
  //       .set('PayrollAttributeId', this.bankinfoForm.value.attrubuteId)
  //       .set('bankId', this.bankinfoForm.value.bankId)
  //       .set('PayrollId', payrollId)
  //       .set('Month', monthName)
  //       .set('PageNumber', this.RowpageNumber)
  //       .set('RecordCount', this.recode.toString());

  //     this.bankintiateService
  //       .getBankTransferList(AppConstant.Bank_Transfer_List + '/GetBankTransferList', params)
  //       .subscribe({
  //         next: (response) => {
  //           if (response) {
  //             this.rowData = response.data as any[];
  //             this.totalCount = response.totalCount;
  //             this.filterDataByDate();
  //             this.payrollList = [];
  //           this.PayrollId = this.rowData[0].payrollId;
  //           this.localStorageService.setItem('payrollId', this.PayrollId.toString());
  //           }
  //         },
  //       });
  //   } else {
  //     this.toaster.errorToaster('Please fill all required fields');
  //   }
  // }
  async GetBankTransferSheet(payrollId: number) {
    const monthName = this.monthsList[this.selectedMonth] || '';

    if (this.bankinfoForm.valid) {
      const params = new HttpParams()
        .set('projectId', this.projectId)
        .set('PayrollAttributeId', this.bankinfoForm.value.attrubuteId)
        .set('bankId', this.bankinfoForm.value.bankId)
        .set('PayrollId', payrollId)
        .set('Month', monthName)
        .set('PageNumber', this.RowpageNumber)
        .set('RecordCount', this.recode.toString());

      this.bankintiateService
        .getBankTransferList(AppConstant.Bank_Transfer_List + '/GetBankTransferList', params)
        .subscribe({
          next: (response) => {
            if (response && response.data) {
              this.allRowData = response.data as any[];

              this.totalRecords = response.totalCount || this.allRowData.length;

              this.currentPage = 1;
              this.updatePagedData();

              this.filterDataByDate();

              if (this.rowData.length > 0) {
                this.PayrollId = this.rowData[0].payrollId;
                this.localStorageService.setItem('payrollId', this.PayrollId.toString());
              }
            } else {
              this.rowData = [];
              this.allRowData = [];
              this.totalRecords = 0;
            }
          },
          error: () => {
            this.toaster.errorToaster('Failed to load bank transfer list');
          },
        });
    } else {
      this.toaster.errorToaster('Please fill all required fields');
    }
  }



  async sendBankTransferSheet(item: any) {

    const monthName = this.monthsList[this.selectedMonth] || '';

    if (this.bankinfoForm.valid) {
      const params = new HttpParams()
        .set('projectId', this.projectId)
        .set('PayrollAttributeId', this.bankinfoForm.value.attrubuteId)
        .set('bankId', this.bankinfoForm.value.bankId)
        .set('Month', monthName);

      this.bankintiateService
        .sendBankTransferSheet(AppConstant.Bank_Transfer_List + '/SendBankTransferList', item)
        .subscribe({
          next: (response) => {
            if (response) {
              this.rowData = response.data as any[];
              this.filterDataByDate();
              this.payrollList = [];
              this.PayrollId = this.rowData[0].payrollId;
              this.localStorageService.setItem('payrollId', this.PayrollId.toString());
            }
          },
        });
    } else {
      this.toaster.errorToaster('Please fill all required fields');
    }
  }




  async deleteProject(row: any) {
    await this.projectService.deleteProject(`${AppConstant.DELETE_PROJECT}` + "/" + row.id).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.rowData = this.rowData.filter((r) => r !== row);
          this.toaster.successToaster(response.message);
          this.totalCount = this.totalCount - 1;
          this.basicLayoutComponent.callHeaderMethodFromProject();
          this.GetBankTransferSheet(this.PayrollId);
        }
      }

    });
  }

  allRowData: any[] = [];
  goToPage(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    if (page === this.currentPage) return;
    this.currentPage = page;
    this.updatePagedData();
  }
  updatePagedData(): void {
    const ps = Number(this.pageSize) || 10;
    const cp = Number(this.currentPage) || 1;

    const startIndex = (cp - 1) * ps;
    const endIndex = Math.min(startIndex + ps, this.totalRecords);

    this.rowData = this.allRowData.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalRecords / this.pageSize) : 0;
  }
  onPageSizeChange(event?: Event | number): void {
    if (typeof event === 'number') {
      this.pageSize = event;
    } else if (event instanceof Event) {
      const value = (event.target as HTMLSelectElement).value;
      this.pageSize = Number(value) || 10;
    } else {
      this.pageSize = Number(this.pageSize) || 10;
    }

    this.currentPage = 1;
    this.updatePagedData();
  }
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
  getStartRecord(): number {
    if (this.totalRecords === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndRecord(): number {
    const end = this.currentPage * this.pageSize;
    return Math.min(end, this.totalRecords);
  }

  onPageChange(value: number) {
    this.currentPage = value;
    this.RowpageNumber = value.toString();
    this.updatePagedData();
  }

  onSearch(search: string) {
    this.searchTerm = search;
    this.filterAndPageData();
  }

  export() {
    this.exportService.get(AppConstant.GET_EXPORT_PROJECT).subscribe({
      next: (response: Blob) => {
        this.downloadFile(response);
      },
      error: (error) => { },
    });
  }

  downloadFile(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ProjectDetails_Export.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  onTotalPerPageValueChange(totalProjectCount: number) {
    this.recode = totalProjectCount;
    this.pageSize = totalProjectCount;
    this.currentPage = 1;
    this.RowpageNumber = "1";
    this.updatePagedData();
  }

  orderBy(event: any) {
    event = event.replace(/formattedStartDate/g, 'startDate ');
    event = event.replace(/formattedEndDate/g, 'endDate ');
    event = event.replace(/projectStatusValue /g, 'projectStatus ');
    this.orderby = event;
    this.sortAndPageData();
  }

  filterAndPageData() {
    // Implement search filtering on allRowData
    if (this.searchTerm) {
      this.filteredRowData = this.allRowData.filter(item =>
        Object.values(item).some(val =>
          val && val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    } else {
      this.filteredRowData = [...this.allRowData];
    }
    this.totalRecords = this.filteredRowData.length;
    this.updatePagedData();
  }

  sortAndPageData() {
    if (this.orderby) {
      this.filteredRowData.sort((a, b) => {
        const [field, direction] = this.orderby.trim().split(' ');
        const aVal = a[field];
        const bVal = b[field];
        if (direction === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        } else {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
      });
    }
    this.totalRecords = this.filteredRowData.length;
    this.updatePagedData();
  }

  submitBankTransferSheet() {
    if (this.allRowData.length === 0) {
      this.toaster.errorToaster('No data to submit');
      return;
    }

    var paymentsobj = {
  CorporateId: this.bankinfoForm.value.attrubuteId?.toString(),
  Payments: Array.isArray(this.allRowData) ? this.allRowData.map(item => ({
    Beneficiaryname: item?.benificiaryName ?? '',
    Beneficiaryaccount: item?.benificiaryAccountNumber ?? '',
    Paymentmode: item?.type ?? '',
    Paymentmonth: item?.month ?? '',
    Amount: Number(item?.amount) || 0,
    IFSC: item?.ifscCode ?? '', 
    Remarks: item?.customerReference ?? '',
    Debitaccountnumber: item?.applicantAccountNumber ?? '',
    Corporatename: item?.applicantName ?? '',
    Transactionrefno: item?.customerReference ?? '',
    Valuedate: item.validate,
    Beneficiaryifsc: item?.ifscCode ?? '',
    Beneficiaryaccountnumber: item?.benificiaryAccountNumber ?? '',
    Internalcode: item?.employeeId?.toString() ?? '',
    Payeename: item?.empBankName ?? ''
  })) : []
};




    this.bankintiateService
      .sendBankTransferSheet(AppConstant.Bank_Transfer_List + '/SavebulkPayment', paymentsobj)
      .subscribe({
        next: (response) => {
          if (response && response.success) {
            this.toaster.successToaster('Bank transfer sheet submitted successfully');
            this.GetBankTransferSheet(this.PayrollId);
          } else {
            this.toaster.errorToaster(response.message || 'Failed to submit bank transfer sheet');
          }
        },
        error: (error) => {
          this.toaster.errorToaster('An error occurred while submitting the bank transfer sheet');
        }
      });

  }

}
