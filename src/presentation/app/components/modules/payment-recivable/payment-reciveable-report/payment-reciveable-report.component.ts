import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToasterService } from '../../../../../../common/toaster-service';
import { HttpParams } from '@angular/common/http';
import { AppConstant } from '../../../../../../common/app-constant';
import { PaymentReciveableReportService } from '../../../../../../domain/services/payment-reciveable-report.service';
import { clientListModel, PaymentReceviableReportListModel, ProjectListModel } from '../../../../../../domain/models/paymentreciveablereport.model';

@Component({
  selector: 'app-payment-reciveable-report',
  templateUrl: './payment-reciveable-report.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './payment-reciveable-report.component.scss'
})

export class PaymentReciveableReportComponent implements OnInit {
  clientList: clientListModel[] = [];
  projectList: ProjectListModel[] = [];
  searchText: string = '';
  selectedClientId: number | null = null;
  selectedProjectId: string | null = null;
  totalCount: number = 0;
  pageNumber: number = 1;
  recode: number = 10;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  paymentReceviableReportList: any[] = [];
  paymentDate: Date | null = null;
  invoiceNumber: number | null = null;
  chequeNumber: string = '';
  totalTaxInvoiceAmount = 0;
  totalGrossAmount = 0;
  totalCgstAmount = 0;
  totalTax = 0;
  expandedItems: { [key: number]: boolean } = {};
  showFilter: boolean = true;
  expandedClients: { [clientName: string]: boolean } = {};
  expandedProjects: { [key: string]: boolean } = {};
  isSubmitted: boolean = false;
  constructor(
    private paymentReciveableReportService: PaymentReciveableReportService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit(): void {
    this.getClientList();
  }

  onClientChange(): void {
    if (this.selectedClientId != null) {
      this.getProjectClientList(this.selectedClientId);
    } else {
      this.projectList = [];
    }
  }

  getClientList(): void {
    const params = new HttpParams()
      .set('isSkipPaging', true)
      .set('searchTerm', this.searchText || '');

    this.paymentReciveableReportService.getPaymentReciveableReport<clientListModel[]>(AppConstant.GET_CLIENT_SEARCH, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.clientList = response.data;
          this.selectedClientId = this.clientList.length === 1 ? this.clientList[0].value : null;
        } else {
          this.clientList = [];
        }
      }
    });
  }

  getProjectClientList(clientId: number): void {
    const params = new HttpParams()
      .set('searchText', this.searchText || '')
      .set('clientId', clientId)
      .set('isSkipPaging', true)

    this.paymentReciveableReportService.getPaymentReciveableReport<ProjectListModel[]>(AppConstant.GET_PROJECT + '/Search', params).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectList = response.data;
        } else {
          this.projectList = [];
        }
      }
    });
  }

  paymentReceviableReport(): void {
    if (!this.showFilter && !this.selectedClientId) {
      this.showFilter = true;
    }
    this.isSubmitted = true;

    if (!this.selectedClientId) {
      return;
    }
    const formattedDate = this.paymentDate ? new Date(this.paymentDate).toISOString() : '';
    const params = new HttpParams()
      .set('ClientIds', this.selectedClientId ? this.selectedClientId.toString() : '')
      // .set('ClientIds', this.selectedClientId.toString())
      .set('ProjectIds', this.selectedProjectId ? this.selectedProjectId.toString() : '')
      .set('IsPagingSkip', true)
      .set('InvoiceNumber', this.invoiceNumber ? this.invoiceNumber : '')
      .set('PaymentDate', formattedDate)
      .set('ChequeNumber', this.chequeNumber)
      .set('Type', 2)
      .set('RecordCount', this.recode.toString())
      .set('PageNumber', this.pageNumber.toString())
      .set('FilterBy', this.searchTerm)
      .set('OrderBy', this.orderby);

    this.paymentReciveableReportService.getPaginationData<PaymentReceviableReportListModel[]>(AppConstant.GET_PAYMENT_RECEVIABLE_REPORT, params)
      .subscribe({
        next: (response: any) => {
          debugger
          if (response.success && response.data) {
            this.paymentReceviableReportList = this.groupByClientProject(response.data.list);
            console.log(this.paymentReceviableReportList);
            this.calculateTotalTaxAmounts(response.data.list);
            this.totalCount = response.data.totalCount;
            this.toasterService.successToaster(response.message);

            this.expandedClients = {};
            this.expandedProjects = {};
            for (const group of this.paymentReceviableReportList) {
              this.expandedClients[group.clientName] = true;
              for (const project of group.projects) {
                const key = `${group.clientName}|${project.projectName}`;
                this.expandedProjects[key] = true;
              }
            }

          } else {
            this.paymentReceviableReportList = [];
            this.totalCount = 0;
            this.toasterService.warningToaster(response.message);
          }
        }
      });
  }

  groupByClientProject(data: PaymentReceviableReportListModel[]): any[] {
    const clientMap = new Map<string, any>();

    data.forEach(item => {
      if (!clientMap.has(item.clientName)) {
        clientMap.set(item.clientName, new Map<string, any[]>());
      }
      const projectMap = clientMap.get(item.clientName);
      if (!projectMap.has(item.projectName)) {
        projectMap.set(item.projectName, []);
      }
      projectMap.get(item.projectName).push(item);
    });

    // Convert to array structure for template
    return Array.from(clientMap.entries()).map(([clientName, projectMap]) => ({
      clientName,
      projects: Array.from(projectMap.entries() as Iterable<[string, any[]]>).map(([projectName, items]) => ({
        projectName,
        items
      }))
    }));
  }

  calculateTotalTaxAmounts(data: PaymentReceviableReportListModel[]) {
    const allItems = data;

    // Use reduce to sum up each property
    this.totalTaxInvoiceAmount = allItems.reduce((sum, item) => sum + (item.taxInvoiceAmount || 0), 0);
    this.totalGrossAmount = allItems.reduce((sum, item) => sum + (item.grossAmount || 0), 0);
    this.totalCgstAmount = allItems.reduce((sum, item) => sum + (item.cgstAmount || 0), 0);
    this.totalTax = allItems.reduce((sum, item) => sum + (item.totalTax || 0), 0);
  }

  downloadPaymentReceviableReport() {
    if (!this.showFilter && !this.selectedClientId) {
      this.showFilter = true;
    }
    this.isSubmitted = true;
    if (!this.selectedClientId) {
      this.toasterService.warningToaster('Please select a client.');
      return;
    }

    const params = new HttpParams()
      .set('ClientIds', this.selectedClientId.toString())
      .set('ClientIds', this.selectedClientId ? this.selectedClientId.toString() : '')
      // .set('ClientIds', this.selectedClientId.toString())
      .set('ProjectIds', this.selectedProjectId ? this.selectedProjectId.toString() : '')
      .set('IsPagingSkip', true)
      .set('InvoiceNumber', this.invoiceNumber ? this.invoiceNumber : '')
      .set('ChequeNumber', this.chequeNumber)
      .set('Type', 1)

    this.paymentReciveableReportService.downloadPaymentReceviableReport(AppConstant.GET_PAYMENT_RECEVIABLE_REPORT, params)
      .subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `PaymentReceivableReport_${new Date().toISOString().slice(0, 10)}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.toasterService.errorToaster('Failed to download report.');
        }
      });
  }

  toggleItems(payrollId: number): void {
    this.expandedItems[payrollId] = !this.expandedItems[payrollId];
  }

  toggleClient(clientName: string): void {
    this.expandedClients[clientName] = !this.expandedClients[clientName];
  }

  toggleProject(clientName: string, projectName: string): void {
    const key = clientName + '|' + projectName;
    this.expandedProjects[key] = !this.expandedProjects[key];
  }

}
