import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportingService } from '../../../../../../domain/services/report.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { ApprovedPayroll, CustomReportTemplateList, DynamicList, Value } from '../../../../../../domain/models/reporting.model';
import { HttpParams } from '@angular/common/http';
import { DynamicArrayApiResponse } from '../../../../../../domain/models/base.model';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { LocalStorageService } from '../../../../../../common/local-storage.service';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './report-view.component.scss'
})
export class ReportViewComponent implements OnInit {

  reportGenerateForm!: FormGroup;
  templateList: CustomReportTemplateList[] = [];
  dynamicList: DynamicList[] = [];
  dropDown: any = [];
  selectedKey: string = "";
  selectedValue: { key: string; value: any }[] = [];
  dropdownSubscription: any;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reportingService: ReportingService,
    private headerDropdownService: HeaderDropdownService,
    private localStorageService: LocalStorageService,
  ) {
    this.reportGenerateForm = this.fb.group({
      CustomReportTemplateId: ['', Validators.required],
      Type: [3, Validators.required],
    })
  }

  ngOnInit() {
    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {
        this.router.navigate(['/reporting/dashboard'])
      }
    });

    if (history.state.reportData != null || history.state.reportData != undefined) {
      this.reportGenerateForm.patchValue({
        CustomReportTemplateId: history.state.reportData.id,
      })
    }
    this.getTemplateList();
    this.getDynamicData();

    this.reportGenerateForm.get('CustomReportTemplateId')?.valueChanges.subscribe(selectedId => {
      this.getDynamicData();
    });

  }

  addControlForm(name: string, value: any, validators: boolean) {
    this.reportGenerateForm.addControl(name, this.fb.control(value, validators ? [] : [Validators.required,]));
  }

  async getDynamicData() {
    let params = new HttpParams()
      .set('Id', this.reportGenerateForm.get('CustomReportTemplateId')?.value)
    await this.reportingService.getObject<DynamicList[]>(AppConstant.GET_TABLE_DATA, params).subscribe({
      next: (response) => {
        if (response.success) {
          //   name: value
          this.dynamicList = response.data;
          this.dynamicList.forEach(element => {
            this.addControlForm(element.name, null, element.isOptional)
          });

          //   ...item,
        } else {
          this.dynamicList = [];
        }
      }
    })
  }

  onChildChange(event: any, item: any) {
    let obj = {
      key: item[this.selectedKey].name,
      value: event.value
    }
    this.selectedValue.push(obj);
  }


  onChange(event: any, item: DynamicList) {
    let obj = {
      key: item.name,
      value: event.value
    }
    this.selectedValue.push(obj);
    if (item.type === "select") {
      item.values.forEach(element => {
        if (element.childValue && element.keyValue === event.value) {
          this.dropDown = [];
          this.addDynamicObject(element.childValue.name, element.childValue);
          this.selectedKey = element.childValue.name;
          this.addControlForm(element.childValue.name, null, element.childValue.isOptional)

        }
      });
    }



    //   // this.dropDown.push(event.childValue.name, event.childValue.values);

  }

  addDynamicObject(key: string, value: any) {
    const obj: { [key: string]: any } = {};  // Create an empty object
    obj[key] = value;
    this.dropDown.push(obj);
  }

  async getTemplateList() {
    await this.reportingService.get<CustomReportTemplateList[]>(AppConstant.GET_ALL_CUSTOM_REPORT).subscribe({
      next: (response) => {
        if (response.success) {
          this.templateList = response.data;
        } else {
          this.templateList = [];
        }
      }
    })
  }

  dynamicData: { [key: string]: string }[] = []; // Array of dynamic objects
  dynamicKeys: string[] = [];
  recodeCount: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;
  currentPage: number = 1;
  startItem: number = 1;
  endItem: number = this.recodeCount;

  async generateReport() {
    if (this.reportGenerateForm.valid) {
      if (this.reportGenerateForm.get('Type')?.value != 3) {
        let reportParameters: { [key: string]: any } = {};
        this.selectedValue.forEach(element => {
          const obj: { [key: string]: any } = {};  // Create an empty object
          reportParameters[element.key] = element.value;
        });
        let obj = {
          pageNumber: this.pageNumber,
          recordCount: this.recodeCount,
          reportParameters: reportParameters,
          customReportTemplateId: this.reportGenerateForm.get('CustomReportTemplateId')?.value,
          type: this.reportGenerateForm.get('Type')?.value,
          isPagingSkip: true

        }
        this.reportingService.getDownloadFile(AppConstant.GENERATE_REPORT, obj).subscribe({
          next: (blob: Blob) => {
            if (blob && blob instanceof Blob) {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              if (this.reportGenerateForm.get('Type')?.value === 1) {
                a.download = this.templateList.find(m => m.id === this.reportGenerateForm.get('CustomReportTemplateId')?.value)?.title + "_report.csv";
              } else if (this.reportGenerateForm.get('Type')?.value === 2) {
                a.download = this.templateList.find(m => m.id === this.reportGenerateForm.get('CustomReportTemplateId')?.value)?.title + "_report.xlsx";
              } else if (this.reportGenerateForm.get('Type')?.value === 4) {
                a.download = this.templateList.find(m => m.id === this.reportGenerateForm.get('CustomReportTemplateId')?.value)?.title + "_report.txt";
              }
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }
          },
          error: (error) => {
            // Handle error
          }
        });
      } else {
        let reportParameters: { [key: string]: any } = {};
        this.selectedValue.forEach(element => {
          const obj: { [key: string]: any } = {};  // Create an empty object
          reportParameters[element.key] = element.value;
        });
        let obj = {
          pageNumber: this.pageNumber,
          recordCount: this.recodeCount,
          reportParameters: reportParameters,
          customReportTemplateId: this.reportGenerateForm.get('CustomReportTemplateId')?.value,
          type: this.reportGenerateForm.get('Type')?.value,
          isPagingSkip: false
        }


        await this.reportingService.getArray(AppConstant.GENERATE_REPORT, obj).subscribe({
          next: (response) => {
            this.totalCount = response.totalCount;
            this.dynamicData = response.data; // Store raw dynamic data

            if (this.dynamicData.length > 0) {
              this.dynamicKeys = Object.keys(this.dynamicData[0]); // Extract keys dynamically
            }

          }
        })
      }
    } else {
      this.reportGenerateForm.markAllAsTouched();
    }
  }

  onRecodeChange(event: Event) {
    this.endItem = parseInt((event.target as HTMLSelectElement).value);
    this.recodeCount = parseInt((event.target as HTMLSelectElement).value);

  }

  pageChanged(event: any): void {
    this.startItem = ((event.page - 1) * event.itemsPerPage) + 1;
    this.endItem = this.totalCount < event.page * event.itemsPerPage ? this.totalCount : event.page * event.itemsPerPage;
    this.pageNumber = event.page;
    this.generateReport();
  }


  navigateToDashboard() {
    this.router.navigate(['reporting/dashboard']);

  }

}

function formatDisplayName(item: { name: string; month: number; year: number }): string {
  return `${item.name} (${AppConstant.MONTH_DATA.find(m => m.id == item.month)?.monthName} - ${item.year})`;
}
