import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClientList, ProjectClientListModel } from '../../../../../../domain/models/paymentreciveable.model';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { PfChallanService } from '../../../../../../domain/services/pfChallan.service';
import { PayrollListByProject, PayrollModel } from '../../../../../../domain/models/payroll.model';
import { PfChallan, PfChallanHistory } from '../../../../../../domain/models/pf-challan.model';
import { ToasterService } from '../../../../../../common/toaster-service';
import { NavigationExtras, Router } from '@angular/router';
import swal from "sweetalert";



@Component({
  selector: 'app-pf-dashboard',
  templateUrl: './pfdashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './pfdashboard.component.scss'
})
export class PFDashboardComponent implements OnInit {
  clientList: ClientList[] = [];
  projectList: ProjectClientListModel[] = [];
  payrollList: PayrollListByProject[] = [];
  isExpanded: { [key: string]: boolean } = {};
  isViewMode: boolean = false;

  pfFilterForm!: FormGroup;
  PfUploadForm!: FormGroup;
  isUploadSubmitted: boolean = false;

  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  pfChallanHistory: PfChallanHistory[] = [];

  @ViewChild("PfchallanModal", { static: false }) public PfchallanModal: ModalDirective | undefined;

  constructor(private pfChallanService: PfChallanService, private toasterService: ToasterService, private router: Router) { }

  ngOnInit(): void {
    this.pfFilterForm = new FormGroup({
      name: new FormControl('', Validators.required),
      selectedClientId: new FormControl(null, Validators.required),
      selectedProjectId: new FormControl(null, Validators.required),
      selectedPayrollId: new FormControl([], Validators.required)
    });
    this.PfUploadForm = new FormGroup({
      id: new FormControl(null, Validators.required),
      trrnNo: new FormControl('', Validators.required),
      challanDate: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      remark: new FormControl('', Validators.required),
      crnNo: new FormControl('', Validators.required),
      txtFile: new FormControl(null, Validators.required),
      ecrFile: new FormControl(null, Validators.required),
      epfChallanFile: new FormControl(null, Validators.required),
      paymentContinuationFile: new FormControl(null, Validators.required)
    });
    this.getClientList();
  }

  openPfchallanModal(id: number) {
    this.PfchallanModal?.show();
    this.PfUploadForm.patchValue({ id: id });
  }

  onClientChange(): void {
    this.pfFilterForm.patchValue({
      selectedProjectId: null,
      selectedPayrollId: []
    });
    this.projectList = [];
    this.payrollList = [];
    if (this.pfFilterForm.value.selectedClientId != null) {
      this.getProjectClientList(this.pfFilterForm.value.selectedClientId);
    }
  }

