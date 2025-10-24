import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BankSheetService } from '../../../../../../domain/services/banksheet.service';
import { Router } from '@angular/router';
import { AppConstant } from '../../../../../../common/app-constant';
import { BankSheetReport, BankSheetReportAttachment, FileList } from '../../../../../../domain/models/payroll.model';
import { HttpParams } from '@angular/common/http';
import { ClientList, ProjectClientListModel } from '../../../../../../domain/models/paymentreciveable.model';
import { Report } from '../../../../../../domain/models/pf-challan.model';
import { ToasterService } from '../../../../../../common/toaster-service';

@Component({
  selector: 'app-bank-sheet-report',
  templateUrl: './bank-sheet-report.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './bank-sheet-report.component.scss'
})
export class BankSheetReportComponent implements OnInit {
  monthList: { id: number, monthName: string, shortName: string }[] = [];
  yearList: number[] = [];
  typeList: { id: number, text: string }[] = [];
  exportTypeList: { id: number, text: string }[] = [];
  UTRReportForm!: FormGroup;
  UTRData: FileList = new FileList();
  isHistoryData: boolean = false;
  clientList: ClientList[] = [];
  projectList: ProjectClientListModel[] = [];
  isViewMode: boolean = false;
  rowData: BankSheetReport[] = [];
  attachments: any[] = [];
  Math = Math;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  totalCount: number = 0;
  pageNumber: number = 1;
  recordCount: number = 100;
  dropdownOpen = false;
  @ViewChild('dropdownPanel') dropdownPanel!: ElementRef;
  exportedFiles: Report[] = [];
  nextDisabled: boolean = false;

  constructor(private fb: FormBuilder,
    private bankSheetService: BankSheetService,
    private toasterService: ToasterService,
    private router: Router) {
    this.monthList = AppConstant.MONTH_DATA;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // getMonth() returns 0-11, so add 1


    for (let i = 2024; i <= currentYear; i++) {
      this.yearList.push(i);
    }
    this.typeList = [
      { id: 0, text: 'All' },
      { id: 1, text: 'NetMatch' },
      { id: 2, text: 'ExtraPay' },
      { id: 3, text: 'ShortPay' }
    ];

    this.exportTypeList = [
      { id: 2, text: 'View' },
      { id: 1, text: 'Excel' }
    ];

    this.UTRReportForm = this.fb.group({
      selectedClientId: [null, Validators.required],
      selectedProjectId: [null, Validators.required],
      selectedMonth: [currentMonth === 0 ? 12 : currentMonth, Validators.required],
      selectedYear: [currentYear, Validators.required],
      selectedNegative: [1],
      selectedType: [2]
    });
  }

  ngOnInit(): void {
    const navigationState = history.state;
    if (navigationState) {
      this.UTRData = navigationState.UTRData;
      if (this.UTRData) {
        this.isHistoryData = true;
        this.getUTRHistoryById(this.UTRData.bankSheetId);
      }
    } else {
      this.isHistoryData = false;
    }

    this.getReportData();
    this.getClientList();
  }

