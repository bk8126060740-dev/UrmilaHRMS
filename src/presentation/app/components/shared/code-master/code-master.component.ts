import { Component, Input, ViewChild } from '@angular/core';
import { AppConstant } from '../../../../../common/app-constant';
import { codeDaum } from '../../../../../domain/models/code.model';
import { CodeService } from '../../../../../domain/services/code.service';
import { ToasterService } from '../../../../../common/toaster-service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { CodeTypeModel } from '../../../../../domain/models/codeType.model';
import swal from 'sweetalert';

@Component({
  selector: 'app-code-master',
  templateUrl: './code-master.component.html',
  styleUrl: './code-master.component.scss'
})
export class CodeMasterComponent {
  @Input() codeTypeId: number = 0; // Add the Input property
  @Input() selectedCodeType: string = "";

  codeObj: CodeTypeModel = new CodeTypeModel();
  codeDataModel: codeDaum = new codeDaum();
  codeTypeData: any[] = [];
  codeData: any[] = [];
  dataset: any[] = [];
  recode: number = 10;
  searchTerm: string = "";

  columns = [
    {
      field: "name",
      displayName: "Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "enumItem",
      displayName: "Enum Item",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    //   field: "isDefault",
    //   displayName: "Default",
    //   visible: true,
    //   isSwitch: true,
    //   sortable: true,
    //   field: "isActive",
    //   displayName: "Status",
    //   visible: true,
    //   isSwitch: true,
    //   sortable: true
  ];

  orderby: string = "";
  rowData: codeDaum[] = [];
  totalCount: number = 0;
  pageNumber: number = 1;

  @ViewChild("codeModel") public codeModel: ModalDirective | undefined;
  @ViewChild("codeForm", { static: false }) codeForm!: NgForm;

  constructor(
    private codeService: CodeService,
    private toaster: ToasterService
  ) { }

  async ngOnInit() {
    if (this.codeTypeId != 0) {
      this.getCode(this.codeTypeId, this.selectedCodeType);
    }

  }

  orderBy(event: any) {
    this.orderby = event;
    this.getCode(this.codeTypeId, this.selectedCodeType);
  }


  async getCode(id: any, name: any) {
    this.selectedCodeType = name;
    this.codeTypeId = id;
    let params = new HttpParams()
      .set("RecordCount", this.recode)
      .set("PageNumber", this.pageNumber)
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);

    await this.codeService.getCodes(`${AppConstant.CODE}${id}/Codes`, params).subscribe({
      next: (response) => {
        if (response) {
          this.rowData = response.data;
          this.totalCount = response.totalCount;
        }
      }
    });
  }

  addCode() {
    this.codeDataModel = new codeDaum();
    this.codeModel?.show();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.onInsert();
  }

  resetForm() {
    if (this.codeForm) {
      this.codeForm.resetForm();
      this.codeDataModel = {
        id: 0,
        codeTypeId: 0,
        name: "",
        enumItem: "",
        isDefault: true,
        isActive: true,
      };
    }
  }

  async onInsert() {
    if (this.codeDataModel.id == 0) {
      let obj = {
        codeTypeId: this.codeTypeId,
        name: this.codeDataModel.name,
        enumItem: this.codeDataModel.enumItem,
        isDefault: false,
        isActive: true,
      };
      await this.codeService.postCode(obj, `${AppConstant.CODE}`).subscribe({
        next: (response) => {
          if (response) {
            if (response.success == true) {
              this.codeModel?.hide();
              this.toaster.successToaster(response.message, "success",);
              this.totalCount = this.totalCount + 1;
              this.codeDataModel = new codeDaum();
              this.resetForm();
              this.getCode(this.codeTypeId, this.selectedCodeType);
            }
          }
        }
      });
    } else {
      let obj = {
        id: this.codeDataModel.id,
        codeTypeId: this.codeDataModel.codeTypeId,
        name: this.codeDataModel.name,
        enumItem: this.codeDataModel.enumItem,
        isDefault: this.codeDataModel.isDefault,
        isActive: this.codeDataModel.isActive,
      };
      await this.codeService.putCode(obj, `${AppConstant.CODE}${this.codeDataModel.id}`).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.toaster.successToaster(response.message, "success");
            this.codeModel?.hide();
            this.codeDataModel = new codeDaum();
            this.getCode(this.codeTypeId, this.selectedCodeType);
          }
        }
      });
    }
  }

  // Handle edit action
  async onEdit(row: any) {
    this.codeDataModel.codeTypeId = row.codeTypeId;
    this.codeDataModel.enumItem = row.enumItem;
    this.codeDataModel.isActive = row.isActive;
    this.codeDataModel.isDefault = row.isDefault;
    this.codeDataModel.name = row.name;
    this.codeDataModel.id = row.id;
    this.codeModel?.show();
  }

  onDelete(row: any) {
    this.confirmDelete(row);
  }

  confirmDelete(row: any) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.deleteCodes(row);
      } else {
        swal("Cancelled", "Your record is safe :)", "error");
      }
    });
  }

  async deleteCodes(row: any) {

    await this.codeService.deleteCode(`${AppConstant.CODE}${row.id}`).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.rowData = this.rowData.filter((r) => r !== row);
          this.toaster.successToaster(response.message, "Delete ");
          this.totalCount = this.totalCount - 1;
          this.getCode(this.codeTypeId, this.selectedCodeType);
        }
      }
    });
  }

  onSearch(event: any) {
    this.searchTerm = event;
    this.getCode(this.codeTypeId, this.selectedCodeType);
  }

  // Handle switch change event
  onSwitchChange(event: any) {
    let isDefaultUpdate = {
      codeTypeId: event.row.codeTypeId,
      id: event.row.id,
      isDefault: event.row.isDefault,
      isActive: event.row.isActive,
    };

    this.codeService.patchCode(isDefaultUpdate, `${AppConstant.PATCH_UPDATEDEFAULTCODE}`).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.toaster.successToaster(response.message, "success");
          this.getCode(this.codeTypeId, this.selectedCodeType);
        }
      }
    });
  }

  onRecodeValueChange(value: number) {
    this.recode = value;
    this.pageNumber = 1;
    this.getCode(this.codeTypeId, this.selectedCodeType);
  }

  onPageChange(value: number) {
    this.pageNumber = value;
    this.getCode(this.codeTypeId, this.selectedCodeType);
  }
}
