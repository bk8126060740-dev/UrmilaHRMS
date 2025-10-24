import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert';
import { PayrollAttributeDaum } from '../../../../../../domain/models/payrollAttribute.model';
import { payrollAttributeService } from '../../../../../../domain/services/payrollAttribute.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-payroll-attribute-create',
  templateUrl: './payroll-attribute-create.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './payroll-attribute-create.component.scss'
})
export class PayrollAttributeCreateComponent implements OnInit{

  payrollAttributeModel : PayrollAttributeDaum = new PayrollAttributeDaum();

  constructor( private router : Router, private toaster : ToastrService , private payrollAttributeService : payrollAttributeService){}

  ngOnInit() {
    if(history.state.data != null || history.state.data != undefined){
      this.payrollAttributeModel = history.state.data;   
    }  
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    
    this.saveattribute();
  }

  triggerFormSubmit(form: NgForm) {
    form.ngSubmit.emit();
  }

  async saveattribute() {  
    let obj = {
      id: 0,
      name: this.payrollAttributeModel.name,
      isDeductable : this.payrollAttributeModel.isDeductable,
      isPercentage : this.payrollAttributeModel.isPercentage,
      isCalculated : this.payrollAttributeModel.isPercentage,
      isAttendance : this.payrollAttributeModel.isAttendance
    };  
    if (this.payrollAttributeModel.id == 0) {
      (
        await this.payrollAttributeService.postPayrollAttribute(obj, `${AppConstant.POST_PAYROLL}`)
      ).subscribe(
        (responce) => {
          if (responce) {
            if (responce.success == true) {                
              this.toaster.success("success", responce.message);
            }
          }
        },
        (error) => {
          this.toaster.error("error", error);
        }
      );
    }
     else {
      obj.id = this.payrollAttributeModel.id;
      let params = new HttpParams().set("id", this.payrollAttributeModel.id);
      (
        await this.payrollAttributeService.putPayrollAttribute(obj, `${AppConstant.POST_PAYROLL}${this.payrollAttributeModel.id}`,params)
      ).subscribe(
        (response) => {
          if (response && response.success) {
            this.toaster.success("success", response.message);          }
        },
        (error) => {
          this.toaster.error("Error", error);
        }
      );
    }
    this.payrollAttributeModel = new PayrollAttributeDaum();
    this.router.navigate(['master/attribute']);
   
  }

  cancleCreate(attributeForm: any){
    if (attributeForm.dirty) {
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this record!",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.router.navigate(['master/attribute']);        
        } else {
          return;
        }
      });
    }
    else{
      this.router.navigate(['master/attribute']);        
    }
  }
}
