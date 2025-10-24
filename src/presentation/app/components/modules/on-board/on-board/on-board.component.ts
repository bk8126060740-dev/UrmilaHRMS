import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProjectDaum } from '../../../../../../domain/models/project.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Row } from 'jspdf-autotable';
import { FileHandle } from '../../../../../../directive/dragDrop.directive';
import { DomSanitizer } from '@angular/platform-browser';
import { ToasterService } from '../../../../../../common/toaster-service';
import { OnBoardService } from '../../../../../../domain/services/onboard.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { EmployeeOnBoardData, onBoardingStatus } from '../../../../../../domain/models/on-board.modal';
import { DatePipe } from '@angular/common';
import { ExportService } from '../../../../../../domain/services/export.service';
import { Router } from '@angular/router';
import { Data } from '../../../../../../domain/models/filter.model';
import { NgForm } from '@angular/forms';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { SignalRService } from '../../../../../../common/signal-R.service';
import { JwtService } from '../../../../../../common/jwtService.service';

@Component({
  selector: "app-on-board",
  templateUrl: "./on-board.component.html",
  styleUrl: "./on-board.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class OnBoardComponent {
  name = 'Angular 5';
  files: FileHandle[] = [];
  rowData: any[] = [];
  lastDownloadedPath?: string;
  useProxyDownload: boolean = true;
  isLoading: boolean = false;
  totalCount: number = 0;
  description: string = "";
  recode: number = 10;
  pageNumber: number = 1;
  searchTerm: string = "";
  orderby: string = "";
  onBoardStatus: onBoardingStatus[] = [];
  defualtSelectedStatus: onBoardingStatus = new onBoardingStatus();
  selectedStatus: onBoardingStatus = new onBoardingStatus();
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  dropdownSubscription: any;
  constructor(private sanitizer: DomSanitizer,
    private toaster: ToasterService,
    private onBoardService: OnBoardService,
    private datePipe: DatePipe,
    private exportService: ExportService,
    private router: Router,
    private headerDropdownService: HeaderDropdownService,
    private signalRService: SignalRService,
    private jwtService: JwtService
  ) { }

  @ViewChild("AddOnBoardModel", { static: true })
  public addOnBoardModel: ModalDirective | undefined;
  rows: EmployeeOnBoardData[] = [];

  columns = [
    {
      field: "fileName",
      displayName: "File Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    }, {
      field: "description",
      displayName: "Description",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: false,
    }, {
      field: "statusName",
      displayName: "Status",
      sortable: true,
      filterable: true,
      visible: true,
      isColor: true,
      fixVisible: true,
      isCenter: true,
      searchable: true
    }, {
      field: "success",
      displayName: "Success",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      searchable: true
    }, {
      field: "error",
      displayName: "Error",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      searchable: true
    }, {
      field: "formatteduploadDate",
      displayName: "Upload Date",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      searchable: true
    }
    // , {
    //   field: "",
    //   displayName: " Success File",
    //   button: true,
    //   sortable: false,
    //   filterable: false,
    //   visible: true,
    //   isCenter: true,
    //   icon: 'sucessFileDownload'

    , {
      field: "",
      displayName: "Error File",
      button: true,
      sortable: false,
      filterable: false,
      visible: true,
      isCenter: true,
      icon: 'errorFileDownload'
    },
  ];

  filterData: Data[] = [];


  ngOnInit() {

    this.signalRService.on('BulkEmployeeProcessed', (message: string) => {
      // 
      this.GetAllEmployeeOnBoardings();

    });


    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      this.GetAllEmployeeOnBoardings();
    });
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }

  async GetAllEmployeeOnBoardings() {
    let params = new HttpParams()
      .set('RecordCount', this.recode.toString())
      .set('PageNumber', this.pageNumber.toString())
      .set('FilterBy', this.searchTerm)
      .set('OrderBy', this.orderby);

     
    this.isLoading = true;
    this.onBoardService.GetAllEmployeeOnBoardings(AppConstant.GET_ALLEMPLOYE_ONBOARD, params).subscribe({
      next: (response) => {
        
        this.totalCount = response?.totalCount ?? 0;

        const dataArray = response?.data ?? [];
        const statusArray = response?.onBoardingStatus ?? [];

        this.rowData = dataArray.map((data) => {
          const newData: EmployeeOnBoardData = {
            ...data,
            uploadDate: data?.uploadDate ? new Date(data.uploadDate) : new Date(),
            formatteduploadDate: data?.uploadDate ? this.datePipe.transform(new Date(data.uploadDate), 'dd/MM/yyyy') || undefined : undefined,
            originalFilePath: data.fileName,
            fileName: AppConstant.getActualFileName(data.fileName)
          };
          return newData;
        });

        this.rowData.forEach((payroll) => {
          const matchingStatus = statusArray.find(
            (status: any) => status?.id === payroll.status
          );
          if (matchingStatus) {
            payroll.colorCode = matchingStatus.colorCode;
          }
          payroll.statusColorCode = payroll.colorCode;
        });

        const root = document.documentElement;
        const themeColor = getComputedStyle(root).getPropertyValue('--theme-color').trim();
        this.onBoardStatus = [];
        this.defualtSelectedStatus = new onBoardingStatus();
        this.defualtSelectedStatus.colorCode = themeColor;
        this.defualtSelectedStatus.count = response?.statusCount ?? 0;
        this.defualtSelectedStatus.id = 0;
        this.defualtSelectedStatus.name = "Total Records";

        this.onBoardStatus.push(this.defualtSelectedStatus);
        
        statusArray.forEach(element => {
          this.onBoardStatus.push(element);
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load onboarding records', err);
        this.toaster.errorToaster('Failed to load records');
        this.isLoading = false;
      }
    });

  }

  extractFileName(filePath: string): string {
    const decodedPath = decodeURIComponent(filePath);
    const cleanPath = decodedPath.split('?')[0];
    const normalizedPath = cleanPath.replace(/\\/g, '/');
    let fileName = normalizedPath.split('/').pop() || '';
    fileName = fileName.replace(/^\d+[_\s]*/, '');
    return fileName;
  }

  async onStatusCardClick(status: any, event: Event) {
    this.selectedStatus = status;

    if (status.name == 'Total Records') {
      this.GetAllEmployeeOnBoardings()
    } else {

      this.searchTerm = `status eq ${status.id}`;
      await this.GetAllEmployeeOnBoardings();
      this.searchTerm = '';
    }


  }
  refreshPage() {
    this.GetAllEmployeeOnBoardings()
  }

  onEdit(event: MouseEvent) {

  }

  onDelete(event: MouseEvent) {

  }

  onBulkUpload() {

    this.addOnBoardModel?.show();
  }

  onPageChange(value: number) {
    this.pageNumber = value;
    this.GetAllEmployeeOnBoardings();
  }

  onTotalProjectPerPageValueChange(totalProjectCount: number) {
    this.recode = totalProjectCount;
    this.pageNumber = 1;
    this.GetAllEmployeeOnBoardings();
  }


  onSearch(search: string) {
    this.searchTerm = search;
    this.GetAllEmployeeOnBoardings();
  }

  orderBy(event: any) {
    this.orderby = event;
    this.GetAllEmployeeOnBoardings();
  }

  async UploadFile() {
    if (this.files.length > 0) {
      if (this.description === "" || this.description === undefined || this.description === null) {
        this.toaster.warningToaster('Please Enter Description before uploading.')

      } else {
        let formData = new FormData();
        if (this.files[0].file) {
          formData.append('File', this.files[0].file);
          formData.append('Description', this.description)
        }
        await this.onBoardService.UploadExcel(AppConstant.POST_BULK_ONBOARD, formData).subscribe({
          next: (response) => {
            if (response.status == 200) {
              this.toaster.successToaster('File uploaded successfully.', 'Upload Complete');
              this.GetAllEmployeeOnBoardings();
              this.files = [];
              this.description = "";
              this.addOnBoardModel?.hide();
            }
          },
          error: (error) => {
            this.toaster.errorToaster('File uploaded Fail.', 'Upload Fail')

          }
        })
      }
    } else {
      this.toaster.warningToaster('No file selected. Please choose a file to upload.')
    }
  }

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }

  handleFileSizeErrors(errors: string[]) {
    errors.forEach(error => {
      this.toaster.errorToaster(error);
    });
  }

  upload(): void {
  }
  triggerProfileFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  removeFile() {
    this.files = [];
  }

  fileDownload(row: any) {
    let filePath: string | undefined;

    if (!row) {
      this.toaster.warningToaster('No file available for download.');
      return;
    }

    if (typeof row === 'string') {
      filePath = row;
      try {
        const matchingRow = this.rowData.find(r => r && (r.errorFile === filePath || r.archiveFile === filePath || r.originalFilePath === filePath));
        if (matchingRow) {
          matchingRow.downloadUrl = filePath;
        }
      } catch (e) {
      }
    } else if (typeof row === 'object') {
      filePath = row.errorFile || row.archiveFile || row.originalFilePath || row.filePath || row.paymentAdvice || row.documentPath || row.uploadedFilePath || row.fileName;

      if (filePath && typeof filePath === 'string' && !filePath.startsWith('http') && !filePath.startsWith('https') && !filePath.startsWith('/')) {
        const candidates = [row.errorFile, row.archiveFile, row.originalFilePath, row.filePath, row.paymentAdvice, row.documentPath, row.uploadedFilePath];
        filePath = candidates.find((c: any) => typeof c === 'string' && (c.startsWith('http') || c.startsWith('https') || c.startsWith('/')));
      }
    }

    if (filePath) {
      try {
        if (row && typeof row === 'object') {
          row.downloadUrl = filePath;
        }
      } catch (e) {
       
      }
      this.lastDownloadedPath = filePath;
      if (this.useProxyDownload) {
      AppConstant.getDownloadFile(filePath);
      }
  
    } else {
      this.toaster.warningToaster('No file available for download.');
    }
  }
  onInsert() {

    this.router.navigate(['/onboard/create'])
  }

  downloadFile(blob: Blob, file_name: any) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file_name + '.xlsx'; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  
 


  onDocumentFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      if (file.size > AppConstant.FILE30MB) {
        this.toaster.errorToaster(`File "${file.name}" exceeds the size limit of 15MB.`);
      } else {
        this.files = [];

        const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        const name = file.name;
        if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
          this.files.push({ file, url, name });

        } else {
          this.toaster.warningToaster('We allow only excel file for Bulk Upload!!')

        }
      }
    }
  }
}
