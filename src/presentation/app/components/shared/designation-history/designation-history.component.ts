import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { EmployeeDesignationHistoryService } from '../../../../../domain/services/employeedesignationhistory.service';
import { EmployeeDesignationHistoryModel } from '../../../../../domain/models/employeedesignationhistory.model';
import { AppConstant } from '../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { ToasterService } from '../../../../../common/toaster-service';
import { DesignationMasterService } from '../../../../../domain/services/designation-master.service';
import { Designation } from '../../../../../domain/models/designation.model';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-designation-history',
  templateUrl: './designation-history.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './designation-history.component.scss'
})

export class DesignationHistoryComponent implements OnInit {
  totalCount: number = 0;
  pageNumber: number = 1;
  recode: number = 10;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  submitted = false;
  @Input() employeeId: number = 0;
  designationForm!: FormGroup;
  designationData: EmployeeDesignationHistoryModel[] = [];
  designationList: Designation[] = [];
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  @ViewChild('designationSelect') designationSelect!: NgSelectComponent;
  searchText: string = "";

  constructor(private fb: FormBuilder, private employeeDesigainationHistory: EmployeeDesignationHistoryService,
    private toaster: ToasterService,
    private designationMasterService: DesignationMasterService
  ) { }

  ngOnInit() {
    this.designationForm = this.fb.group({
      designationId: ['', [Validators.required]]
    });
    this.getAllEmployeeDesignationHistory();
    this.getAllDesignation();
    this.resetDesignationSelect();
  }

  resetDesignationSelect() {
    const designationControl = this.designationForm.get('designationId');
    if (designationControl) {
      designationControl.reset();
    }
    if (this.designationSelect) {
      this.designationSelect.clearModel();
      this.designationSelect.close();
    }
  }

  onDesignationSearch(term: string): void {
    this.searchText = term;
    this.getAllDesignation();
  }

  async getAllDesignation() {
    let httpParams = new HttpParams().set("SearchText", this.searchText);
    await this.designationMasterService.getDesignationAllData<Designation[]>(AppConstant.DESIGNATION + '/Search', httpParams).subscribe({
      next: (response) => {
        this.designationList = response.data;
      }
    })
  }

  getAllEmployeeDesignationHistory() {
    let params = new HttpParams()
      .set("employeeId ", this.employeeId.toString())
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);
    this.employeeDesigainationHistory.getEmployeeDesignationHistory<EmployeeDesignationHistoryModel[]>(`${AppConstant.GET_EMPLOYEE_DESIGNATION_HISTORY}/${this.employeeId}/EmployeeDesignationHistory`, params).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.designationData = response.data;
          this.totalCount = response.totalCount;
        }
      }
    })
  }

  async onSubmit() {
    this.submitted = true;
    const designationControl = this.designationForm.get('designationId');
    if (designationControl) {
      designationControl.markAsTouched();
    }
    if (this.designationForm.invalid) {
      return;
    }
    const obj = {
      designationId: this.designationForm.value.designationId,
      employeeId: this.employeeId
    };
    await this.employeeDesigainationHistory.postEmployeeDesignationHistory(obj, AppConstant.POST_EMPLOYEE_DESIGNATION_HISTORY).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.getAllEmployeeDesignationHistory();
          this.toaster.successToaster(response.message);
          this.formDirective.resetForm();
        }
      }
    });
  }

}
