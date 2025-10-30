import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { ToasterService } from '../../../../../../common/toaster-service';
import { Router } from '@angular/router';
import { AccountreportService } from '../../../../../../domain/services/account-report.service';

@Component({
  selector: 'app-account-report',
  templateUrl: './account-report.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './account-report.component.scss'
})
export class AccountReportComponent implements OnInit {
  rowData: any = [];
  yearCtrl: FormControl = new FormControl(new Date());
  selectedYear: number | null = new Date().getFullYear();
  pipe: string = 'currency';
 
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  constructor(
    private accountreportService: AccountreportService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getClientList();
  }
  

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

getClientList(): void {
  const selectedDate: Date = this.yearCtrl.value || new Date();

  const formattedDate =
    selectedDate.getFullYear() + '-' +
    String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
    String(selectedDate.getDate()).padStart(2, '0');

  let params = new HttpParams()
    .set('isSkipPaging', 'false')
    .set('date', formattedDate)
    .set('pageNumber', this.currentPage.toString())
    .set('pageSize', this.pageSize.toString());

  this.accountreportService.getAccountreport(AppConstant.GET_Account_SEARCH, params)
    .subscribe({
      next: (response) => {
        this.rowData = response.data || [];
        
        if (this.rowData.length > 0) {
          this.totalRecords = this.rowData[0].TotalRecords || 0;
        } else {
          this.totalRecords = 0;
        }
        
        console.log('Total Records:', this.totalRecords);
        console.log('Current Page:', this.currentPage);
        console.log('Total Pages:', this.totalPages);
      },
      error: (error) => {
        this.toasterService.errorToaster('Failed to load data');
        console.error('Error fetching data:', error);
        this.rowData = [];
        this.totalRecords = 0;
      }
    });
}

  onDateChange(event: any): void {
    this.yearCtrl.setValue(event.value);
    this.currentPage = 1; 
    this.getClientList();
  }

  
  onPageSizeChange(): void {
    this.currentPage = 1; 
    this.getClientList();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.getClientList();
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

  viewDetails(item: any): void {
    console.log('View details for:', item);
    
  }
}