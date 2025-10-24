import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { EmployeeService } from "../../../../../domain/services/employee.service";
import { EmployeePayrollAttribute, PayrollAttribute } from "../../../../../domain/models/employee.model";
import { AppConstant } from "../../../../../common/app-constant";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-payroll-attribute",
  templateUrl: "./payroll-attribute.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrl: "./payroll-attribute.component.scss",
})
export class PayrollAttributeComponent {
  @Input() employeeId: number = 0;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() isFormValid = new EventEmitter<boolean>();
  BasicValue: number = 0;
  employeePayrollAttributeDetils: PayrollAttribute[] = [];
  PayrollAttributeForm!: FormGroup;
  isWageRate: boolean = false;


  constructor(private employeeServices: EmployeeService, private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.employeeId > 0) {
      this.getPayrollAttributeDetails();
    }
  }

  async getPayrollAttributeDetails() {
    if (this.employeeId > 0) {
      await this.employeeServices.getEmployee<EmployeePayrollAttribute>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/PayrollAttribute").subscribe({
        next: (response) => {
          this.employeePayrollAttributeDetils = response.data.attributes;
          this.isWageRate = response.data.isDailyWagesRate;
          this.employeePayrollAttributeDetils.forEach(attribute => {
            attribute.isDisabled = !attribute.allowOverride;
            if (this.isWageRate && attribute.payrollAttributeId === 1) {
              attribute.isDisabled = true;
            }
            if (!this.isWageRate && attribute.payrollAttributeId === 60) {
              attribute.isDisabled = true;
            }
          });
        },
      });
    }
  }

  onCheckBoxChange(event: any): void {
    this.isWageRate = event.checked;
    this.updateDefaultValues();
  }

  updateDefaultValues(): void {
    this.employeePayrollAttributeDetils.forEach(element => {
      if (this.isWageRate) {
        if (element.payrollAttributeId === 1) {
          element.defaultValue = 0;
          element.isDisabled = true;
        }
        if (element.payrollAttributeId === 60) {
          element.isDisabled = false;
        }
      } else {
        if (element.payrollAttributeId === 1) {
          element.isDisabled = false;
        }
        if (element.payrollAttributeId === 60) {
          element.defaultValue = 0;
          element.isDisabled = true;
        }
      }
    });
  }

  getDisabledState(attribute: any): boolean {
    if (attribute.payrollAttributeId === 1) {
      return this.isWageRate;
    }
    if (attribute.payrollAttributeId === 60) {
      return !this.isWageRate;
    }
    return !attribute.allowOverride;
  }

  clickNext() {
    const payload = this.employeePayrollAttributeDetils.map(attribute => {
      return {
        employeeId: this.employeeId, // Adding employeeId to the payload
        projectPayrollAttributeId: attribute.projectPayrollAttributeId,
        payrollAttributeId: attribute.payrollAttributeId,
        isCalculated: attribute.isCalculated,
        value: attribute.defaultValue // Assuming value is the same as defaultValue
      };
    });
    const data = {
      payrollAttributes: payload,
      isDailyWagesRate: this.isWageRate
    }
    this.formSubmit.emit(data);
    this.isFormValid.emit(true);
  }

  onSubmit() {
    if (this.PayrollAttributeForm.valid) {
      // Form is valid
    } else {
      // Form is not valid
    }
  }
}