  getClientList(): void {
    this.projectList = [];
    this.payrollList = [];
    this.pfFilterForm.patchValue({
      selectedProjectId: null,
      selectedPayrollId: []
    });
    const params = new HttpParams()
      .set('isSkipPaging', true)
      .set('searchTerm', this.pfFilterForm.value.name || '');

    this.pfChallanService.getPfChallan(AppConstant.GET_CLIENT_SEARCH, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.clientList = response.data as ClientList[];
        } else {
          this.clientList = [];
        }
      }
    });
  }

  getProjectClientList(clientId: number): void {
    const params = new HttpParams()
      .set('searchText', '')
      .set('clientId', clientId)
      .set('isSkipPaging', true)

    this.pfChallanService.getPfChallan(AppConstant.GET_PROJECT + '/Search', params).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectList = response.data as ProjectClientListModel[];
        } else {
          this.projectList = [];
        }
      }
    });
  }

  onProjectChange(): void {
    if (this.pfFilterForm.value.selectedProjectId != null) {
      this.pfFilterForm.patchValue({
        selectedPayrollId: []
      });
      let params = new HttpParams()
        .set('ProjectIds', this.pfFilterForm.value.selectedProjectId)
        .set('isSkipPaging', true)

      this.pfChallanService.getPfChallan<PayrollListByProject[]>(AppConstant.GET_PAYROLL_BY_PROJECT, params).subscribe({
        next: (response) => {
          if (response.success) {
            this.payrollList = [];
            response.data.forEach((payroll) => {
              this.payrollList.push({
                ...payroll,
                displayName: `(${payroll.month} - ${payroll.year})- ${payroll.name}`
              });
            });

            this.payrollList.sort((a: PayrollListByProject, b: PayrollListByProject) => {
              if (a.year !== b.year) {
                return a.year - b.year;
              }
              return a.month - b.month;
            });

          } else {
            this.payrollList = [];
          }
        }
      });
    }
  }

  pfchallan: PfChallan[] = [];
  viewDetails(): void {
    this.pfFilterForm.controls['name'].clearValidators();
    this.pfFilterForm.controls['selectedPayrollId'].clearValidators();
    this.pfFilterForm.controls['selectedProjectId'].clearValidators();
    this.pfFilterForm.controls['name'].updateValueAndValidity();
    this.pfFilterForm.controls['selectedPayrollId'].updateValueAndValidity();
    this.pfFilterForm.controls['selectedProjectId'].updateValueAndValidity();

    this.isViewMode = true;

    if (this.pfFilterForm.valid) {
      let params = new HttpParams()
        .set('ClientId', this.pfFilterForm.value.selectedClientId)
        .set('ProjectIds', this.pfFilterForm.value.selectedProjectId)

      if (this.pfFilterForm.value.selectedPayrollId.length > 0) {
        this.pfFilterForm.value.selectedPayrollId.forEach((id: number, i: number) => {
          params = params.set(`PayrollIds[${i}]`, id.toString());
        });
      }

      this.pfChallanService.getPfChallan<PfChallanHistory[]>(AppConstant.GET_PF_CHALLAN_HISTORY, params).subscribe({
        next: (response) => {
          if (response.success) {
            this.pfchallan = [];
            // Group challans by project
            response.data.forEach((challan) => {
              challan.payrolls.forEach((payroll) => {
                const existingPfChallan = this.pfchallan.find(p => p.id === payroll.project.id);

                if (existingPfChallan) {
                  // Combine project names if not already present
                  if (!existingPfChallan.name.split(', ').includes(payroll.project.name)) {
                    existingPfChallan.name += ', ' + payroll.project.name;
                  }
                  // Check if challan already exists in history before adding
                  const challanExists = existingPfChallan.pfChallanHistory.some(
                    existingChallan => existingChallan.id === challan.id
                  );
                  if (!challanExists) {
                    existingPfChallan.pfChallanHistory.push(challan);
                  }
                } else {
                  // Create new entry
                  const obj = new PfChallan();
                  obj.id = payroll.project.id;
                  obj.name = payroll.project.name;
                  obj.pfChallanHistory = [challan];
                  this.pfchallan.push(obj);
                }
              });
            });

          } else {
            this.pfChallanHistory = [];
          }
        }
      });
    }
  }

  viewRecord(challan: PfChallanHistory) {
    const navigationExtras: NavigationExtras = {
      state: {
        PfChallanData: challan
      },
    };
    this.router.navigate(['/compliance/pfcontribution-report'], navigationExtras);
  }

  exportReport(): void {
    this.pfFilterForm.controls['name'].setValidators(Validators.required);
    this.pfFilterForm.controls['selectedPayrollId'].setValidators(Validators.required);
    this.pfFilterForm.controls['selectedProjectId'].setValidators(Validators.required);
    this.pfFilterForm.controls['name'].updateValueAndValidity();
    this.pfFilterForm.controls['selectedPayrollId'].updateValueAndValidity();
    this.pfFilterForm.controls['selectedProjectId'].updateValueAndValidity();

    this.isViewMode = true;
    if (this.pfFilterForm.valid) {
      let formData = new FormData();
      formData.append('Tag', this.pfFilterForm.value.name);

      this.pfFilterForm.value.selectedPayrollId.forEach((id: number, i: number) => {
        formData.append(`PayrollIds[${i}]`, id.toString());

      });

      this.pfChallanService.postDownloadPfChallan(AppConstant.POST_PF_CHALLAN, formData).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'text/plain' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.pfFilterForm.value.name}.txt`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      });
    }

  }

  toggleChild(key: string): void {
    if (key) {
      this.isExpanded[key] = !this.isExpanded[key];
    }
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files && event.target.files.length ? event.target.files[0] : null;
    if (file) {
      if (controlName === 'txtFile') {
        // Check if file is CSV
        if (!file.name.toLowerCase().endsWith('.txt')) {
          this.toasterService.warningToaster('Please upload only TXT files', 'warning');
          event.target.value = ''; // Clear the file input
          return;
        }
      } else {
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          this.toasterService.warningToaster('Please upload only PDF files', 'warning');
          event.target.value = ''; // Clear the file input
          return;
        }
      }

    }
    this.PfUploadForm.patchValue({ [controlName]: file });
    this.PfUploadForm.get(controlName)?.updateValueAndValidity();
  }

  downloadErrorFile(challan: PfChallanHistory) {
    window.open(challan.errorFilePath, '_blank');
  }

  uploadPFDocument(): void {
    this.isUploadSubmitted = true;
    this.PfUploadForm.markAllAsTouched();
    if (this.PfUploadForm.valid) {
      let formData = new FormData();
      formData.append('Id', this.PfUploadForm.value.id);
      formData.append('TRRNNo', this.PfUploadForm.value.trrnNo);
      formData.append('ChallanGeneratedDate', this.PfUploadForm.value.challanDate.toISOString());
      formData.append('Amount', this.PfUploadForm.value.amount);
      formData.append('Remark', this.PfUploadForm.value.remark);
      formData.append('CRNNo', this.PfUploadForm.value.crnNo);

      formData.append('PFAttachments[0].filePath', this.PfUploadForm.value.txtFile);
      formData.append('PFAttachments[0].fileType', '574');

      formData.append('PFAttachments[1].filePath', this.PfUploadForm.value.ecrFile);
      formData.append('PFAttachments[1].fileType', '575');


      formData.append('PFAttachments[2].filePath', this.PfUploadForm.value.epfChallanFile);
      formData.append('PFAttachments[2].fileType', '576');


      formData.append('PFAttachments[3].filePath', this.PfUploadForm.value.paymentContinuationFile);
      formData.append('PFAttachments[3].fileType', '577');



      this.pfChallanService.putPfChallan(AppConstant.GET_PF_CHALLAN_HISTORY + '/' + this.PfUploadForm.value.id, formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.toasterService.successToaster(response.message);
            this.closePfchallanModal();
          }
        }
      });
    }
  }

  clearFile(controlName: string): void {
    this.PfUploadForm.patchValue({ [controlName]: null });
    this.PfUploadForm.get(controlName)?.updateValueAndValidity();
  }

  closePfchallanModal(): void {
    this.PfchallanModal?.hide();
    this.PfUploadForm.reset();
  }

  deleteChallan(id: number): void {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.pfChallanService.deletePfChallan(AppConstant.DELETE_PF_CHALLAN + '/' + id).subscribe({
          next: (response) => {
            if (response.success) {
              this.toasterService.successToaster(response.message);
              this.viewDetails();
            }
          }
        });
      } else {
        return;
      }
    });

  }

  reDownloadChallan(challan: PfChallanHistory): void {
    let params = new HttpParams()
      .set('PayrollPFChallanHistoryId', challan.id)
    this.pfChallanService.getDownloadPfChallan(AppConstant.POST_PF_CHALLAN, params).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${challan.tag}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

}
