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

@Component({
  selector: 'app-account-report',
  templateUrl: './account-report.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './account-report.component.scss'
})
export class AccountReportComponent implements OnInit {
  rowData: any = [];
  InvoicefilerowData: any = [];
  yearCtrl: FormControl = new FormControl(new Date());
  selectedYear: number | null = new Date().getFullYear();
  pipe: string = 'currency';
  lastDownloadedPath?: string;
useProxyDownload: any =boolean;
   showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  files: FileHandle[] = [];

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


//Popup Methods and Properties can be added here
 tallyPartialForm!: FormGroup;
  selectedFiles: File[] = [];
  @ViewChild("tallyPartialmodal", { static: false }) public tallyPartialmodal: | ModalDirective | undefined;

  viewDetails(item: any): void {
 let params = new HttpParams()
    .set('isSkipPaging', 'false')
    .set('AttachmentId', item.AttachmentId)
 this.accountreportService.getAccountreport(AppConstant.Get_Invoice_Files, params)
    .subscribe({
      next: (response) => {
        
        this.InvoicefilerowData = response.data || [];
        
        if (this.InvoicefilerowData.length > 0) {
          this.totalRecords = this.rowData[0].TotalRecords || 0;
        } else {
          this.totalRecords = 0;
        }
        
       
      },
      error: (error) => {
        this.toasterService.errorToaster('Failed to load data');
        console.error('Error fetching data:', error);
        this.rowData = [];
        this.totalRecords = 0;
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
  // formData.append('ExtraPath', 'optional-folder'); // optional

  this.accountreportService.postAccountreport(AppConstant.Save_MultipleInvoice_Files, formData)
    .subscribe({
      next: (response) => {
        this.rowData = response.data || [];
        this.totalRecords = this.rowData.length > 0 ? (this.rowData[0].TotalRecords || 0) : 0;
        this.getClientList()
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