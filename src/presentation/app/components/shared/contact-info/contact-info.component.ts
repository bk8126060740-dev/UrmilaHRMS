import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AddEnudumModel } from '../../../../../domain/models/project.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { EmployeeService } from '../../../../../domain/services/employee.service';
import { ContactInfos } from '../../../../../domain/models/employee.model';
import { AppConstant } from '../../../../../common/app-constant';
import swal from "sweetalert";
import { ToasterService } from '../../../../../common/toaster-service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent implements OnInit {

  @ViewChild("addContactInfoModel", { static: false }) public addContactInfoModel:
    | ModalDirective
    | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  @Input() employeeId: number = 0;

  emergencyContactForm!: FormGroup;
  relations: string[] = ['Parent', 'Sibling', 'Spouse', 'Friend', 'Other'];
  contactInfos: ContactInfos[] = [];
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  constructor(private fb: FormBuilder,
    private employeeServices: EmployeeService,
    private toaster: ToasterService
  ) {
    this.emergencyContactForm = this.fb.group({
      id: [''],
      name: ['', Validators.required], 
      relation: ['', Validators.required], 
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]] 
    });
  }
  ngOnInit(): void {
    if (this.employeeId > 0) {
      this.getContactInfo();
    }
  }

  async getContactInfo() {
    if (this.employeeId > 0) {

      await this.employeeServices.getEmployee<ContactInfos[]>(AppConstant.GET_EMPLOYEEBYID + '/' + this.employeeId + '/ContactInfos').subscribe({
        next: (response) => {
          this.contactInfos = response.data
        }
      })
    }
  }

  addContactInfo() {
    this.formDirective.resetForm();
    this.addContactInfoModel?.show();
  }

  closeContactInfo() {
    this.formDirective.resetForm();
    this.addContactInfoModel?.hide();

  }
  async onSubmit() {
    if (this.emergencyContactForm.valid) {
        
      let data = this.emergencyContactForm.value;
      let formData = new FormData();
      formData.append('EmployeeId', this.employeeId.toString());
      formData.append('EmergencyContactName', data.name);
      formData.append('EmergencyContactRelation', data.relation);
      formData.append('EmergencyContactPhone', data.phone);

      if (data.id == 0 || data.id == null) {
        await this.employeeServices.postEmployee<ContactInfos>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/ContactInfo", formData).subscribe({
          next: (response) => {
            if (response.status == 200 && response.status) {
              this.toaster.successToaster(response.message);
              this.closeContactInfo();
              this.emergencyContactForm.reset();
              this.getContactInfo();
            } else {
              this.toaster.errorToaster(response.message);
            }
          }
        })
      } else {
        formData.append('EmployeeId', this.employeeId.toString());
        formData.append('Id', data.id);
        await this.employeeServices.putEmployee<ContactInfos>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/ContactInfo/" + data.id, formData).subscribe({
          next: (response) => {
            if (response.status == 200 && response.status) {
              this.toaster.successToaster(response.message);
              this.closeContactInfo();
              this.emergencyContactForm.reset();
              this.getContactInfo();
            } else {
              this.toaster.errorToaster(response.message);
            }
          }
        })
      }
    }
  }

  editInfos(item: ContactInfos) {
    this.emergencyContactForm.patchValue({
      id: item.id,
      name: item.emergencyContactName,
      relation: item.emergencyContactRelation,
      phone: item.emergencyContactPhone,
    });
    this.addContactInfoModel?.show();
  }
  deleteInfos(item: ContactInfos) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete: any) => {
      if (willDelete) {
        this.employeeServices.deleteEmployee<ContactInfos>(AppConstant.GET_EMPLOYEEBYID + "/ContactInfo/" + item.id).subscribe({
          next: (response) => {
            if (response.success && response.status === 200) {
              this.toaster.successToaster(response.message);
              this.getContactInfo();
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




