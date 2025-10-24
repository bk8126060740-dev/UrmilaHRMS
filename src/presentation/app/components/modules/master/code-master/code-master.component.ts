import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { CodeTypeModel } from "../../../../../../domain/models/codeType.model";
import { AppConstant } from "../../../../../../common/app-constant";
import { ModalDirective } from "ngx-bootstrap/modal";
import swal from "sweetalert";
import { CodeTypeService } from "../../../../../../domain/services/codeType.service";
import { CodeService } from "../../../../../../domain/services/code.service";
import {
  codeDaum,
} from "../../../../../../domain/models/code.model";
import { HttpParams } from "@angular/common/http";
import { GlobalConfiguration } from "../../../../../../common/global-configration";
import { NgForm } from "@angular/forms";
import { ToasterService } from "../../../../../../common/toaster-service";

@Component({
  selector: "app-code-master-component",
  templateUrl: "./code-master.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrl: "./code-master.component.scss",
})
export class CodeMasterComponent {
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
    {
      field: "isDefault",
      displayName: "Default",
      visible: true,
      isSwitch: true,
      sortable: true,
    },
    {
      field: "isActive",
      displayName: "Status",
      visible: true,
      isSwitch: true,
      sortable: true
    },
  ];

  orderby: string = "";
  rowData: codeDaum[] = [];
  selectedCodeType: string = "";
  selectedCodeTypeId: number = 0;
  totalCount: number = 0;
  pageNumber: number = 1;

  @ViewChild("codemodel") public codeModel: ModalDirective | undefined;
  @ViewChild("codeForm", { static: false }) codeForm!: NgForm;

  constructor(
    private codeTypeService: CodeTypeService,
    private codeService: CodeService,
    private toaster: ToasterService
  ) { }

  async ngOnInit() {
    this.getCodeType();
  }

  orderBy(event: any) {
    this.orderby = event;
    this.getCode(this.selectedCodeTypeId, this.selectedCodeType);
  }
  async getCodeType() {
    (
      await this.codeTypeService.getCodeType(`${AppConstant.GET_CODETYPE}`)
    ).subscribe({
      next: (responce) => {
        if (responce) {
          GlobalConfiguration.consoleLog(
            "Code Master",
            "Get Code Response ",
            responce
          );
          this.codeTypeData = responce.data;
          this.getCode(responce.data[0].id, responce.data[0].name);
        }
      },
      error: (error) => {
        this.toaster.errorToaster(error, "Error");
      }
    });
  }

  async getCode(id: any, name: any) {
    this.selectedCodeType = name;
    this.selectedCodeTypeId = id;
    let params = new HttpParams()
      .set("RecordCount", this.recode)
      .set("PageNumber", this.pageNumber)
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);

    (
      await this.codeService.getCodes(
        `${AppConstant.CODE}${id}/Codes`,
        params
      )
    ).subscribe({
      next: (responce) => {
        if (responce) {
          GlobalConfiguration.consoleLog(
            "Code Master",
            "Get Code Response ",
            responce
          );
          this.rowData = responce.data;
          this.totalCount = responce.totalCount;
        }
      },
      error: (error) => {
        GlobalConfiguration.consoleLog("Code Master", "Get Code error ", error);
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
        codeTypeId: this.selectedCodeTypeId,
        name: this.codeDataModel.name,
        enumItem: this.codeDataModel.enumItem,
        isDefault: false,
        isActive: true,
      };
      (
        await this.codeService.postCode(obj, `${AppConstant.CODE}`)
      ).subscribe({
        next: (responce) => {
          if (responce) {
            if (responce.success == true) {
              this.codeModel?.hide();
              this.toaster.successToaster(responce.message, "success",);
              this.totalCount = this.totalCount + 1;
              this.codeDataModel = new codeDaum();
              this.resetForm();
              this.getCode(this.selectedCodeTypeId, this.selectedCodeType);
            }
          }
        },
        error: (error) => {
          this.toaster.errorToaster(error, "error");
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
      (
        await this.codeService.putCode(
          obj,
          `${AppConstant.CODE}${this.codeDataModel.id}`
        )
      ).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.toaster.successToaster(response.message, "success");
            this.codeModel?.hide();
            this.codeDataModel = new codeDaum();
            this.getCode(this.selectedCodeTypeId, this.selectedCodeType);
          }
        },
        error: (error) => {
          this.toaster.errorToaster(error, "Error",);
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
    (
      await this.codeService.deleteCode(`${AppConstant.CODE}${row.id}`)
    ).subscribe({
      next: (response) => {
        if (response && response.success) {
          GlobalConfiguration.consoleLog(
            "Code Master",
            "Delete Code Response ",
            response
          );
          this.rowData = this.rowData.filter((r) => r !== row);
          this.toaster.successToaster(response.message, "Delete ");
          this.totalCount = this.totalCount - 1;
          this.getCode(this.selectedCodeTypeId, this.selectedCodeType);
        }
      },
      error: (error) => {
        GlobalConfiguration.consoleLog(
          "Code Master",
          "Delete Code error ",
          error
        );
      }
    });
  }



  onSearch(event: any) {
    this.searchTerm = event;
    this.getCode(this.selectedCodeTypeId, this.selectedCodeType);
  }

  // Handle switch change event
  onSwitchChange(event: any) {
    let isDefaultUpdate = {
      codeTypeId: event.row.codeTypeId,
      id: event.row.id,
      isDefault: event.row.isDefault,
      isActive: event.row.isActive,
    };

    this.codeService
      .patchCode(isDefaultUpdate, `${AppConstant.PATCH_UPDATEDEFAULTCODE}`)
      .subscribe({
        next: (response) => {
          if (response && response.success) {
            this.toaster.successToaster(response.message, "success");
            this.getCode(this.selectedCodeTypeId, this.selectedCodeType);
          }
        },
        error: (error) => {
          this.toaster.errorToaster(error, "Error");
        }
      });
  }

  onRecodeValueChange(value: number) {
    this.recode = value;
    this.pageNumber = 1;
    this.getCode(this.selectedCodeTypeId, this.selectedCodeType);
  }

  onPageChange(value: number) {
    this.pageNumber = value;
    this.getCode(this.selectedCodeTypeId, this.selectedCodeType);
  }
}
