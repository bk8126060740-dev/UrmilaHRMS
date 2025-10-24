import { Component, OnInit, ViewEncapsulation, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientList, ProjectClientListModel } from '../../../../../../domain/models/paymentreciveable.model';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { PfChallanService } from '../../../../../../domain/services/pfChallan.service';
import { PayrollPfdetail, PfAttachment, PfChallanHistory, Report } from '../../../../../../domain/models/pf-challan.model';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../../../common/toaster-service';

@Component({
  selector: 'app-pfcontribution-report',
  templateUrl: './pfcontribution-report.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './pfcontribution-report.component.scss'
})


export class PFContributionReportComponent implements OnInit, OnDestroy {
  pfContributionReportForm!: FormGroup;
  typeList: { id: number, text: string }[] = [];
  exportTypeList: { id: number, text: string }[] = [];
  clientList: ClientList[] = [];
  projectList: ProjectClientListModel[] = [];
  monthList: { id: number, monthName: string, shortName: string }[] = [];
  yearList: number[] = [];
  isViewMode: boolean = false;
  rowData: any[] = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  recordCount: number = 100;
  Math = Math;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  attachments: PfAttachment[] = [];
  nextDisabled: boolean = false;
  exportedFiles: Report[] = [];
  dropdownOpen = false;
  @ViewChild('dropdownPanel') dropdownPanel!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private pfChallanService: PfChallanService,
    private router: Router,
    private toasterService: ToasterService
  ) {
    this.monthList = AppConstant.MONTH_DATA;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // getMonth() returns 0-11, so add 1

    for (let i = 2024; i <= currentYear; i++) {
      this.yearList.push(i);
    }
    this.typeList = [
      { id: 0, text: 'All' },
      { id: 1, text: 'Not Deposited' },
      { id: 2, text: 'Deposited' },
      { id: 3, text: 'ExtraPay' }
    ];

    this.exportTypeList = [
      { id: 2, text: 'View' },
      { id: 1, text: 'Excel' }
    ];
    this.pfContributionReportForm = this.fb.group({
      selectedClientId: [null, Validators.required],
      selectedProjectId: [null, Validators.required],
      selectedMonth: [currentMonth === 0 ? 12 : currentMonth, Validators.required],
      selectedYear: [currentYear, Validators.required],
      selectedNegative: [1],
      selectedType: [2]
    });
  }
  challanData = new PfChallanHistory();
  isHistoryData: boolean = false;

  ngOnInit(): void {
    const navigationState = history.state;
    if (navigationState) {
      this.challanData = navigationState.PfChallanData;
      if (this.challanData) {
        this.isHistoryData = true;
        this.getChallanHistoryById(this.challanData.id);
      }
    } else {
      this.isHistoryData = false;
    }
    this.getReportData();


    this.getClientList();
  }

  getReportData() {
    const params = new HttpParams()
      .set('FilterBy', 'name.contains("PF Report")')
    this.pfChallanService.getPaginationData<Report>(AppConstant.GET_REPORT, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.exportedFiles = response.data.list;
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/compliance/pfdashboard']);
  }

  getChallanHistoryById(challanId: any) {

    const params = new HttpParams()

      .set('PFChallanHistoryId', challanId)
      .set('PageNumber', this.pageNumber)
      .set('RecordCount', this.recordCount);
    this.pfChallanService.getPaginationDataNew<PayrollPfdetail[], PfAttachment>(AppConstant.GET_CHALLAN_HISTORY_BY_ID, params).subscribe({
      next: (response) => {
        if (response.success) {

          this.rowData = response.data.list;
          this.rowData.forEach(row => {
            row.totalCalculated = row.calcEe + row.calcEpS833 + row.calcEr;
            row.totalDepartment = row.deptEe + row.deptEpS833 + row.deptEr;
            row.difference = row.totalCalculated - row.totalDepartment;
          });

          this.totalCount = response.data.totalCount;
          this.attachments = response.data.attachments;

        } else {
          this.rowData = [];
          this.totalCount = 0;
        }
      }
    });
  }

  getClientList(): void {
    this.projectList = [];
    this.pfContributionReportForm.patchValue({
      selectedClientId: null,
      selectedProjectId: null,
    });
    const params = new HttpParams()
      .set('isSkipPaging', true)
      .set('searchTerm', this.pfContributionReportForm.value.name || '');

    this.pfChallanService.getPfChallan<ClientList[]>(AppConstant.GET_CLIENT_SEARCH, params).subscribe({
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
    this.pfContributionReportForm.patchValue({
      selectedProjectId: null,
    });
    this.projectList = [];
    if (this.pfContributionReportForm.value.selectedClientId != null) {
      this.getProjectClientList(this.pfContributionReportForm.value.selectedClientId);
    }
  }

  getProjectClientList(clientId: number): void {
    const params = new HttpParams()
      .set('searchText', '')
      .set('clientId', clientId)
      .set('isSkipPaging', true)

    this.pfChallanService.getPfChallan<ProjectClientListModel[]>(AppConstant.GET_PROJECT + '/Search', params).subscribe({
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

  onGenerate() {
    this.isViewMode = true;
    if (this.pfContributionReportForm.valid) {
      this.pfContributionReportForm.markAllAsTouched();
      if (this.pfContributionReportForm.value.selectedType === 2) {

        const params = new HttpParams()
          .set('clientId', this.pfContributionReportForm.value.selectedClientId)
          .set('projectId', this.pfContributionReportForm.value.selectedProjectId)
          .set('month', this.pfContributionReportForm.value.selectedMonth)
          .set('year', this.pfContributionReportForm.value.selectedYear)
          .set('DifferenceCategory', this.pfContributionReportForm.value.selectedNegative === 0 ? 'All' : this.pfContributionReportForm.value.selectedNegative)
          .set('type', this.pfContributionReportForm.value.selectedType)
          .set('PageNumber', this.pageNumber)
          .set('IsPagingSkip', 'true')
          .set('RecordCount', this.recordCount);
        this.pfChallanService.getPaginationDataNew<PayrollPfdetail[], PfAttachment>(AppConstant.GET_PF_CONTRIBUTION_REPORT, params).subscribe({
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
              this.rowData.forEach(row => {
                row.totalCalculated = row.calcEe + row.calcEpS833 + row.calcEr;
                row.totalDepartment = row.deptEe + row.deptEpS833 + row.deptEr;
                row.difference = row.totalCalculated - row.totalDepartment;
              });

            } else {
              this.rowData = [];
              this.totalCount = 0;
            }
          }
        });
      } else {

        let obj = {
          name: "PF Report",
          payload: {
            Year: this.pfContributionReportForm.value.selectedYear,
            Month: this.pfContributionReportForm.value.selectedMonth,
            ClientId: this.pfContributionReportForm.value.selectedClientId,
            ProjectId: this.pfContributionReportForm.value.selectedProjectId,
            DifferenceCategory: this.pfContributionReportForm.value.selectedNegative === 0 ? 'All' : this.pfContributionReportForm.value.selectedNegative
          }
        }
        this.pfChallanService.postPfChallan(AppConstant.GET_REPORT, obj).subscribe({
          next: (response) => {
            this.toasterService.successToaster(response.message);
          }
        });
        //   .set('clientId', this.pfContributionReportForm.value.selectedClientId)
        //   .set('projectId', this.pfContributionReportForm.value.selectedProjectId)
        //   .set('month', this.pfContributionReportForm.value.selectedMonth)
        //   .set('year', this.pfContributionReportForm.value.selectedYear)
        //   .set('DifferenceCategory', this.pfContributionReportForm.value.selectedNegative)
        //   .set('type', this.pfContributionReportForm.value.selectedType)
        //   .set('IsPagingSkip', 'true');
      }
    }
  }

  downloadFile(row: any, type: string): void {

    let url = '';
    if (type === 'Challan') {
      const attachment = this.attachments.find(a => a.payrollPFId === row.payrollPfId)?.attachments;
      attachment?.forEach(element => {
        if (element.fileType === 576) {
          url = element.filePath;
        }
      });
      window.open(url, '_blank');
    } else if (type === 'ECR') {
      const attachment = this.attachments.find(a => a.payrollPFId === row.payrollPfId)?.attachments;
      attachment?.forEach(element => {
        if (element.fileType === 575) {
          url = element.filePath;
        }
      });
      window.open(url, '_blank');
    } else if (type === 'Payment Confirmation') {
      const attachment = this.attachments.find(a => a.payrollPFId === row.payrollPfId)?.attachments;
      attachment?.forEach(element => {
        if (element.fileType === 577) {
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
      this.getChallanHistoryById(this.challanData.id);
    }
  }

  onSearch(event: any): void {

  }

  onPageChange(event: any): void {

    this.pageNumber = event;
    if (!this.isHistoryData) {
      this.onGenerate();
    } else {
      this.getChallanHistoryById(this.challanData.id);
    }
  }

  onViewClick(event: any): void {

  }

  viewRecord(event: any): void {

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

  ngOnDestroy() {
    // Clean up if needed
  }
}
