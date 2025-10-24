import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BankAccountModel, BankResourceCodeModel } from '../../../../../../domain/models/bank.model';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { BankResourceMasterService } from '../../../../../../domain/services/bankresourcemaster.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import { HttpParams } from '@angular/common/http';
import { AppConstant } from '../../../../../../common/app-constant';
import swal from "sweetalert";

@Component({
  selector: 'app-bank-master',
  templateUrl: './bank-master.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './bank-master.component.scss'
})

export class BankMasterComponent {
  rowData: BankAccountModel[] = [];
  bankresourceCodeList: BankResourceCodeModel[] = [];
  bankresourceForm!: FormGroup;
  totalCount: number = 0;
  pageNumber: number = 1;
  recode: number = 10;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  submitted = false;

  columns = [
    {
      field: 'bankName',
      displayName: 'Bank Name',
      sortable: true,
      filterable: true,
      visible: true,
    },
    //   field: 'prefixIFSCCode',
    //   displayName: 'Prefix Code',
    //   sortable: false,
    //   filterable: false,
    //   visible: false,
    {
      field: 'accountName',
      displayName: 'Account Name',
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: 'accountNumber',
      displayName: 'Account Number',
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: 'ifscCode',
      displayName: 'IFSC Code',
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: 'branchCode',
      displayName: 'Corporate ID',
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: 'accountTypeName',
      displayName: 'Account Type',
      sortable: true,
      filterable: true,
      visible: true,
    }
  ];

  @ViewChild("bankresourcemodel", { static: false })
  public bankresourcemodel: ModalDirective | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;

  constructor(
    private bankresourcemasterService: BankResourceMasterService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.bankresourceForm = this.formBuilder.group({
      id: [''],
      bankName: ['', Validators.required],
      accountName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      branchCode: ['', Validators.required],
      accountTypeId: ['', Validators.required]
    });
    this.getBankResourceData();
    this.getBankResourceCodeList();
  }

  onAddBankResource() {
    this.formDirective.resetForm();
    this.bankresourcemodel?.show();
  }

  closeBankResourceModel() {
    this.bankresourcemodel?.hide();
    this.formDirective.resetForm();
  }

  async getBankResourceData() {
    let params = new HttpParams()
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);

    await this.bankresourcemasterService.getBankResource<BankAccountModel[]>(AppConstant.GET_BANKRESOURCE, params).subscribe({
      next: (response) => {
        if (response) {
          this.rowData = response.data;
          this.totalCount = response.totalCount;
        }
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.bankresourceForm.invalid) {
      return;
    }
    this.savebankresource();
  }

  async savebankresource() {

    const data = this.bankresourceForm.value;

    const bankResourcePayload = {
      id: data.id || 0,
      bankName: data.bankName,
      accountName: data.accountName,
      accountNumber: data.accountNumber ? data.accountNumber.toString() : '',
      ifscCode: data.ifscCode ? data.ifscCode.toString() : '',
      branchCode: data.branchCode ? data.branchCode.toString() : '',
      accountTypeId: data.accountTypeId,
    };

    if (data.id === 0 || data.id == null) {
      this.bankresourcemasterService.postBankResource<BankAccountModel>(AppConstant.GET_BANKRESOURCE, bankResourcePayload).subscribe({
        next: (response: any) => {
          if (response && response.success == true) {
            this.toasterService.successToaster(response.message);
            this.bankresourcemodel?.hide();
            this.formDirective.resetForm();
            this.getBankResourceData();
          }
        }
      });
    } else {
      this.bankresourcemasterService.putBankResource<BankAccountModel>(AppConstant.GET_BANKRESOURCE, bankResourcePayload).subscribe({
        next: (response) => {
          if (response && response.success == true) {
            this.toasterService.successToaster(response.message);
            this.bankresourcemodel?.hide();
            this.formDirective.resetForm();
            this.getBankResourceData();
          }
        }
      });
    }
  }

  onEdit(event: any) {
    this.bankresourceForm.patchValue({
      id: event.id ?? null,
      bankName: event.bankName ?? '',
      accountName: event.accountName ?? '',
      accountNumber: event.accountNumber ?? '',
      ifscCode: event.ifscCode ?? '',
      branchCode: event.branchCode ?? '',
      accountTypeId: event.accountTypeId ?? null,
    });
    this.bankresourcemodel?.show();
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
        this.deleteBankResourceMaster(event);
      } else {
        return;
      }
    });
  }

  async deleteBankResourceMaster(event: any) {

    let params = new HttpParams().set("id", event.id);
    (
      await this.bankresourcemasterService.deleteBankResource(AppConstant.GET_BANKRESOURCE, params)).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.rowData = this.rowData.filter((r) => r !== event);
            this.toasterService.successToaster(response.message);
            this.totalCount = this.totalCount - 1;
          }
        },
      });
  }

  async getBankResourceCodeList() {
    const code = AppConstant.BANKRESOURCE_CODE
    let params = new HttpParams()
      .set('codeTypeId', code)
    await this.bankresourcemasterService.getBankResource(AppConstant.GET_BANKRESOURCE_CODE + '/' + code + '/codes', params).subscribe({
      next: (response) => {
        if (response.success && response.status === 200 && Array.isArray(response.data) && response.data.length) {
          this.bankresourceCodeList = response.data;
        } else {
          this.bankresourceCodeList = [];
        }
      }
    })
  }

  onSearch(event: any) {
    this.searchTerm = event;
    this.getBankResourceData();
  }

  onPageChange(page: any) {
    this.pageNumber = page;
    this.getBankResourceData();
  }

  onTotalBankResourceValueChange(totalDepartment: any) {
    this.recode = totalDepartment;
    this.pageNumber = 1;
    this.getBankResourceData();
  }

  orderBy(event: any) {
    this.orderby = event;
    this.getBankResourceData();
  }

}
