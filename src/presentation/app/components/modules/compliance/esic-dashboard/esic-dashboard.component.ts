import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ClientList, ProjectClientListModel } from '../../../../../../domain/models/paymentreciveable.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PayrollListByProject } from '../../../../../../domain/models/payroll.model';
import { PfChallanService } from '../../../../../../domain/services/pfChallan.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import { HttpParams } from '@angular/common/http';
import { AppConstant } from '../../../../../../common/app-constant';
import { PfChallan, PfChallanHistory } from '../../../../../../domain/models/pf-challan.model';
import swal from "sweetalert";
import { EsicChallan, EsicChallanList } from '../../../../../../domain/models/esic-challan.model';

@Component({
  selector: 'app-esic-dashboard',
  templateUrl: './esic-dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './esic-dashboard.component.scss'
})
export class EsicDashboardComponent implements OnInit {
  clientList: ClientList[] = [];
  projectList: ProjectClientListModel[] = [];
  payrollList: PayrollListByProject[] = [];
  isExpanded: { [key: string]: boolean } = {};
  isViewMode: boolean = false;

  esicFilterForm!: FormGroup;
  ESICUploadForm!: FormGroup;
  isUploadSubmitted: boolean = false;

  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  pfChallanHistory: PfChallanHistory[] = [];

  @ViewChild("ESICchallanModal", { static: false }) public ESICchallanModal: ModalDirective | undefined;

  constructor(
    private pfChallanService: PfChallanService,
    private toasterService: ToasterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.esicFilterForm = new FormGroup({
      name: new FormControl('', Validators.required),
      selectedClientId: new FormControl(null, Validators.required),
      selectedProjectId: new FormControl(null, Validators.required),
      selectedPayrollId: new FormControl([], Validators.required),
      totalWorkingDays: new FormControl('', Validators.required)
    });
    this.ESICUploadForm = new FormGroup({
      id: new FormControl(null, Validators.required),
      challanNo: new FormControl('', Validators.required),
      challanSubmittedDate: new FormControl('', Validators.required),
      amountPaid: new FormControl('', Validators.required),
      remark: new FormControl('', Validators.required),
      transactionNo: new FormControl('', Validators.required),
      csvFile: new FormControl(null, Validators.required),
      challanFile: new FormControl(null, Validators.required),
      ecrFile: new FormControl(null, Validators.required)
    });
    this.getClientList();
  }

  openESICchallanModal(id: number) {
    this.ESICchallanModal?.show();
    this.ESICUploadForm.patchValue({ id: id });
  }

  onClientChange(): void {
    this.esicFilterForm.patchValue({
      selectedProjectId: null,
      selectedPayrollId: []
    });
    this.projectList = [];
    this.payrollList = [];
    if (this.esicFilterForm.value.selectedClientId != null) {
      this.getProjectClientList(this.esicFilterForm.value.selectedClientId);
    }
  }

