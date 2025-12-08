import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { ToasterService } from '../../../../../../common/toaster-service';
import { Router } from '@angular/router';
import { AccountreportService } from '../../../../../../domain/services/account-report.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FileHandle } from '../../../../../../directive/dragDrop.directive';
import { DomSanitizer } from '@angular/platform-browser';
import { boolean } from 'mathjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';

@Component({
  selector: 'app-account-report',
  templateUrl: './account-report.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './account-report.component.scss'
})
export  class  AccountReportComponent implements OnInit {
  InvoicefilerowData: any = [];
  yearCtrl: FormControl = new FormControl(new Date());
  selectedYear: number | null = new Date().getFullYear();
  pipe: string = 'currency';
  lastDownloadedPath?: string;
useProxyDownload: any =boolean;
   showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  files: FileHandle[] = [];
modalTotalRecords: number = 0;
modalCurrentPage: number = 1;
modalTotalPages: number = 1;


  // Add near top of component properties
allRowData: any[] = []; // will hold up to 500 records returned from API
rowData: any[] = [];    // currently visible page slice
currentPage: number = 1;
pageSize: number = 10;  // ensure this is a number type
totalRecords: number = 0;
tallyPartialForm!: FormGroup;
  selectedFiles: File[] = [];
  @ViewChild("tallyPartialmodal", { static: false }) public tallyPartialmodal: | ModalDirective | undefined;

  constructor(
    private accountreportService: AccountreportService,
    private toasterService: ToasterService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) { 
    this.tallyPartialForm = this.fb.group({
      UploadFile: [null],
    });
  }