  getReportData() {
    const params = new HttpParams()
      .set('FilterBy', 'name.contains("UTR Report")')
    this.bankSheetService.getPaginationData<Report>(AppConstant.GET_REPORT, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.exportedFiles = response.data.list;
        }
      }
    });
  }

  getUTRHistoryById(bankSheetId: any) {
    const params = new HttpParams()
      .set('PageNumber', this.pageNumber)
      .set('RecordCount', this.recordCount)
      .set('BankSheetId', bankSheetId)
    this.bankSheetService.getPaginationDataNew<BankSheetReport, BankSheetReportAttachment>(AppConstant.GET_BANK_SHEET_REPORT_BY_ID, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.rowData = response.data.list;
          this.totalCount = response.data.totalCount;
          if (this.totalCount < this.recordCount) {
            this.nextDisabled = true;
          } else {
            this.nextDisabled = false;
          }
          this.attachments = response.data.attachments;
        }
      }
    });
  }

  getClientList(): void {
    this.projectList = [];
    this.UTRReportForm.patchValue({
      selectedClientId: null,
      selectedProjectId: null,
    });
    const params = new HttpParams()
      .set('isSkipPaging', true)
      .set('searchTerm', this.UTRReportForm.value.name || '');

    this.bankSheetService.getBankSheet<ClientList[]>(AppConstant.GET_CLIENT_SEARCH, params).subscribe({
      next: (response) => {
        if (response.success) {
          let obj = {
            value: 0,
            text: 'All'
          }
          this.clientList = [obj, ...response.data];
        } else {
          this.clientList = [];
        }
      }
    });
  }



  onClientChange(): void {
    this.UTRReportForm.patchValue({
      selectedProjectId: null,
    });
    this.projectList = [];
    if (this.UTRReportForm.value.selectedClientId != null) {
      this.getProjectClientList(this.UTRReportForm.value.selectedClientId);
    }
  }

  getProjectClientList(clientId: number): void {
    const params = new HttpParams()
      .set('searchText', '')
      .set('clientId', clientId)
      .set('isSkipPaging', true)

    this.bankSheetService.getBankSheet<ProjectClientListModel[]>(AppConstant.GET_PROJECT + '/Search', params).subscribe({
      next: (response) => {
        if (response.success) {
          let obj = {
            id: 0,
            name: 'All'
          }
          this.projectList = [obj, ...response.data];
        } else {
          this.projectList = [];
        }
      }
    });
  }

  onProjectChange(): void {

  }

  onCancel(): void {
    this.router.navigate(['/payroll/bank-sheet-list']);
  }

  onGenerate() {
    this.isViewMode = true;
    if (this.UTRReportForm.valid) {
      this.UTRReportForm.markAllAsTouched();
      if (this.UTRReportForm.value.selectedType === 2) {

        const params = new HttpParams()
          .set('clientId', this.UTRReportForm.value.selectedClientId)
          .set('projectId', this.UTRReportForm.value.selectedProjectId)
          .set('month', this.UTRReportForm.value.selectedMonth)
          .set('year', this.UTRReportForm.value.selectedYear)
          .set('DifferenceCategory', this.UTRReportForm.value.selectedNegative === 0 ? 'All' : this.UTRReportForm.value.selectedNegative)
          .set('type', this.UTRReportForm.value.selectedType)
          .set('PageNumber', this.pageNumber)
          .set('IsPagingSkip', 'true')
          .set('RecordCount', this.recordCount);

        this.bankSheetService.getPaginationDataNew<BankSheetReport[], BankSheetReportAttachment>(AppConstant.GET_BANK_SHEET_REPORT, params).subscribe({
          next: (response) => {
            if (response.success) {
              this.rowData = response.data.list as any[];
              this.totalCount = response.data.totalCount;
              if (this.totalCount < this.recordCount) {
                this.nextDisabled = true;
              } else {
                this.nextDisabled = false;
              }
              this.attachments = response.data.attachments;

            } else {
              this.rowData = [];
              this.totalCount = 0;
            }
          }
        });
      } else {


        let obj = {
          name: "UTR Report",
          payload: {
            Year: this.UTRReportForm.value.selectedYear,
            Month: this.UTRReportForm.value.selectedMonth,
            ClientId: this.UTRReportForm.value.selectedClientId,
            ProjectId: this.UTRReportForm.value.selectedProjectId,
            DifferenceCategory: this.UTRReportForm.value.selectedNegative === 0 ? 'All' : this.UTRReportForm.value.selectedNegative
          }
        }
        this.bankSheetService.postBankSheet(AppConstant.GET_REPORT, obj).subscribe({
          next: (response) => {
            this.toasterService.successToaster(response.message);
          }
        });
      }
    }
  }

  downloadFile(row: any, type: string): void {

    let url = '';
    if (type === 'PDF') {
      const attachment = this.attachments.find(a => a.bankSheetId === row.bankSheetId)?.attachments;
      attachment?.forEach((element: any) => {
        if (element.fileType === 587) {
          url = element.filePath;
        }
      });
      window.open(url, '_blank');
    } else if (type === 'TEXT') {
      const attachment = this.attachments.find(a => a.bankSheetId === row.bankSheetId)?.attachments;
      attachment?.forEach((element: any) => {
        if (element.fileType === 588) {
          url = element.filePath;
        }
      });
      window.open(url, '_blank');
    }
  }

  onExport(): void {

  }
  orderBy(event: any): void {

  }

  onTotalRecoredChange(event: any): void {

    this.recordCount = event;
    this.pageNumber = 1;
    if (!this.isHistoryData) {
      this.onGenerate();
    } else {
      this.getUTRHistoryById(this.UTRData.bankSheetId);
    }
  }

  onSearch(event: any): void {

  }

  onPageChange(event: any): void {

    this.pageNumber = event;
    if (!this.isHistoryData) {
      this.onGenerate();
    } else {
      this.getUTRHistoryById(this.UTRData.bankSheetId);
    }
  }
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.pageNumber;
    const pages: number[] = [];

    // Show at most 5 page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // Adjust start page if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalCount / this.recordCount);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.dropdownOpen && this.dropdownPanel && !this.dropdownPanel.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

}