  getClientList(): void {
    this.projectList = [];
    this.payrollList = [];
    this.esicFilterForm.patchValue({
      selectedProjectId: null,
      selectedPayrollId: []
    });
    const params = new HttpParams()
      .set('isSkipPaging', true)
      .set('searchTerm', this.esicFilterForm.value.name || '');

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
    if (this.esicFilterForm.value.selectedProjectId != null) {
      this.esicFilterForm.patchValue({
        selectedPayrollId: []
      });
      let params = new HttpParams()
        .set('ProjectIds', this.esicFilterForm.value.selectedProjectId)
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

  esicChallan: EsicChallan[] = [];
  viewDetails(): void {
    this.esicFilterForm.controls['name'].clearValidators();
    this.esicFilterForm.controls['totalWorkingDays'].clearValidators();
    this.esicFilterForm.controls['selectedPayrollId'].clearValidators();
    this.esicFilterForm.controls['selectedProjectId'].clearValidators();
    this.esicFilterForm.controls['name'].updateValueAndValidity();
    this.esicFilterForm.controls['totalWorkingDays'].updateValueAndValidity();
    this.esicFilterForm.controls['selectedPayrollId'].updateValueAndValidity();
    this.esicFilterForm.controls['selectedProjectId'].updateValueAndValidity();

    this.isViewMode = true;

    if (this.esicFilterForm.valid) {
      let params = new HttpParams()
        .set('ClientId', this.esicFilterForm.value.selectedClientId)
        .set('ProjectIds', this.esicFilterForm.value.selectedProjectId)

      if (this.esicFilterForm.value.selectedPayrollId.length > 0) {
        this.esicFilterForm.value.selectedPayrollId.forEach((id: number, i: number) => {
          params = params.set(`PayrollIds[${i}]`, id.toString());
        });
      }

      this.pfChallanService.getPaginationData<EsicChallanList>(AppConstant.GET_ESIC_CHALLAN_HISTORY, params).subscribe({
        next: (response) => {
          if (response.success) {
            this.esicChallan = [];
            // Group challans by project
            response.data.list.forEach((challan: EsicChallanList) => {
              challan.payrolls.forEach((payroll) => {
                const existingPfChallan = this.esicChallan.find(p => p.id === payroll.project.id);

                if (existingPfChallan) {
                  // Combine project names if not already present
                  if (!existingPfChallan.name.split(', ').includes(payroll.project.name)) {
                    existingPfChallan.name += ', ' + payroll.project.name;
                  }
                  // Check if challan already exists in history before adding
                  const challanExists = existingPfChallan.esicChallanHistory.some(
                    existingChallan => existingChallan.id === challan.id
                  );
                  if (!challanExists) {
                    existingPfChallan.esicChallanHistory.push(challan);
                  }
                } else {
                  // Create new entry
                  const obj = new EsicChallan();
                  obj.id = payroll.project.id;
                  obj.name = payroll.project.name;
                  obj.esicChallanHistory = [challan];
                  this.esicChallan.push(obj);
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

  viewRecord(challan: EsicChallanList) {
    const navigationExtras: NavigationExtras = {
      state: {
        EsicChallanData: challan
      },
    };
    this.router.navigate(['/compliance/esiccontribution-report'], navigationExtras);
  }

  exportReport(): void {
    this.esicFilterForm.controls['name'].setValidators(Validators.required);
    this.esicFilterForm.controls['totalWorkingDays'].setValidators(Validators.required);
    this.esicFilterForm.controls['selectedPayrollId'].setValidators(Validators.required);
    this.esicFilterForm.controls['selectedProjectId'].setValidators(Validators.required);
    this.esicFilterForm.controls['name'].updateValueAndValidity();
    this.esicFilterForm.controls['selectedPayrollId'].updateValueAndValidity();
    this.esicFilterForm.controls['selectedProjectId'].updateValueAndValidity();
    this.esicFilterForm.controls['totalWorkingDays'].updateValueAndValidity();

    this.isViewMode = true;
    if (this.esicFilterForm.valid) {
      let formData = new FormData();
      formData.append('Tag', this.esicFilterForm.value.name);
      formData.append('TotalWorkingDays', this.esicFilterForm.value.totalWorkingDays);

      this.esicFilterForm.value.selectedPayrollId.forEach((id: number, i: number) => {
        formData.append(`PayrollIds[${i}]`, id.toString());

      });

      this.pfChallanService.postDownloadPfChallan(AppConstant.POST_ESIC_CHALLAN, formData).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.esicFilterForm.value.name}.csv`;
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
      if (controlName === 'csvFile') {
        // Check if file is CSV
        if (!file.name.toLowerCase().endsWith('.csv')) {
          this.toasterService.warningToaster('Please upload only CSV files', 'warning');
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
    this.ESICUploadForm.patchValue({ [controlName]: file });
    this.ESICUploadForm.get(controlName)?.updateValueAndValidity();
  }

  downloadErrorFile(challan: EsicChallanList) {
    window.open(challan.errorFilePath, '_blank');
  }

  uploadESICDocument(): void {
    this.isUploadSubmitted = true;
    this.ESICUploadForm.markAllAsTouched();
    if (this.ESICUploadForm.valid) {
      let formData = new FormData();
      formData.append('Id', this.ESICUploadForm.value.id);
      formData.append('ChallanNo', this.ESICUploadForm.value.challanNo);
      formData.append('ChallanSubmittedDate', this.ESICUploadForm.value.challanSubmittedDate.toISOString());
      formData.append('TransactionNo', this.ESICUploadForm.value.transactionNo);
      formData.append('Remark', this.ESICUploadForm.value.remark);
      formData.append('AmountPaid', this.ESICUploadForm.value.amountPaid);

      formData.append('ESICAttachments[0].filePath', this.ESICUploadForm.value.csvFile);
      formData.append('ESICAttachments[0].fileType', '584');

      formData.append('ESICAttachments[1].filePath', this.ESICUploadForm.value.ecrFile);
      formData.append('ESICAttachments[1].fileType', '575');


      formData.append('ESICAttachments[2].filePath', this.ESICUploadForm.value.challanFile);
      formData.append('ESICAttachments[2].fileType', '585');



      this.pfChallanService.putPfChallan(AppConstant.GET_ESIC_CHALLAN_HISTORY + '/' + this.ESICUploadForm.value.id, formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.toasterService.successToaster(response.message);
            this.closeESICchallanModal();
          }
        }
      });
    }
  }

  clearFile(controlName: string): void {
    this.ESICUploadForm.patchValue({ [controlName]: null });
    this.ESICUploadForm.get(controlName)?.updateValueAndValidity();
  }

  closeESICchallanModal(): void {
    this.ESICchallanModal?.hide();
    this.ESICUploadForm.reset();
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
        this.pfChallanService.deletePfChallan(AppConstant.DELETE_ESIC_CHALLAN + '/' + id).subscribe({
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

  reDownloadChallan(challan: EsicChallanList): void {
    let params = new HttpParams()
      .set('PayrollESICChallanHistoryId', challan.id)
    this.pfChallanService.getDownloadPfChallan(AppConstant.POST_ESIC_CHALLAN, params).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${challan.tag}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

}
