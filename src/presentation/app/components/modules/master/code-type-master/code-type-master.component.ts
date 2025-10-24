import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodeTypeService } from '../../../../../../domain/services/codeType.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { Daum } from '../../../../../../domain/models/codeType.model';
import { codeDaum } from '../../../../../../domain/models/code.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import swal from "sweetalert";
import { GlobalConfiguration } from '../../../../../../common/global-configration'
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-code-type-master',
  templateUrl: './code-type-master.component.html',
  styleUrls: ['./code-type-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CodeTypeMasterComponent implements OnInit {
  @ViewChild("codeTypeForm", { static: false }) codeTypeForm!: NgForm;
  @ViewChild("codemodel") public codeModel: ModalDirective | undefined;
  codeTypeData: any[] = [];
  rowData: Daum[] = [];
  data: any;
  totalCount: number = 0;
  pageNumber: number = 1;
  codeTypePerPage: number = 10;
  searchTerm: string = "";
  codeTypeDataModel: codeDaum = new codeDaum();
  gridTitle: string = "Code Type"

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
      field: "enumName",
      displayName: "Enum Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    }
  ];

  orderby: string = "";

  constructor(private codeTypeService: CodeTypeService, private toaster: ToastrService) { }

  ngOnInit() {
    this.getCodeType();
  }

  orderBy(event: any) {
    this.orderby = event;
    this.getCodeType();
  }
  async getCodeType() {
    let params = new HttpParams()
      .set("PageNumber", this.pageNumber)
      .set("RecordCount", this.codeTypePerPage)
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);

    (
      await this.codeTypeService.getCodeType(`${AppConstant.GET_CODETYPE}`, params)
    ).subscribe(
      (responce) => {
        if (responce) {
          GlobalConfiguration.consoleLog("Code-Type-Master Component: ", 'Get Code Type Response : ', responce);
          this.rowData = responce.data;
          this.totalCount = responce.totalCount;
        }
      },
      (error) => {
        GlobalConfiguration.consoleLog("Code-Type-Master Component:", "Get Code Type Error", error);
      }
    );
  }

  addCodeType() {
    this.codeTypeForm.reset();
    this.codeModel?.show();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.onInsert();
  }

  async onInsert() {
    let obj = {
      id: this.codeTypeDataModel.id,
      name: this.codeTypeDataModel.name,
      enumName: this.codeTypeDataModel.enumItem
    };

    if (this.codeTypeDataModel.id == 0) {
      (
        await this.codeTypeService.postCodeType(obj, `${AppConstant.POST_CODETYPE}`)
      ).subscribe(
        (responce) => {
          if (responce) {
            if (responce.success == true) {
              this.closeModel()
              this.toaster.success("success", responce.message);
              this.totalCount = this.totalCount + 1;
              this.getCodeType();
            }
          }
        },
        (error) => {
          this.toaster.error("error", error);
        }
      );
    } else {
      obj.id = this.codeTypeDataModel.id;
      (
        await this.codeTypeService.putCodeType(obj, `${AppConstant.PUT_CODETYPE}${this.codeTypeDataModel.id}`)
      ).subscribe(
        (response) => {
          if (response && response.success) {
            this.toaster.success("success", response.message);
            this.codeModel?.hide();
            this.getCodeType();
          }
        },
        (error) => {
          this.toaster.error("Error", error);
        }
      );
    }
  }

  onEdit(row: any) {
    this.codeTypeDataModel.enumItem = row.enumName;
    this.codeTypeDataModel.name = row.name;
    this.codeTypeDataModel.id = row.id;
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
        this.deleteCodesType(row);
      } else {
        swal("Cancelled", "Your record is safe :)", "error");
      }
    });
  }

  async deleteCodesType(row: any) {
    let params = new HttpParams().set("id", row.id);
    (
      await this.codeTypeService.deleteCodeType(
        `${AppConstant.DELETE_CODETYPE}${row.id}`, params
      )
    ).subscribe(
      (response) => {
        if (response && response.success) {
          GlobalConfiguration.consoleLog("Code Type Master Component : ", "Delete Response :", response);
          this.rowData = this.rowData.filter((r) => r !== row);
          this.toaster.success("Delete ", response.message);
          this.totalCount = this.totalCount - 1;
        }
      },
      (error) => {
        GlobalConfiguration.consoleLog("Error:", "error:", error);
      }
    );
  }

  closeModel() {
    if (this.codeTypeDataModel) {
      this.codeTypeForm.resetForm();
      this.codeTypeDataModel = {
        id: 0,
        codeTypeId: 0,
        enumItem: "",
        isDefault: true,
        isActive: true
      }
    }
    this.codeModel?.hide();
  }

  onTotalCodetypePerPageChange(codeTypePerPage: number) {
    this.codeTypePerPage = codeTypePerPage;
    this.pageNumber = 1;
    this.getCodeType()
  }

  onPageChange(selectedPage: any) {
    this.pageNumber = selectedPage;
    this.getCodeType();
  }

  onSearch(search: string) {
    this.searchTerm = search;
    this.getCodeType();
  }


}
