import { HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { AppConstant } from '../../../../../../common/app-constant';
import swal from "sweetalert";
import { CustomReportTemplateList } from '../../../../../../domain/models/reporting.model';
import { ReportingService } from '../../../../../../domain/services/report.service';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { NavigationExtras, Router } from '@angular/router';
import { ToasterService } from '../../../../../../common/toaster-service';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.scss',
   encapsulation: ViewEncapsulation.None,
})

export class ReportingComponent {

  dropdownSubscription: any;
  recode: number = 12;
  searchTerm: string = '';
  orderby: string = '';
  pageNumber: number = 1;

  columns = [
    {
      field: "title",
      displayName: "name",
      sortable: true,
      filterable: true,
      visible: true,
    }, {
      field: "destinationSourceName",
      displayName: "Destination Source",
      sortable: true,
      filterable: true,
      visible: true,
    }, {
      field: "inputSourceName",
      displayName: "Input Source",
      sortable: true,
      filterable: true,
      visible: true,
    }, {
      field: "columnCount",
      displayName: "Columns",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      searchable: true
    }, {
      field: "",
      displayName: "Generate/View",
      button: true,
      icon: 'genrateReport',
      sortable: false,
      filterable: false,
      visible: true,
      isCenter: true,
      searchable: true,
      fixVisible: true,
      FileDownload: false
    }
  ];
  rowData: CustomReportTemplateList[] = [];
  totalCount: number = 0;

  constructor(
    private reportingService: ReportingService,
    private headerDropdownService: HeaderDropdownService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toasterService: ToasterService
    // private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);
      if (value != project) {
        this.GetAllCustomReportTemplate();
      }
    });

    this.GetAllCustomReportTemplate();

  }

  async GetAllCustomReportTemplate() {
    let param = new HttpParams()
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);
    await this.reportingService.get<CustomReportTemplateList[]>(AppConstant.CUSTOM_REPORT, param).subscribe({
      next: (response) => {
        this.rowData = response.data;
        this.totalCount = response.totalCount;
      }
    })
  }

  generate(row: CustomReportTemplateList) {
    const navigationExtras: NavigationExtras = {
      state: {
        reportData: row,
      },
    };
    this.router.navigate(["/reporting/reportView"], navigationExtras);
  }

  async onDelete(item: any) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.reportingService.delete(AppConstant.CUSTOM_REPORT + '/' + item.id).subscribe({
          next: (response) => {
            if (response && response.success) {
              this.toasterService.successToaster(response.message);
              this.GetAllCustomReportTemplate();
            } else {
              this.toasterService.errorToaster(response.message);
            }
          },
        });
      } else {
        return;
      }
    });
  }

  onInsert() {
    this.router.navigate(['reporting/createtemplate'])
  }

  onPageChange(event: any) {
    this.pageNumber = event;
    this.GetAllCustomReportTemplate();
  }

  orderBy(event: any) {
    this.orderby = event;
    this.GetAllCustomReportTemplate();
  }

  onRecordValueChange(event: any) {
    this.recode = event;
    this.GetAllCustomReportTemplate();
  }

  onSearch(event: any) {
    this.searchTerm = event;
    this.GetAllCustomReportTemplate();
  }

  onEdit(row: CustomReportTemplateList) {

    const navigationExtras: NavigationExtras = {
      state: {
        reportData: row,
      },
    };
    this.router.navigate(["/reporting/createtemplate"], navigationExtras);
  }

}
