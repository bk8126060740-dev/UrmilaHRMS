import { HttpParams } from "@angular/common/http";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { payrollAttributeService } from "../../../../../../domain/services/payrollAttribute.service";
import { AppConstant } from "../../../../../../common/app-constant";

import swal from "sweetalert";
import { PayrollAttributeDaum } from "../../../../../../domain/models/payrollAttribute.model";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ProjectPayrollAttributeDaum } from "../../../../../../domain/models/projectPayrollAttribute.model";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { GrantPermissionService } from "../../../../../../domain/services/permission/is-granted.service";
import { ToasterService } from "../../../../../../common/toaster-service";
import { CodeService } from "../../../../../../domain/services/code.service";
import { Code } from "../../../../../../domain/models/project.model";
import { sequence } from "@angular/animations";

@Component({
  selector: "app-payroll-attribute",
  templateUrl: "./payroll-attribute.component.html",
  styleUrl: "./payroll-attribute.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class PayrollAttributeComponent implements OnInit {
  @ViewChild("ngattributeForm", { static: false }) ngattributeForm!: NgForm;
  totalCount: number = 0;
  pageNumber: number = 1;
  attributePerPage: number = 10;
  searchTerm: string = "";
  rowData: PayrollAttributeDaum[] = [];
  payrollAttributeModel: PayrollAttributeDaum = new PayrollAttributeDaum();
  payrollAttributeForm!: FormGroup;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  columns = [
    {
      field: "name",
      displayName: "Name",
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: "isActive",
      displayName: "Active",
      isSwitch: false,
      visible: true,
      isCheckbox: true,
    },
    {
      field: "isAttendance",
      displayName: "Attendance",
      isSwitch: false,
      visible: true,
      isCheckbox: true,
    },
    {
      field: "isCalculated",
      displayName: "Calculated",
      isSwitch: false,
      visible: true,
      isCheckbox: true,
    },
    {
      field: "isDeductable",
      displayName: "Deductible",
      isSwitch: false,
      visible: true,
      isCheckbox: true,
    },
    {
      field: "isPercentage",
      displayName: "Percentage",
      isSwitch: false,
      visible: true,
      isCheckbox: true,
    },
    {
      field: "isTotal",
      displayName: "Total",
      isSwitch: false,
      visible: true,
      isCheckbox: true,
    },
  ];
  orderby: string = "";

  @ViewChild("attributemodel") public attributemodel:
    | ModalDirective
    | undefined;

  constructor(
    private payrollAttributeService: payrollAttributeService,
    private toaster: ToasterService,
    private grantPermissionService: GrantPermissionService,
    private codeService: CodeService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.payrollAttributeForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      groupId: [null, [Validators.required]],
      isDeductable: [false],
      isPercentage: [true],
      isCalculated: [false],
      isAttendance: [false],
      isTotal: [false],
      sequence: [0]
    });

    this.getPayrollAtrribute();
  }

  groupedArray: GroupedData[] = [];
  setSequence: { groupId: number; id: number; sequence: number }[] = [];


  async getPayrollAtrribute() {
    await this.payrollAttributeService.getPayrollAttribute(`${AppConstant.GET_PAYROLL_ATTRIBUTE}`).subscribe({
      next: (responce) => {
        if (responce) {
          this.rowData = responce.data;
          this.totalCount = responce.totalCount;
          this.groupedArray = Object.values(
            this.rowData.reduce((groups: Record<string, GroupedData>, item) => {
              const groupKey = item.groupId !== null ? item.groupId.toString() : "null"; // Use string keys for grouping

              // Initialize the group if it doesn't exist
              if (!groups[groupKey]) {
                groups[groupKey] = {
                  groupId: item.groupId,
                  groupName: item.groupName,
                  items: []
                };
              }

              // Push the current item to the group
              groups[groupKey].items.push(item);

              return groups;
            }, {})
          ).map(group => {
            // Sort items by sequence within each group
            group.items.sort((a, b) => a.sequence - b.sequence);
            return group;
          });


          this.totalCount = responce.totalCount;
        }
      }
    });
  }

  //       .filter(group => group.groupId !== null) // Filter out null groupId
  //       .map((group, index) => ({
  //         groupId: group.groupId as number, // Ensure groupId is a number
  //         id: group.id || 0, // Use a default value for id if not present
  //         sequence: index + 1

  //       setSequence: this.setSequence

  //// TP - Changes Sequence wise update data
  drop(event: CdkDragDrop<string[]>, item: any, i: any) {
    let access;
    this.grantPermissionService.hasPermission("Update").subscribe({
      next: (response) => {
        access = response;

        if (access) {
          moveItemInArray(item, event.previousIndex, event.currentIndex);
          this.groupedArray[i].items.forEach((group, index) => {
            if (group.groupId !== null) {
              group.sequence = index + 1;
            }
          });

          // Prepare sequence data
          this.setSequence = this.groupedArray[i].items
            .filter(group => group.groupId !== null)
            .map((group, index) => ({
              groupId: group.groupId as number,
              id: group.id || 0,
              sequence: index + 1
            }));



          let obj = {
            setSequence: this.setSequence
          };
          this.payrollAttributeService.postPayrollAttribute(obj, AppConstant.POST_PAYROLL_ATTRIBUTE).subscribe({
            next: (response) => {
              if (response.success) {
                this.toaster.successToaster(response.message);
              } else {
                this.toaster.warningToaster(response.message);
              }
            }
          });
        } else {
          this.toaster.warningToaster(AppConstant.NOTPERMISSION);
        }
      }
    });
  }

  addPayrollAttribute() {
    this.payrollAttributeModel = new PayrollAttributeDaum();
    this.attributemodel?.show();
    this.ngattributeForm.resetForm();
    this.getGroupList();
  }

  groupList: Code[] = [];
  async getGroupList() {
    let obj = { codeTypeIds: AppConstant.GET_GROUP };
    await this.codeService.getAllCodesByCodeTypesDropdownData(obj, AppConstant.GET_ALLCODESBYCODETYPES).subscribe({
      next: (response) => {
        if (response.success && response.status === 200) {
          this.groupList = response.data[0].codes;
        } else {
          this.groupList = [];
        }
      }
    })
  }

  onSubmit() {
    // // if (form.invalid) {
    // //   Object.keys(form.controls).forEach((field) => {
    // //     const control = form.control.get(field);
    // //     control?.markAsTouched({ onlySelf: true });
    // //   });
    // //   return;
    // // }

    //
    if (this.payrollAttributeForm.valid) {
      this.saveattribute();
      // Perform your save or update logic here
    } else {
      console.error('Form is invalid');
    }
  }

  async saveattribute() {
    //
    let data = this.payrollAttributeForm.value;
    let obj = {
      id: 0,
      name: data.name,
      isDeductable: data.isDeductable == null ? false : data.isDeductable,
      isPercentage: data.isPercentage == null ? false : data.isPercentage,
      isCalculated: data.isCalculated == null ? false : data.isCalculated,
      isAttendance: data.isAttendance == null ? false : data.isAttendance,
      isTotal: data.isTotal == null ? false : data.isTotal,
      groupId: data.groupId,
      isActive: true,
      sequence: data.sequence === null ? 0 : data.sequence
    };
    if (data.id == 0 || data.id === null) {
      await this.payrollAttributeService.postPayrollAttribute(obj, `${AppConstant.POST_PAYROLL}`).subscribe({
        next: (responce) => {
          if (responce) {
            if (responce.success == true) {
              this.toaster.successToaster(responce.message);
              this.attributemodel?.hide();
              this.getPayrollAtrribute();
            }
          }
        }
      });
    } else {
      obj.id = data.id;
      obj.sequence = data.sequence;
      let params = new HttpParams().set("id", data.id);
      await this.payrollAttributeService.putPayrollAttribute(obj, `${AppConstant.PUT_PAYROLL}${data.id}`, params).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.toaster.successToaster(response.message);
            this.attributemodel?.hide();
            this.getPayrollAtrribute();
            this.ngattributeForm.resetForm();
          }
        },
        error: (error) => {
        }
      });
    }
    this.payrollAttributeModel = new PayrollAttributeDaum();
    this.getPayrollAtrribute();
  }

  onEditClicked(event: any) {
    this.getGroupList();
    this.attributemodel?.show();

    this.payrollAttributeForm.patchValue({
      id: event.id,
      name: event.name,
      groupId: event.groupId,
      isDeductable: event.isDeductable,
      isPercentage: event.isPercentage,
      isCalculated: event.isCalculated,
      isAttendance: event.isAttendance,
      isTotal: event.isTotal,
      sequence: event.sequence
    })
  }

  onEdit(event?: any) {
    this.payrollAttributeModel = event;
    let params = new HttpParams().set("id", this.payrollAttributeModel.id);
    this.payrollAttributeService.putPayrollAttribute(this.payrollAttributeModel, `${AppConstant.POST_PAYROLL}${this.payrollAttributeModel.id}`, params).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
        }
      }
    });
  }

  onSwitchChange(event: { row: any; switchType: string; value: any }) {
    swal({
      title: "Are you sure?",
      text: "You wanted to change data!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let obj = {
          id: event.row.id,
          isActive: event.switchType == 'isActive' ? event.value : event.row.isActive,
          isAttendance: event.switchType == 'isAttendance' ? event.value : event.row.isAttendance,
          isCalculated: event.switchType == 'isCalculated' ? event.value : event.row.isCalculated,
          isDeductable: event.switchType == 'isDeductable' ? event.value : event.row.isDeductable,
          isPercentage: event.switchType == 'isPercentage' ? event.value : event.row.isPercentage,
          isTotal: event.switchType == 'isTotal' ? event.value : event.row.isTotal,
          groupId: event.row.Id,
          sequence: event.row.sequence,
          name: event.row.name,
        };
        this.onEdit(obj);
      } else {
        this.getPayrollAtrribute();
      }
    });
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
        this.deletePayrollAttribute(event);
      } else {
        return;
      }
    });
  }

  async deletePayrollAttribute(event: any) {
    let params = new HttpParams().set("id", event.id);
    await this.payrollAttributeService.deletePayrollAttribute(`${AppConstant.DELETE_PAYROLL}${event.id}`, params).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.rowData = this.rowData.filter((r) => r !== event);
          this.toaster.successToaster(response.message);
          this.totalCount = this.totalCount - 1;
          this.getPayrollAtrribute();
        }
      }
    });
  }
}


interface GroupedData {
  groupId: number | null;
  groupName: string;
  items: PayrollAttributeDaum[];
}
