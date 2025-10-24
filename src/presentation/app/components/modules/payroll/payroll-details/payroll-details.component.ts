import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppConstant } from '../../../../../../common/app-constant';
import { PayrollService } from '../../../../../../domain/services/payroll.service';
import { PayrollAttribute, PayrollData, PayrollEmployeeSummary, PayrollModel, PayrollValue } from '../../../../../../domain/models/payroll.model';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import swal from "sweetalert";
import { ExportService } from '../../../../../../domain/services/export.service';
import { ProjectService } from '../../../../../../domain/services/project.service';
import { ProjectDaum } from '../../../../../../domain/models/project.model';

@Component({
  selector: 'app-payroll-details',
  templateUrl: './payroll-details.component.html',
  styleUrl: './payroll-details.component.scss'
})

export class PayrollDetailsComponent {
  payrollData: PayrollData = new PayrollData();
  payrollEmployeeSummaryData: PayrollModel = new PayrollModel();
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  pageNumber: number = 1;
  recode: number = 10;
  totalCount: number = 0;
  recodeCount: number = 10;
  currentPage: number = 0;
  startItem: number = 0;
  endItem: number = this.recodeCount;
  selectedEmployeeIds: number[] = [];
  dropdownSubscription: any;
  isCheckboxChecked: boolean = false;

  constructor(private payrollService: PayrollService,
    private headerDropdownService: HeaderDropdownService,
    private toster: ToasterService,
    private route: Router,
    private localStorageService: LocalStorageService,
    private exportService: ExportService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {
        this.route.navigate(['/payroll/dashboard'])
      }
    });
    const navigationState = history.state;
    if (navigationState) {
      this.payrollEmployeeSummaryData = navigationState.payrollEmployeeSummaryData;
    }
    this.getAllPayrollEmployeeSummary();
  }

  toggleCheckbox() {
    this.isCheckboxChecked = this.payrollData.data.some(summary => summary.isSelected);
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }
  onRecodeChange() {
    this.recode = this.recodeCount;
    this.getAllPayrollEmployeeSummary();
  }

  async regenratePayroll() {
    if (this.selectedEmployeeIds.length > 0) {
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this record!",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          let obj = {
            "payrollId": this.payrollEmployeeSummaryData.id,
            "employeeIds": this.selectedEmployeeIds
          }
          await this.payrollService.postPayroll<PayrollData>(obj, AppConstant.PAYROLL + "/RecountEmployeeSummary").subscribe({
            next: (response) => {
              this.toster.successToaster(response.message);
              this.getAllPayrollEmployeeSummary();
              this.selectedEmployeeIds = [];
            }
          })
        }
      });
    }
    else {
      this.toster.warningToaster('Please select the payroll employee.');
    }
  }

  StatusChangeofPayroll(type: number) {
    let StatusId = type === 1 ? AppConstant.PAYROLL_APPROVE : AppConstant.PAYROLL_REJECT;
    let statusMessage = type === 1 ? "Approved" : "Rejected";
    let obj = {
      id: this.payrollEmployeeSummaryData.id,
      status: StatusId,
    }
    swal({
      title: "Are you sure?",
      text: `Do you want to ${statusMessage.toLowerCase()} this payroll?`,
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willProceed) => {
      if (willProceed) {
        this.payrollService.putPayroll(obj, `${AppConstant.PAYROLL}/${obj.id}`).subscribe({
          next: (response: any) => {
            if (response && response.success) {
              this.toster.successToaster(response.message);
              this.selectedEmployeeIds = [];
              this.route.navigate(['/payroll/dashboard']);
            }
          },
        });
      }
    });
  }

  async deleteRecorde() {
    if (this.selectedEmployeeIds.length > 0) {
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this record!",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await this.payrollService.deletePayroll<PayrollData>(AppConstant.PAYROLL + "/PayrollEmployeeSummaryDelete", obj).subscribe({
            next: (response) => {
              this.toster.successToaster(response.message);
              this.getAllPayrollEmployeeSummary();
              this.payrollData.data.forEach((item) => {
                item.isSelected = false; // Set the key to false
              });
              this.selectedEmployeeIds = [];
            }
          })
        }
      });
      let obj = {
        "payrollId": this.payrollEmployeeSummaryData.id,
        "employeeIds": this.selectedEmployeeIds
      }
    }
    else {
      this.toster.warningToaster('Please select the payroll employee.');
    }
  }

  groupedArray: GroupedData[] = [];
  setSequence: { groupId: number; id: number; sequence: number }[] = [];

  onEmployeeSelectionChange(summary: PayrollEmployeeSummary) {
    if (summary.isSelected) {
      // Add selected employee ID to the array
      this.selectedEmployeeIds.push(summary.employeeId);
    } else {
      // Remove unselected employee ID from the array
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter(id => id !== summary.employeeId);
    }
  }

  getAllPayrollEmployeeSummary(): void {
    const params = new HttpParams()
      .set('PayrollId', this.payrollEmployeeSummaryData.id.toString())
      .set('RecordCount', this.recode.toString())
      .set('PageNumber', this.pageNumber.toString())
      .set('FilterBy', this.searchTerm)
      .set('OrderBy', this.orderby)

    this.payrollService.getPayrollAllData<PayrollData[]>(AppConstant.GET_ALL_PAYROLLEMPLOYEESUMMARY, params).subscribe({
      next: (response: any) => {
        if (response) {
          this.payrollData = response;
          this.totalCount = response.totalCount;
          this.groupedArray = Object.values(
            this.payrollData.payrollAttributes.reduce((groups: Record<string, GroupedData>, item) => {
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
            group.items.sort((a, b) => a.sequenceId - b.sequenceId);
            return group;
          });
          console.log(this.groupedArray);
        }
      },
    });
  }

  pageChanged(event: any) {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = this.totalCount < event.page * event.itemsPerPage ? this.totalCount : event.page * event.itemsPerPage;
    this.pageNumber = event.page;
    this.getAllPayrollEmployeeSummary();
  }

  exportData(event: PayrollModel) {
    let params = new HttpParams()
      .set('PayrollId', this.payrollEmployeeSummaryData.id);
    this.exportService.get(AppConstant.GET_EXPORT_PAYROLL, params).subscribe({
      next: async (response: Blob) => {
        await this.payrollService.getPayrollAllData<ProjectDaum>(AppConstant.GET_PROJECT + '/' + event.projectId, params).subscribe({
          next: (childresponse) => {
            if (childresponse) {
              this.downloadFile(response, event, childresponse.data.name);
            }
          },
        });
      },
      error: (error) => { },
    });
  }

  downloadFile(blob: Blob, event: PayrollModel, projectName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = projectName.toUpperCase() + "_" + event.monthName.slice(0, 3) + "_" + event.year + "_" + event.statusName + "_Payroll.xlsx"; // Specify the default file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

}

interface GroupedData {
  groupId: number | null;
  groupName: string;
  items: PayrollAttribute[];
}