  ngOnInit(): void {
    this.getClientList(new Date(), new Date());
  }
  

get totalPages(): number {
  return this.pageSize > 0 ? Math.ceil(this.totalRecords / this.pageSize) : 0;
}
// getClientList(fromdate:any, Todate:any): void {
//   const FromDate: Date = fromdate || new Date();
//   const TodDate: Date = Todate || new Date();

//   const FromformattedDate =
//     FromDate.getFullYear() + '-' +
//     String(FromDate.getMonth() + 1).padStart(2, '0') + '-' +
//     String(FromDate.getDate()).padStart(2, '0');
    
//   const ToformattedDate =
//     TodDate.getFullYear() + '-' +
//     String(TodDate.getMonth() + 1).padStart(2, '0') + '-' +
//     String(TodDate.getDate()).padStart(2, '0');

//   let params = new HttpParams()
//     .set('isSkipPaging', 'false')
//     .set('fromDate', FromformattedDate)
//     .set('toDate', ToformattedDate)
//     .set('pageNumber', this.currentPage.toString())
//     .set('pageSize', "500");

//   this.accountreportService.getAccountreport(AppConstant.GET_Account_SEARCH, params)
//     .subscribe({
//       next: (response) => {
//         this.rowData = response.data || [];
        
//         if (this.rowData.length > 0) {
//           this.totalRecords = this.rowData[0].TotalRecord || this.rowData.length;
//         } else {
//           this.totalRecords = 0;
//         }
       
//       },
//       error: (error) => {
//         this.toasterService.errorToaster('Failed to load data');
//         console.error('Error fetching data:', error);
//         this.rowData = [];
//         this.totalRecords = 0;
//       }
//     });
// }
  // After API fetch — store allRowData, set totalRecords, set currentPage and show page 1
getClientList(fromdate: any, Todate: any): void {
  const FromDate: Date = fromdate || new Date();
  const TodDate: Date = Todate || new Date();

  const FromformattedDate =
    `${FromDate.getFullYear()}-${String(FromDate.getMonth() + 1).padStart(2, '0')}-${String(FromDate.getDate()).padStart(2, '0')}`;

  const ToformattedDate =
    `${TodDate.getFullYear()}-${String(TodDate.getMonth() + 1).padStart(2, '0')}-${String(TodDate.getDate()).padStart(2, '0')}`;

  let params = new HttpParams()
    .set('isSkipPaging', 'false')
    .set('fromDate', FromformattedDate)
    .set('toDate', ToformattedDate)
    .set('pageNumber', '1')
    .set('pageSize', '500'); 

  this.accountreportService.getAccountreport(AppConstant.GET_Account_SEARCH, params)
    .subscribe({
      next: (response) => {
        this.allRowData = Array.isArray(response.data) ? response.data : [];
        this.totalRecords = this.allRowData.length;
        this.currentPage = 1;
        this.pageSize = 10;  
        this.updatePagedData();
      },
      error: (error) => {
        this.toasterService.errorToaster('Failed to load data');
        console.error('Error fetching data:', error);
        this.allRowData = [];
        this.rowData = [];
        this.totalRecords = 0;
      }
    });
}
 DownloadInvoice(item: any) {
     const filePath: string = item.PayrollPath;
    if (filePath) {
      item.downloadUrl = filePath;
      this.lastDownloadedPath = filePath;

      if (this.useProxyDownload) {
        AppConstant.getDownloadFile(filePath);
      } else {
        this.downloadPdfFile(filePath);
      }
    } else {
      this.toasterService.warningToaster('No file available for download.');
    }
  }

 
updatePagedData(): void {
 
  const ps = Number(this.pageSize) || 10;
  const cp = Number(this.currentPage) || 1;

  const startIndex = (cp - 1) * ps;
  const endIndex = Math.min(startIndex + ps, this.totalRecords);

  this.rowData = this.allRowData.slice(startIndex, endIndex);
}

goToPage(page: number): void {
  if (page < 1) page = 1;
  if (page > this.totalPages) page = this.totalPages;
  if (page === this.currentPage) return;
  this.currentPage = page;
  this.updatePagedData();
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

getStartRecord(): number {
  if (this.totalRecords === 0) return 0;
  return (this.currentPage - 1) * this.pageSize + 1;
}

getEndRecord(): number {
  const end = this.currentPage * this.pageSize;
  return Math.min(end, this.totalRecords);
}

 fromDateCtrl = new FormControl();
toDateCtrl = new FormControl();

fromDate: Date | null = null;
toDate: Date | null = null;

 
onDateChange(): void {
  this.fromDate = this.fromDateCtrl.value;
  this.toDate = this.toDateCtrl.value;

  if (this.fromDate && this.toDate) {
    if (this.fromDate > this.toDate) {
      console.warn('From Date cannot be after To Date');
      return;
    }

    this.currentPage = 1;
    this.getClientList(this.fromDate, this.toDate);
  }
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

  
 
viewDetails(item: any): void {
  let params = new HttpParams()
    .set('isSkipPaging', 'false')
    .set('AttachmentId', item.AttachmentId);

  this.accountreportService.getAccountreport(AppConstant.Get_Invoice_Files, params)
    .subscribe({
      next: (response) => {
        this.InvoicefilerowData = response.data || [];
        this.modalTotalRecords = this.InvoicefilerowData.length;
        this.modalTotalPages = 1;
        this.modalCurrentPage = 1;
      },
      error: () => {
        this.InvoicefilerowData = [];
        this.modalTotalRecords = 0;
        this.modalTotalPages = 1;
        this.modalCurrentPage = 1;
      }
    });

  this.tallyPartialmodal?.show();
}


  filesDropped(files: FileHandle[]): void {
      this.files = files;
    }
  
    handleFileSizeErrors(errors: string[]) {
      errors.forEach(error => {
        this.toasterService.errorToaster(error);
      });
    }
  
   
    triggerProfileFileInput(fileInput: HTMLInputElement) {
      fileInput.click();
    }
  
    removeFile() {
      this.files = [];
    }
   
signtaxonDocumentFileSelected(event: Event, item: any): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  const files = Array.from(input.files);
  this.selectedFiles = files;
  this.tallyPartialForm.patchValue({ UploadFile: this.selectedFiles });

  this.files = [];
  const validFilesWithAttachmentId: any[] = [];

  files.forEach(file => {
    if (file.size > AppConstant.FILE30MB) {
      this.toasterService.errorToaster(`File "${file.name}" exceeds 30MB limit.`);
      return;
    }

    const validExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const isValidType = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (isValidType) {
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      const fileObject = { file, url, name: file.name, AttachmentId: item.AttachmentId };
      this.files.push(fileObject);
      validFilesWithAttachmentId.push(file);
    } else {
      this.toasterService.warningToaster(`Invalid file: "${file.name}". Allowed: ${validExtensions.join(', ')}`);
    }
  });

  if (validFilesWithAttachmentId.length > 0) {
    this.onSubmit(validFilesWithAttachmentId, item.AttachmentId);
  }
}


    
onSubmit(files: File[], attachmentId: number): void {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('Files', file); 
  });

  formData.append('AttachmentId', attachmentId.toString());
  formData.append('IsPublic', 'false'); 
  this.accountreportService.postAccountreport(AppConstant.Save_MultipleInvoice_Files, formData)
    .subscribe({
      next: (response) => {
       this.allRowData = Array.isArray(response.data) ? response.data : [];
        this.totalRecords = this.rowData.length > 0 ? (this.rowData[0].TotalRecords || 0) : 0;
        this.getClientList(this.fromDate, this.toDate); 
        this.toasterService.successToaster('Files uploaded successfully.');
      },
      error: (error) => {
        this.toasterService.errorToaster('Failed to upload files');
        console.error('Upload error:', error);
        this.rowData = [];
        this.totalRecords = 0;
      }
    });
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
    this.toasterService.warningToaster('No file available for download.');
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



}