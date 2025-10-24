import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportingService } from '../../../../../../domain/services/report.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { Code, CodeType } from '../../../../../../domain/models/project.model';
import { BuilderTableIdAndName, CustomReportColumnTableList, CustomReportTemplateList } from '../../../../../../domain/models/reporting.model';
import { ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import swal from "sweetalert";
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToasterService } from '../../../../../../common/toaster-service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './create-template.component.scss'
})
export class CreateTemplateComponent implements OnInit {

  aggregateList: Code[] = [];
  inputList: Code[] = [];
  columnNameList: BuilderTableIdAndName[] = [];
  columnList: CustomReportColumnTableList[] = [];
  editableTemplateData: CustomReportTemplateList = new CustomReportTemplateList();
  private previousInputSourceId: any = null;
  reportTemplateForm!: FormGroup;
  templateColumnForm!: FormGroup;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  // @ViewChild("templateColumnFormDirective", { static: false }) templateColumnFormDirective!: NgForm;
  @ViewChild('templateColumnFormDirective', { static: false }) private templateColumnFormDirective!: FormGroupDirective;
  @ViewChild('AddColumnForReport', { static: false }) public AddColumnForReport:
    | ModalDirective
    | undefined;

  constructor(
    private reportingService: ReportingService,
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToasterService
  ) {
    this.reportTemplateForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      destinationSourceId: [null, Validators.required],
      inputSourceId: [null, Validators.required],
    })
    this.templateColumnForm = this.fb.group({
      id: [0],
      builderTableColumnId: ['', Validators.required],
      customName: ['', Validators.required],
      order: [this.columnList.length + 1, Validators.required]
    })

    this.previousInputSourceId = this.reportTemplateForm.controls['inputSourceId'].value;
    this.reportTemplateForm.controls['inputSourceId'].valueChanges.subscribe(newValue => {

      if (newValue != null) {
        if (this.columnList.length > 0) {
          swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            buttons: ['No', 'Yes'],
            dangerMode: true
          }).then(willDelete => {
            if (willDelete) {
              this.getColumName(this.inputList.find(m => m.id === this.reportTemplateForm.controls['inputSourceId'].value)?.name);

              this.columnList = [];
              const nextOrdinal = this.columnList.length + 1;

              this.templateColumnForm.patchValue({
                order: nextOrdinal
              });

              this.templateColumnForm.get('order')?.updateValueAndValidity();

              this.columnList.forEach((element, index) => {
                element.order = index + 1;
              });
              this.previousInputSourceId = newValue;
            } else {
              this.reportTemplateForm.controls['inputSourceId'].setValue(this.previousInputSourceId, { emitEvent: false });
            }
          });
        } else {
          this.getColumName(this.inputList.find(m => m.id === this.reportTemplateForm.controls['inputSourceId'].value)?.name);
          this.previousInputSourceId = newValue;
        }

      }
    })
  }

  ngOnInit() {
    this.getCodesData('Aggregate', 51);
    this.getCodesData('input', 52);

    if (history.state.reportData != null || history.state.reportData != undefined) {
      this.getTemplateDataById(history.state.reportData.id);
    }
  }

  async getTemplateDataById(templateId: number) {
    await this.reportingService.get<CustomReportTemplateList>(AppConstant.CUSTOM_REPORT + "/" + templateId).subscribe({
      next: (response) => {
        this.editableTemplateData = response.data;
        this.reportTemplateForm.patchValue({
          id: this.editableTemplateData.id,
          title: this.editableTemplateData.title,
          destinationSourceId: this.editableTemplateData.destinationSourceId,
          inputSourceId: this.editableTemplateData.inputSourceId,
        })
        this.getColumName(this.editableTemplateData.inputSourceName);

        this.columnList = this.editableTemplateData.customReportColumnTableList;
      }
    })
  }


  async getColumName(newValue?: string) {
    if (newValue !== '' && newValue !== undefined) {
      let params = new HttpParams()
        .set('ApplyTo', newValue ?? '');
      await this.reportingService.get<BuilderTableIdAndName[]>(AppConstant.BUILDER_TABLE_ID_NAME, params).subscribe({
        next: (response) => {
          this.columnNameList = response.data;
        }
      })
    }
  }

  async getCodesData(type: string, code: number) {
    let obj = { codeTypeIds: [code] };
    await this.reportingService.post<CodeType[]>(AppConstant.GET_ALLCODESBYCODETYPES, obj).subscribe({
      next: (response) => {
        if (type === 'Aggregate') {

          this.aggregateList = response.data[0].codes;
        } else {
          this.inputList = response.data[0].codes;
        }
      }
    })
  }

  openModel() {
    this.AddColumnForReport?.show();
    this.templateColumnForm.reset();
    this.templateColumnFormDirective.resetForm();
    const nextOrdinal = this.columnList.length + 1;

    this.templateColumnForm.patchValue({
      order: nextOrdinal
    });
    this.templateColumnForm.get('order')?.updateValueAndValidity();
  }

  closeModel() {
    this.AddColumnForReport?.hide();
    this.templateColumnForm.reset();
    this.templateColumnFormDirective.resetForm();
    const nextOrdinal = this.columnList.length + 1;

    this.templateColumnForm.patchValue({
      order: nextOrdinal
    });
    this.templateColumnForm.get('order')?.updateValueAndValidity();

  }

  addTemplateColumn() {
    if (this.templateColumnForm.valid) {
      let data = this.templateColumnForm.value;

      const isDuplicate = this.columnList.some(
        col => col.customName.trim().toLowerCase() === data.customName.trim().toLowerCase()
      );

      if (isDuplicate) {
        this.toaster.errorToaster('Column Name already exists!');
        return;
      }

      let obj = new CustomReportColumnTableList();
      obj.builderTableColumnId = data.builderTableColumnId;
      obj.order = data.order;
      obj.customName = data.customName;
      obj.builderTableColumnName = this.columnNameList.find(c => c.id === data.builderTableColumnId)?.userProperty || '';

      if (this.editableTemplateData && this.editableTemplateData.id) {
        obj.customReportTemplateId = this.editableTemplateData.id
      }

      this.columnList.push(obj);

      this.closeModel();


      const nextOrdinal = this.columnList.length + 1;

      this.templateColumnForm.patchValue({
        order: nextOrdinal
      });
      this.templateColumnForm.get('order')?.updateValueAndValidity();
    } else {

    }

  }

  deleteTemplateColumn(step: CustomReportColumnTableList) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      buttons: ['No', 'Yes'],
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        this.columnList = this.columnList.filter(s => s !== step);
        const nextOrdinal = this.columnList.length + 1;

        this.templateColumnForm.patchValue({
          order: nextOrdinal
        });

        this.templateColumnForm.get('order')?.updateValueAndValidity();

        this.columnList.forEach((element, index) => {
          element.order = index + 1;
        });
      } else {
        swal('Cancelled', 'Your record is safe :)', 'error');
      }
    });
  }

  resetColumnList() {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      buttons: ['No', 'Yes'],
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        this.columnList = [];
        const nextOrdinal = this.columnList.length + 1;

        this.templateColumnForm.patchValue({
          order: nextOrdinal
        });

        this.templateColumnForm.get('order')?.updateValueAndValidity();

        this.columnList.forEach((element, index) => {
          element.order = index + 1;
        });
      } else {
        swal('Cancelled', 'Your record is safe :)', 'error');
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.columnList, event.previousIndex, event.currentIndex);

    this.columnList.forEach((item, index) => {
      item.order = index + 1;
    });

  }


  async upsertReport() {
    let data = this.reportTemplateForm.value;
    if (this.reportTemplateForm.valid && this.columnList.length > 0) {
      if (data.id !== 0) {
        let obj = {
          "title": data.title,
          "destinationSourceId": data.destinationSourceId,
          "inputSourceId": data.inputSourceId,
          "customColumns": this.columnList,
          "id": data.id
        }

        await this.reportingService.put<CustomReportTemplateList>(AppConstant.CUSTOM_REPORT, obj).subscribe({
          next: (response) => {
            if (response.success) {
              this.toaster.successToaster(response.message);
              this.navigateToDashboard();
            } else {
              this.toaster.errorToaster(response.message);
            }
          }
        })
      } else {
        let obj = {
          "title": data.title,
          "destinationSourceId": data.destinationSourceId,
          "inputSourceId": data.inputSourceId,
          "customColumns": this.columnList,
        }

        await this.reportingService.post<CustomReportTemplateList>(AppConstant.CUSTOM_REPORT, obj).subscribe({
          next: (response) => {
            if (response.success) {
              this.toaster.successToaster(response.message);
              this.navigateToDashboard();
            } else {
              this.toaster.errorToaster(response.message);
            }
          }
        })
      }
    } else {
      if (this.columnList.length === 0 && this.reportTemplateForm.valid) {
        this.toaster.warningToaster('You need to have at least one record in the column for the report.')
      }
    }
  }

  // In your component.ts
  navigateToDashboard(): void {
    if (this.reportTemplateForm) {
      this.reportTemplateForm.reset();
    }

    // Use Router for clean navigation
    this.router.navigate(['/reporting/dashboard'], {
      queryParams: {}, // Empty query params
      replaceUrl: true // This replaces the current URL in browser history
    });
  }

  noWhitespaceValidator(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

}
