import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { PaymentReciveableService } from '../../../../../../domain/services/payment-Reciveable.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import { ClientList, ProjectClientListModel } from '../../../../../../domain/models/paymentreciveable.model';
import { PaymentReceviableReportListModel } from '../../../../../../domain/models/paymentreciveablereport.model';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import swal from "sweetalert";
@Component({
  selector: 'app-payment-reciveable-dashboard',
  templateUrl: './payment-reciveable-dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './payment-reciveable-dashboard.component.scss',
  providers: [DatePipe]

})
export class PaymentReciveableDashboardComponent implements OnInit {

  recode: number = 10;
  searchTerm: string = "";
  totalCount: number = 0;
  statusCount: number = 0;
  orderby: string = "";
  clientList: ClientList[] = [];
  projectList: ProjectClientListModel[] = [];
  searchText: string = '';
  selectedClientId: number | null = null;
  selectedProjectId: number[] = [];
  pageNumber: number = 1;
  recordCount: number = 10;
  isSubmitted: boolean = false;

  constructor(
    private paymentReciveableService: PaymentReciveableService,
    private toasterService: ToasterService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getClientList();
  }

  rowData: any[] = [];

  columns = [
    {
      field: "performaInvoice",
      displayName: "Invoice Number",
      sortable: false,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "paymentDate",
      displayName: "Payment Date",
      sortable: false,
      filterable: true,
      visible: true,
      fixVisible: true,
      isDate: true
    },
    {
      field: "grossAmount",
      displayName: "Gross Amount",
      sortable: false,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCurrency: true
    },
    {
      field: "invoiceValue",
      displayName: "Invoice Value",
      sortable: false,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCurrency: true
    },

    {
      field: "holdAmount",
      displayName: "Hold Amount",
      sortable: false,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCurrency: true
    },
    {
      field: "creditNoteDeductionAmount",
      displayName: "Credit Note",
      sortable: false,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCurrency: true
    },
    {
      field: "gstAndTDSAmount",
      displayName: "GST Deduction",
      sortable: false,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCurrency: true
    },
    {
      field: "itAndTDSAmount",
      displayName: "TDS Deduction",
      sortable: false,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCurrency: true
    },
    {
      field: "creditedAmount",
      displayName: "Received Amount",
      sortable: false,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCurrency: true
    },
    {
      field: "remainingBalanceAmount",
      displayName: "Balance Amount",
      sortable: false,
      filterable: true,
      visible: true,
      fixVisible: true,
      isCurrency: true
    },
    {
      field: "",
      displayName: "Download File",
      reportButton: true,
      sortable: false,
      filterable: false,
      visible: true,
      fixVisible: true,
      isCenter: true,
    }
  ];

  onEdit() {

  }

  onDelete(event: any) {

    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let params = new HttpParams()
          .set('Id', event.id);
        this.paymentReciveableService.deletePaymentReciveable(AppConstant.DELETE_PAYMENT_RECEIVABLE, params).subscribe({
          next: (response) => {
            this.toasterService.successToaster(response.message || 'Record deleted successfully');
            this.viewPaymentReceivableReport();
          }
        });
      } else {
        swal("Cancelled", "Your record is safe :)", "error");
      }
    });
  }

  onInsert() {
    this.router.navigate(['/paymentin/received']);
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

    this.paymentReciveableService.getPaymentReciveable<ClientList[]>(AppConstant.GET_CLIENT_SEARCH, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.clientList = response.data;
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

    this.paymentReciveableService.getPaymentReciveable<ProjectClientListModel[]>(AppConstant.GET_PROJECT + '/Search', params).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectList = response.data;
        } else {
          this.projectList = [];
        }
      }
    });
  }

  viewPaymentReceivableReport(): void {
    this.isSubmitted = true;
    if (!this.selectedClientId) {
      return;
    }

    let params = new HttpParams()
      .set('Type', '2')
      .set('FilterBy', this.searchTerm)
      .set('OrderBy', this.orderby)
      .set('PageNumber', this.pageNumber.toString())
      .set('RecordCount', this.recordCount.toString())
      .set('IsPagingSkip', 'false');

    // Add ClientIds with index format
    if (this.selectedClientId) {
      params = params.append(`ClientIds[0]`, this.selectedClientId.toString());
    }

    // Add ProjectIds with index format
    this.selectedProjectId.forEach((projectId, index) => {
      params = params.append(`ProjectIds[${index}]`, projectId.toString());
    });

    this.paymentReciveableService.getPaginationData<PaymentReceviableReportListModel>(AppConstant.GET_PAYMENT_RECEVIABLE_REPORT, params)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.rowData = response.data.list || [];
            this.rowData.forEach(element => {
              element.paymentDate = this.datePipe.transform(element.paymentDate, 'dd/MM/yyyy');
            });
            this.totalCount = response.data.totalCount || 0;
          } else {
            this.rowData = [];
            this.totalCount = 0;
            this.toasterService.warningToaster(response.message || 'No data found');
          }
        },
        error: (error) => {
          this.toasterService.errorToaster('Error retrieving data');
          console.error('Error:', error);
        }
      });
  }

  fileDownload(row: any) {
    AppConstant.getDownloadFile(row.paymentAdvice);
  }

  onPageChange(page: any): void {
    this.pageNumber = page;
    this.viewPaymentReceivableReport();
  }

  onPageSizeChange(pageSize: any): void {
    this.recordCount = pageSize;
    this.pageNumber = 1;
    this.viewPaymentReceivableReport();
  }

  onSortChange(sort: any): void {
    this.orderby = sort;
    this.viewPaymentReceivableReport();
  }

  onFilterChange(filter: any): void {
    this.searchTerm = filter.value;
    this.pageNumber = 1;
    this.viewPaymentReceivableReport();
  }
  orderBy(event: any) {

    this.orderby = event;
    this.viewPaymentReceivableReport();

  }
}
