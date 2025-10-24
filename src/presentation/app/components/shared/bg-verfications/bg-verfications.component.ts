import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { EmployeeService } from '../../../../../domain/services/employee.service';
import { Agency, BGVerification } from '../../../../../domain/models/employee.model';
import { AppConstant } from '../../../../../common/app-constant';
import { CodeService } from '../../../../../domain/services/code.service';
import { Code } from '../../../../../domain/models/project.model';
import { DesignationMasterService } from '../../../../../domain/services/designation-master.service';

@Component({
  selector: 'app-bg-verfications',
  templateUrl: './bg-verfications.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './bg-verfications.component.scss'
})

export class BgVerficationsComponent implements OnInit {

  allAgency: Agency[] = [];
  verificationList: Code[] = [];
  bgVerification: BGVerification[] = [];
  bgVerificationGetData: BGVerification[] = [];

  @Input() employeeId: number = 0;
  @Output() bgVerificationData = new EventEmitter<any>();

  constructor(private employeeService: EmployeeService,
    private codeService: CodeService,
    private designationMasterService: DesignationMasterService
  ) {

  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeId']) {
      await this.getVerificationType();
      await this.getAllAgency();
      await this.getData();
    }
  }
  async ngOnInit() {
    await this.getVerificationType();
    await this.getAllAgency();
    await this.getData();
  }
  async getData() {
    await this.employeeService.getEmployee<BGVerification[]>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/BGVerification").subscribe({
      next: (response) => {
        this.bgVerificationGetData = response.data;

        // Loop through bgVerification and update fields based on matching agencyId in bgVerificationGetData
        this.bgVerification.forEach((verification) => {
          // Log the values for debugging

          let matchingData = this.bgVerificationGetData.find((data) => {
            return data.verificationTypeId == verification.verificationTypeId; // Use == to allow type coercion
          });

          if (matchingData) {
            // Update the matching bgVerification fields with the values from bgVerificationGetData
            verification.id = matchingData.id;
            verification.employeeId = matchingData.employeeId;
            verification.verificationTypeId = matchingData.verificationTypeId;
            verification.agencyId = matchingData.agencyId;
            verification.agencyName = matchingData.agencyName;
            verification.verificationStatus = matchingData.verificationStatus;
            verification.verificationDate = matchingData.verificationDate;
            verification.remarks = matchingData.remarks;
            verification.visibility = true; // Optional, can adjust based on your logic
          }
        });

      }
    })
  }
  async getVerificationType() {
    let obj = { codeTypeIds: AppConstant.GETVERIFICATIONTYPE };
    await this.codeService.getAllCodesByCodeTypesDropdownData(obj, AppConstant.GET_ALLCODESBYCODETYPES).subscribe({
      next: (response) => {
        this.bgVerification = [];
        this.verificationList = response.data[0].codes;
        this.verificationList.forEach(element => {
          this.bgVerification.push({
            id: 0,
            agencyId: 0,
            employeeId: this.employeeId,
            verificationTypeId: element.id,
            verificationType: element.name,
            agencyName: '',
            verificationStatus: '',
            verificationDate: '',
            remarks: '',
            visibility: false
          })
        });
      }
    })
  }


  async getAllAgency() {
    await this.employeeService.getEmployee<Agency[]>(AppConstant.GET_ALL_AGENCY).subscribe({
      next: (response) => {
        this.allAgency = response.data;
      }
    })
  }

  clickNext() {
    this.bgVerification.forEach(element => {
      element.agencyId = element.agencyId
      element.employeeId = element.employeeId
      element.verificationTypeId = element.verificationTypeId
      element.verificationType = element.verificationType
      element.agencyName = element.agencyName
      element.verificationStatus = element.visibility ? 'Yes' : 'No'
      element.verificationDate = element.verificationDate
      element.remarks = element.remarks
      element.visibility = element.visibility
    });
    this.bgVerificationData.emit(this.bgVerification);
  }
}
