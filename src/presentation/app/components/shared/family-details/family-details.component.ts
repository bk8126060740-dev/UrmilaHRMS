import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AddEnudumModel } from '../../../../../domain/models/project.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { EmployeeService } from '../../../../../domain/services/employee.service';
import { FamilyDetails } from '../../../../../domain/models/employee.model';
import { AppConstant } from '../../../../../common/app-constant';
import swal from "sweetalert";
import { ToasterService } from '../../../../../common/toaster-service';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './family-details.component.scss'
})
export class FamilyDetailsComponent implements OnInit {

  @ViewChild("addFamilyDetailsModel", { static: false }) public addFamilyDetailsModel:
    | ModalDirective
    | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  @Input() employeeId: number = 0;

  FamilyDetailsForm!: FormGroup;
  relations: string[] = ['Parent', 'Sibling', 'Spouse', 'Friend', 'Other'];
  familyDetails: FamilyDetails[] = [];
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  constructor(private fb: FormBuilder,
    private employeeServices: EmployeeService,
    private toaster: ToasterService
  ) {
    this.FamilyDetailsForm = this.fb.group({
      id: [''],
      name: ['', Validators.required], // Required name field
      relation: ['', Validators.required], // Required relation field
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Required phone field, must be 10 digits
      age: ['', [Validators.required, Validators.maxLength(2)]]
    });
  }
  ngOnInit(): void {
    if (this.employeeId > 0) {
      this.getFamilyDetails();
    }
  }

  async getFamilyDetails() {
    if (this.employeeId > 0) {

      await this.employeeServices.getEmployee<FamilyDetails[]>(AppConstant.GET_EMPLOYEEBYID + '/' + this.employeeId + '/FamilyDetails').subscribe({
        next: (response) => {
          this.familyDetails = response.data
        }
      })
    }
  }

  validateNumberInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 3 && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  addFamilyDetails() {
    this.formDirective.resetForm();
    this.addFamilyDetailsModel?.show();
  }

  closeFamilyDetails() {
    this.formDirective.resetForm();
    this.addFamilyDetailsModel?.hide();

  }
  async onSubmit() {
    if (this.FamilyDetailsForm.valid) {
      // Handle form submission logic here
      let data = this.FamilyDetailsForm.value;
      let formData = new FormData();
      formData.append('EmployeeId', this.employeeId.toString());
      formData.append('Name', data.name);
      formData.append('Relation', data.relation);
      formData.append('MobileNumber', data.phone);
      formData.append('Age', data.age);

      if (data.id == 0 || data.id == null) {
        await this.employeeServices.postEmployee<FamilyDetails>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/FamilyDetail", formData).subscribe({
          next: (response) => {
            if (response.status == 200 && response.status) {
              this.toaster.successToaster(response.message);
              this.closeFamilyDetails();
              this.FamilyDetailsForm.reset();
              this.getFamilyDetails();
            } else {
              this.toaster.errorToaster(response.message);
            }
          }
        })
      } else {
        formData.append('EmployeeId', this.employeeId.toString());
        formData.append('Id', data.id);
        await this.employeeServices.putEmployee<FamilyDetails>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/FamilyDetail/" + data.id, formData).subscribe({
          next: (response) => {
            if (response.status == 200 && response.status) {
              this.toaster.successToaster(response.message);
              this.closeFamilyDetails();
              this.FamilyDetailsForm.reset();
              this.getFamilyDetails();
            } else {
              this.toaster.errorToaster(response.message);
            }
          }
        })
      }
    }
  }

  editInfos(item: FamilyDetails) {
    this.FamilyDetailsForm.patchValue({
      id: item.id,
      name: item.name,
      relation: item.relation,
      phone: item.mobileNumber,
      age: item.age
    });
    this.addFamilyDetailsModel?.show();
  }
  deleteInfos(item: FamilyDetails) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete: any) => {
      if (willDelete) {
        this.employeeServices.deleteEmployee<FamilyDetails>(AppConstant.GET_EMPLOYEEBYID + "/FamilyDetail/" + item.id).subscribe({
          next: (response) => {
            if (response.success && response.status === 200) {
              this.toaster.successToaster(response.message);
              this.getFamilyDetails();
            } else {
              this.toaster.warningToaster(response.message);
            }
          }
        });
      } else {
        return;
      }
    });
  }
}




