import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpParams } from '@angular/common/http';
import { DepartmentMasterService } from '../../../../../../domain/services/department-master.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { MasterDepartmentDaum } from '../../../../../../domain/models/department-master.model';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import swal from "sweetalert";
import { ToasterService } from '../../../../../../common/toaster-service';

@Component({
  selector: 'app-department-master',
  templateUrl: './department-master.component.html',
  styleUrl: './department-master.component.scss'
})

export class DepartmentMasterComponent {
  departmentForm!: FormGroup;
  rowData: MasterDepartmentDaum[] = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  recode: number = 10;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  submitted = false;

  columns = [
    {
      field: 'departmentName',
      displayName: 'Name',
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: 'desciption',
      displayName: 'Description',
      sortable: true,
      filterable: true,
      visible: true,
    }
  ];

  @ViewChild("departmentmodel", { static: false })
  public departmentmodel: ModalDirective | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  constructor(
    private departmentmasterService: DepartmentMasterService,
    private toaster: ToasterService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.departmentForm = this.formBuilder.group({
      id: [''],
      departmentName: ['', Validators.required],
      desciption: ['', Validators.required],
    });
    this.getDepartmentallData();
  }

  orderBy(event: any) {
    this.orderby = event;
    this.getDepartmentallData();
  }

  onAddDepartment() {
    this.formDirective.resetForm();
    this.departmentmodel?.show();
  }

  async getDepartmentallData() {
    let params = new HttpParams()
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);

    await this.departmentmasterService.getDepartmentAllData<MasterDepartmentDaum[]>(AppConstant.GET_DEPARTMENTMASTER, params).subscribe({
      next: (responce) => {
        if (responce) {
          this.rowData = responce.data;
          this.totalCount = responce.totalCount;
        }
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.departmentForm.invalid) {
      return;
    }
    this.savedepartment();
  }

  async savedepartment() {

    let formData = new FormData();

    const data = this.departmentForm.value;

    formData.append("departmentId", data.id);
    formData.append('departmentName', data.departmentName);
    formData.append('desciption', data.desciption);

    if (data.id == null) {
      this.departmentmasterService.postDepartmentMaster(formData, AppConstant.POST_DEPARTMENTMASTER).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.toaster.successToaster(response.message);
            this.departmentmodel?.hide();
            this.formDirective.resetForm();
            this.getDepartmentallData();
          }
        }
      });
    } else {
      this.departmentmasterService.putDepartmentMaster(formData, AppConstant.PUT_DEPARTMENTMASTER).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.toaster.successToaster(response.message);
            this.departmentmodel?.hide();
            this.formDirective.resetForm();
            this.getDepartmentallData();
          }
        }
      });
    }
    this.getDepartmentallData();
  }

  onEditClicked(event: any) {
    this.departmentForm.patchValue({
      id: event.id,
      departmentName: event.departmentName,
      desciption: event.desciption,
    });
    this.departmentmodel?.show();
  }

  onDelete(event: any) {
    this.confirmDelete(event);
  }

  confirmDelete(event: any) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.deleteDepartmentMaster(event);
      } else {
        return;
      }
    });
  }

  async deleteDepartmentMaster(event: any) {
    let params = new HttpParams().set("id", event.id);
    (
      await this.departmentmasterService.deleteDepartmentMaster(AppConstant.DELETE_DEPARTMENTMASTER + event.id, params)).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.rowData = this.rowData.filter((r) => r !== event);
            this.toaster.successToaster(response.message);
            this.totalCount = this.totalCount - 1;
          }
        },
      });
  }

  onSearch(event: any) {
    this.searchTerm = event;
    this.getDepartmentallData();
  }

  onPageChange(page: any) {
    this.pageNumber = page;
    this.getDepartmentallData();
  }

  onTotalDepartmentMasterValueChange(totalDepartment: any) {
    this.recode = totalDepartment;
    this.pageNumber = 1;
    this.getDepartmentallData();
  }

  get f() {
    return this.departmentForm.controls;
  }

}
