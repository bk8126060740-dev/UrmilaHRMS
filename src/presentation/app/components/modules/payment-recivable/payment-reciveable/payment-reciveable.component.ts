import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { PaymentReciveableService } from '../../../../../../domain/services/payment-Reciveable.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import { PaymentReceivableItem, ClientList, ProjectClientListModel, TransactionHistory } from '../../../../../../domain/models/paymentreciveable.model';
import { BankResourceMasterService } from '../../../../../../domain/services/bankresourcemaster.service';
import { BankAccountModel } from '../../../../../../domain/models/bank.model';
import { AddEnudumModel, Code, CodeType } from '../../../../../../domain/models/project.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FileHandle } from '../../../../../../directive/dragDrop.directive';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment-reciveable',
  templateUrl: './payment-reciveable.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './payment-reciveable.component.scss'
})

export class PaymentReciveableComponent implements OnInit {
clientList: ClientList[] = [];
  paymentReceviableList: PaymentReceivableItem[] = [];
  projectList: ProjectClientListModel[] = [];
  searchText: string = '';
  yearList: number[] = [];
  selectedYear: number[] = [];
  monthList: { id: number, name: string }[] = [];
  selectedMonth: number[] = [];
  selectedClientId: number | null = null;
  selectedProjectId: number[] = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  recode: number = 10;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  selectedInvoices: Set<number> = new Set();
  totalInvoiceValue: number = 0;
  totalHoldAmount: number = 0;
  totalCreditNote: number = 0;
  totalGstDeduction: number = 0;
  totalTdsDeduction: number = 0;
  isAnyInvoiceSelected: boolean = false;
  selectedInvoiceId: number | null = null;
  selectedBank: number | null = null;
  selectedPaymentType: number | null = null;
  bankList: BankAccountModel[] = [];
  paymentTypeList: Code[] = [];
  transactionHistory: TransactionHistory[] = [];
  selectedInvoiceForCredit: PaymentReceivableItem | null = null;
  creditRemarkForm = this.formBuilder.group({
    remark: ['', Validators.required],
    attachment: [null as File | null]
  });
  creditRemarks: { [key: number]: { remark: string, attachment: File | null } } = {};

  @ViewChild('creditRemarkModal') creditRemarkModal!: ModalDirective;
  @ViewChild('transactionHistoryModal') transactionHistoryModal!: ModalDirective;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;

  gstTaxablePercentage: number = 0;
  gstInvoicePercentage: number = 0;
  gstCalculatedAmount: number = 0;
  tdsTaxablePercentage: number = 0;
  tdsInvoicePercentage: number = 0;
  tdsCalculatedAmount: number = 0;
  chequeAmount: number = 0;
  balanceAmount: number = 0;
  maxChequeAmount: number = 0;

  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  UploadFlag: number = 1;
  isSubmitted: boolean = false;
  isViewMode: boolean = false;
  chequeNumber: string = '';

  selectedPaymentAdvisoryFile: File | null = null;
  selectedPaymentAdvisoryFileName: string | null = null;

  totalBalanceAmount: number = 0;

  constructor(
    private paymentReciveableService: PaymentReciveableService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private bankResourceMasterService: BankResourceMasterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getClientList();
    this.getBankResourceData();
    this.getPaymentTypeData();
    const currentYear = new Date().getFullYear();
    for (let i = 2024; i <= currentYear; i++) {
      this.yearList.push(i);
    }

    this.monthList = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: new Date(0, i).toLocaleString('default', { month: 'long' })  // e.g., January, February
    }));
  }

  onCancel() {
    this.router.navigate(['/accountreport/dashboard']);
  }

  async getBankResourceData() {
    let params = new HttpParams()
      // .set("RecordCount", this.recode.toString())
      // .set("PageNumber", this.pageNumber.toString())
      // .set("FilterBy", this.searchTerm)
      // .set("OrderBy", this.orderby);

      .set("SearchTerm", this.searchTerm || '')
      .set("IsSkipPaging", true);

    await this.bankResourceMasterService.getBankResource<BankAccountModel[]>(AppConstant.GET_BANKRESOURCE + '/Search', params).subscribe({
      next: (response) => {
        if (response) {
          this.bankList = response.data;
        }
      }
    });
  }

  async getPaymentTypeData() {
    let obj = { codeTypeIds: [54] };
    await this.paymentReciveableService.postPaymentReciveable<CodeType[]>(AppConstant.GET_ALLCODESBYCODETYPES, obj).subscribe({
      next: (response) => {
        console.log(response.data);
        this.paymentTypeList = response.data[0].codes;
      }
    })
  }

  onClientChange(): void {
    if (this.selectedClientId != null) {
      this.getProjectClientList(this.selectedClientId);
    } else {
      this.projectList = [];
    }
  }

  getClientList(): void {
    const params = new HttpParams()
      .set('isSkipPaging', true)
      .set('searchTerm', this.searchText || '');

    this.paymentReciveableService.getPaymentReciveable(AppConstant.GET_CLIENT_SEARCH, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.clientList = response.data as ClientList[];
        } else {
          this.clientList = [];
        }
      }
    });
  }

  showTransactionHistory(transaction: TransactionHistory[]) {
    this.transactionHistoryModal?.show();
    this.transactionHistory = transaction;
  }

  closeTransactionHistoryModal() {
    this.transactionHistoryModal?.hide();
    this.transactionHistory = [];
  }

  openCreditModal(invoice: PaymentReceivableItem): void {
    if (invoice.creditNote > 0) {
      this.selectedInvoiceForCredit = invoice;
      // Load existing remark and attachment if any
      if (invoice.creditRemark) {
        this.creditRemarkForm.patchValue({
          remark: invoice.creditRemark,
          attachment: invoice.creditAttachment
        });
        this.selectedFile = invoice.creditAttachment;
        this.selectedFileName = invoice.creditAttachment?.name || null;
      } else {
        this.creditRemarkForm.reset();
        this.selectedFile = null;
        this.selectedFileName = null;
      }
      this.creditRemarkModal?.show();
    }
  }

  closeCreditRemarkModal(): void {
    this.creditRemarkModal?.hide();
    this.selectedInvoiceForCredit = null;
    this.creditRemarkForm.reset();
    this.formDirective.resetForm();
  }

  getProjectClientList(clientId: number): void {
    const params = new HttpParams()
      .set('searchText', this.searchText || '')
      .set('clientId', clientId)
      .set('isSkipPaging', true)

    this.paymentReciveableService.getPaymentReciveable(AppConstant.GET_PROJECT + '/Search', params).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectList = response.data as ProjectClientListModel[];
        } else {
          this.projectList = [];
        }
      }
    });
  }

  viewPaymentReceivable(): void {
    this.isViewMode = true;
    if (!this.selectedClientId) {
      return;
    }

    let params = new HttpParams()
      .set('ClientId', this.selectedClientId.toString());

    // Add ProjectIds with index format
    this.selectedProjectId.forEach((projectId, index) => {
      params = params.set(`ProjectIds[${index}]`, projectId.toString());
    });

    // Add Months with index format
    this.selectedMonth.forEach((month, index) => {
      params = params.set(`Months[${index}]`, month.toString());
    });

    // Add Years with index format
    this.selectedYear.forEach((year, index) => {
      params = params.set(`Years[${index}]`, year.toString());
    });

    // Add other parameters
    params = params
      .set('IsPagingSkip', 'true')
      .set('RecordCount', this.recode.toString())
      .set('PageNumber', this.pageNumber.toString())
      .set('FilterBy', this.searchTerm)
      .set('OrderBy', this.orderby);

    this.paymentReciveableService.getPaymentReciveable(AppConstant.GET_PAYMENT_RECEVIABLE_INVOICE, params)
      .subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            const result: any = response.data;

            if (result.list) {
              this.paymentReceviableList = result.list.map((newItem: PaymentReceivableItem) => {
                const existingItem = this.paymentReceviableList.find(item =>
                  item.id === newItem.id
                );
                return existingItem ? { ...newItem, ...existingItem } : newItem;
              });
            } else {
              this.paymentReceviableList = [];
            }

            this.totalCount = result.totalCount || 0;
          } else {
            this.totalCount = 0;
            this.toasterService.warningToaster(response.message || 'No data found.');
          }
        },
        error: (error) => {
          this.toasterService.errorToaster('Error retrieving data. Please try again.');
          console.error('Error:', error);
        }
      });
  }

  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  isInvoiceSelected(invoiceId: number): boolean {
    return this.selectedInvoices.has(invoiceId);
  }

  onInvoiceSelectionChange(invoiceId: number, isSelected: boolean, invoiceValue: number): void {
    if (isSelected) {
      this.selectedInvoices.add(invoiceId);
      const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
      if (invoice) {
        this.totalInvoiceValue += parseFloat(this.calculateItemBalance(invoice).toFixed(2));
        this.totalInvoiceValue = Number(this.totalInvoiceValue.toFixed(2));
      }
    } else {
      this.selectedInvoices.delete(invoiceId);
      const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
      if (invoice) {
        this.totalInvoiceValue -= parseFloat(this.calculateItemBalance(invoice).toFixed(2));
        this.totalInvoiceValue = Number(this.totalInvoiceValue.toFixed(2));
        // Reset amounts when invoice is unselected
        invoice.holdAmount = 0;
        invoice.creditNote = 0;
        invoice.gstDeduction = 0;
        invoice.tdsDeduction = 0;
        invoice.balanceAmount = 0;
      }
    }
    this.isAnyInvoiceSelected = this.selectedInvoices.size > 0;
    if (!this.isAnyInvoiceSelected) {
      this.totalHoldAmount = 0;
      this.totalCreditNote = 0;
      this.totalGstDeduction = 0;
      this.totalTdsDeduction = 0;
      this.totalBalanceAmount = 0;
      this.totalInvoiceValue = 0;
    }
    this.updateFinalInvoiceValue();
  }

  isHoldAmountDisabled(invoice: PaymentReceivableItem): boolean {
    const otherDeductions = (invoice.creditNote || 0) + (invoice.gstDeduction || 0) + (invoice.tdsDeduction || 0);
    const maxAllowedAmount = this.getTransactionItemBalanceAmount(invoice) - otherDeductions;
    return maxAllowedAmount <= 0;
  }

  isCreditNoteDisabled(invoice: PaymentReceivableItem): boolean {
    const otherDeductions = (invoice.holdAmount || 0) + (invoice.gstDeduction || 0) + (invoice.tdsDeduction || 0);
    const maxAllowedAmount = this.getTransactionItemBalanceAmount(invoice) - otherDeductions;
    return maxAllowedAmount <= 0;
  }

  isGstDeductionDisabled(invoice: PaymentReceivableItem): boolean {
    const otherDeductions = (invoice.holdAmount || 0) + (invoice.creditNote || 0) + (invoice.tdsDeduction || 0);
    const maxAllowedAmount = this.getTransactionItemBalanceAmount(invoice) - otherDeductions;
    return maxAllowedAmount <= 0;
  }

  isTdsDeductionDisabled(invoice: PaymentReceivableItem): boolean {
    const otherDeductions = (invoice.holdAmount || 0) + (invoice.creditNote || 0) + (invoice.gstDeduction || 0);
    const maxAllowedAmount = this.getTransactionItemBalanceAmount(invoice) - otherDeductions;
    return maxAllowedAmount <= 0;
  }

  onHoldAmountChange(value: string, invoiceId?: number): void {
    const amount = parseFloat(value) || 0;
    if (invoiceId) {
      const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
      if (invoice) {
        if (this.isHoldAmountDisabled(invoice)) {
          invoice.holdAmount = 0;
          return;
        }
        // Calculate deductions excluding hold amount
        const otherDeductions = (invoice.creditNote || 0) + (invoice.gstDeduction || 0) + (invoice.tdsDeduction || 0);
        const maxAllowedAmount = this.getTransactionItemBalanceAmount(invoice) - otherDeductions;
        if (amount > maxAllowedAmount) {
          this.toasterService.warningToaster(`Hold amount cannot exceed available balance of ₹${maxAllowedAmount}`);
          invoice.holdAmount = maxAllowedAmount;
        } else {
          invoice.holdAmount = amount;
        }
        this.calculateTotalHoldAmount();
      }
    } else {
      // For total hold amount, check each selected invoice
      const selectedInvoices = this.paymentReceviableList.filter(item => this.selectedInvoices.has(item.id));
      const totalMaxAllowed = selectedInvoices.reduce((sum, invoice) => {
        if (this.isHoldAmountDisabled(invoice)) {
          return sum;
        }
        // Calculate deductions excluding hold amount
        const otherDeductions = (invoice.creditNote || 0) + (invoice.gstDeduction || 0) + (invoice.tdsDeduction || 0);
        return sum + (this.getTransactionItemBalanceAmount(invoice) - otherDeductions);
      }, 0);

      if (totalMaxAllowed <= 0) {
        this.toasterService.warningToaster('No available balance for hold amount');
        this.totalHoldAmount = 0;
        // Reset all hold amounts to 0
        selectedInvoices.forEach(invoice => {
          invoice.holdAmount = 0;
        });
      } else if (amount > totalMaxAllowed) {
        this.toasterService.warningToaster(`Total hold amount cannot exceed available balance of ₹${totalMaxAllowed}`);
        this.totalHoldAmount = totalMaxAllowed;
      } else {
        this.totalHoldAmount = amount;
      }
      this.updateInvoiceHoldAmounts();
    }
    this.updateFinalInvoiceValue();
    this.updateInvoiceBalanceAmounts();
  }

  onCreditNoteChange(value: string, invoiceId?: number): void {
    const amount = parseFloat(value) || 0;
    if (invoiceId) {
      const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
      if (invoice) {
        if (this.isCreditNoteDisabled(invoice)) {
          invoice.creditNote = 0;
          return;
        }
        // Calculate deductions excluding credit note
        const otherDeductions = (invoice.holdAmount || 0) + (invoice.gstDeduction || 0) + (invoice.tdsDeduction || 0);
        const maxAllowedAmount = this.getTransactionItemBalanceAmount(invoice) - otherDeductions;
        if (amount > maxAllowedAmount) {
          this.toasterService.warningToaster(`Credit note cannot exceed available balance of ₹${maxAllowedAmount}`);
          invoice.creditNote = maxAllowedAmount;
        } else {
          invoice.creditNote = amount;
        }
        this.calculateTotalCreditNote();
      }
    } else {
      // For total credit note, check each selected invoice
      const selectedInvoices = this.paymentReceviableList.filter(item => this.selectedInvoices.has(item.id));
      const totalMaxAllowed = selectedInvoices.reduce((sum, invoice) => {
        if (this.isCreditNoteDisabled(invoice)) {
          return sum;
        }
        // Calculate deductions excluding credit note
        const otherDeductions = (invoice.holdAmount || 0) + (invoice.gstDeduction || 0) + (invoice.tdsDeduction || 0);
        return sum + (this.getTransactionItemBalanceAmount(invoice) - otherDeductions);
      }, 0);

      if (totalMaxAllowed <= 0) {
        this.toasterService.warningToaster('No available balance for credit note');
        this.totalCreditNote = 0;
        // Reset all credit notes to 0
        selectedInvoices.forEach(invoice => {
          invoice.creditNote = 0;
        });
      } else if (amount > totalMaxAllowed) {
        this.toasterService.warningToaster(`Total credit note cannot exceed available balance of ₹${totalMaxAllowed}`);
        this.totalCreditNote = totalMaxAllowed;
      } else {
        this.totalCreditNote = amount;
      }
      this.updateInvoiceCreditNotes();
    }
    this.updateFinalInvoiceValue();
    this.updateInvoiceBalanceAmounts();
  }

  onGstDeductionChange(value: string, invoiceId?: number): void {
    const amount = parseFloat(value) || 0;
    if (invoiceId) {
      const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
      if (invoice) {
        if (this.isGstDeductionDisabled(invoice)) {
          invoice.gstDeduction = 0;
          return;
        }
        // Calculate deductions excluding GST deduction
        const otherDeductions = (invoice.holdAmount || 0) + (invoice.creditNote || 0) + (invoice.tdsDeduction || 0);
        const maxAllowedAmount = this.getTransactionItemBalanceAmount(invoice) - otherDeductions;
        if (amount > maxAllowedAmount) {
          this.toasterService.warningToaster(`GST deduction cannot exceed available balance of ₹${maxAllowedAmount}`);
          invoice.gstDeduction = maxAllowedAmount;
        } else {
          invoice.gstDeduction = amount;
        }
        this.calculateTotalGstDeduction();
      }
    } else {
      // For total GST deduction, check each selected invoice
      const selectedInvoices = this.paymentReceviableList.filter(item => this.selectedInvoices.has(item.id));
      const totalMaxAllowed = selectedInvoices.reduce((sum, invoice) => {
        if (this.isGstDeductionDisabled(invoice)) {
          return sum;
        }
        // Calculate deductions excluding GST deduction
        const otherDeductions = (invoice.holdAmount || 0) + (invoice.creditNote || 0) + (invoice.tdsDeduction || 0);
        return sum + (this.getTransactionItemBalanceAmount(invoice) - otherDeductions);
      }, 0);

      if (totalMaxAllowed <= 0) {
        this.toasterService.warningToaster('No available balance for GST deduction');
        this.totalGstDeduction = 0;
        // Reset all GST deductions to 0
        selectedInvoices.forEach(invoice => {
          invoice.gstDeduction = 0;
        });
      } else if (amount > totalMaxAllowed) {
        this.toasterService.warningToaster(`Total GST deduction cannot exceed available balance of ₹${totalMaxAllowed}`);
        this.totalGstDeduction = totalMaxAllowed;
      } else {
        this.totalGstDeduction = amount;
      }
      this.updateInvoiceGstDeductions();
    }
    this.updateFinalInvoiceValue();
    this.updateInvoiceBalanceAmounts();
  }

  onTdsDeductionChange(value: string, invoiceId?: number): void {
    const amount = parseFloat(value) || 0;
    if (invoiceId) {
      const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
      if (invoice) {
        if (this.isTdsDeductionDisabled(invoice)) {
          invoice.tdsDeduction = 0;
          return;
        }
        // Calculate deductions excluding TDS deduction
        const otherDeductions = (invoice.holdAmount || 0) + (invoice.creditNote || 0) + (invoice.gstDeduction || 0);
        const maxAllowedAmount = this.getTransactionItemBalanceAmount(invoice) - otherDeductions;
        if (amount > maxAllowedAmount) {
          this.toasterService.warningToaster(`TDS deduction cannot exceed available balance of ₹${maxAllowedAmount}`);
          invoice.tdsDeduction = maxAllowedAmount;
        } else {
          invoice.tdsDeduction = amount;
        }
        this.calculateTotalTdsDeduction();
      }
    } else {
      // For total TDS deduction, check each selected invoice
      const selectedInvoices = this.paymentReceviableList.filter(item => this.selectedInvoices.has(item.id));
      const totalMaxAllowed = selectedInvoices.reduce((sum, invoice) => {
        if (this.isTdsDeductionDisabled(invoice)) {
          return sum;
        }
        // Calculate deductions excluding TDS deduction
        const otherDeductions = (invoice.holdAmount || 0) + (invoice.creditNote || 0) + (invoice.gstDeduction || 0);
        return sum + (this.getTransactionItemBalanceAmount(invoice) - otherDeductions);
      }, 0);

      if (totalMaxAllowed <= 0) {
        this.toasterService.warningToaster('No available balance for TDS deduction');
        this.totalTdsDeduction = 0;
        // Reset all TDS deductions to 0
        selectedInvoices.forEach(invoice => {
          invoice.tdsDeduction = 0;
        });
      } else if (amount > totalMaxAllowed) {
        this.toasterService.warningToaster(`Total TDS deduction cannot exceed available balance of ₹${totalMaxAllowed}`);
        this.totalTdsDeduction = totalMaxAllowed;
      } else {
        this.totalTdsDeduction = amount;
      }
      this.updateInvoiceTdsDeductions();
    }
    this.updateFinalInvoiceValue();
    this.updateInvoiceBalanceAmounts();
  }

  calculateTotalHoldAmount(): void {
    this.totalHoldAmount = this.paymentReceviableList
      .filter(item => this.selectedInvoices.has(item.id))
      .reduce((sum, item) => sum + (item.holdAmount || 0), 0);
  }

  calculateTotalCreditNote(): void {
    this.totalCreditNote = this.paymentReceviableList
      .filter(item => this.selectedInvoices.has(item.id))
      .reduce((sum, item) => sum + (item.creditNote || 0), 0);
  }

  calculateTotalGstDeduction(): void {
    this.totalGstDeduction = this.paymentReceviableList
      .filter(item => this.selectedInvoices.has(item.id))
      .reduce((sum, item) => sum + (item.gstDeduction || 0), 0);
  }

  calculateTotalTdsDeduction(): void {
    this.totalTdsDeduction = this.paymentReceviableList
      .filter(item => this.selectedInvoices.has(item.id))
      .reduce((sum, item) => sum + (item.tdsDeduction || 0), 0);
  }

  updateInvoiceHoldAmounts(): void {
    const selectedCount = this.selectedInvoices.size;
    if (selectedCount > 0) {
      // First, get all selected invoices with their max allowed amounts
      const selectedInvoices = this.paymentReceviableList
        .filter(item => this.selectedInvoices.has(item.id))
        .map(item => {
          // Calculate deductions excluding hold amount
          const otherDeductions = (item.creditNote || 0) + (item.gstDeduction || 0) + (item.tdsDeduction || 0);
          const maxAmount = Number((this.getTransactionItemBalanceAmount(item) - otherDeductions).toFixed(2));
          return {
            invoice: item,
            maxAmount: maxAmount
          };
        });

      // Sort by max amount in ascending order
      selectedInvoices.sort((a, b) => a.maxAmount - b.maxAmount);

      let remainingAmount = Number(this.totalHoldAmount.toFixed(2));

      // Distribute amount considering max limits
      selectedInvoices.forEach(({ invoice, maxAmount }) => {
        if (remainingAmount > 0) {
          if (remainingAmount <= maxAmount) {
            // If remaining amount is less than or equal to max amount, use remaining amount
            invoice.holdAmount = remainingAmount;
            remainingAmount = 0;
          } else {
            // If remaining amount is more than max amount, use max amount
            invoice.holdAmount = maxAmount;
            remainingAmount = Number((remainingAmount - maxAmount).toFixed(2));
          }
        } else {
          invoice.holdAmount = 0;
        }
      });

      // Recalculate total after applying limits
      this.calculateTotalHoldAmount();
    }
  }

  updateInvoiceCreditNotes(): void {
    const selectedCount = this.selectedInvoices.size;
    if (selectedCount > 0) {
      // First, get all selected invoices with their max allowed amounts
      const selectedInvoices = this.paymentReceviableList
        .filter(item => this.selectedInvoices.has(item.id))
        .map(item => {
          // Calculate deductions excluding credit note
          const otherDeductions = (item.holdAmount || 0) + (item.gstDeduction || 0) + (item.tdsDeduction || 0);
          const maxAmount = Number((this.getTransactionItemBalanceAmount(item) - otherDeductions).toFixed(2));
          return {
            invoice: item,
            maxAmount: maxAmount
          };
        });

      // Sort by max amount in ascending order
      selectedInvoices.sort((a, b) => a.maxAmount - b.maxAmount);

      let remainingAmount = Number(this.totalCreditNote.toFixed(2));

      // Distribute amount considering max limits
      selectedInvoices.forEach(({ invoice, maxAmount }) => {
        if (remainingAmount > 0) {
          if (remainingAmount <= maxAmount) {
            // If remaining amount is less than or equal to max amount, use remaining amount
            invoice.creditNote = remainingAmount;
            remainingAmount = 0;
          } else {
            // If remaining amount is more than max amount, use max amount
            invoice.creditNote = maxAmount;
            remainingAmount = Number((remainingAmount - maxAmount).toFixed(2));
          }
        } else {
          invoice.creditNote = 0;
        }
      });

      // Recalculate total after applying limits
      this.calculateTotalCreditNote();
    }
  }

  updateInvoiceGstDeductions(): void {
    const selectedCount = this.selectedInvoices.size;
    if (selectedCount > 0) {
      // First, get all selected invoices with their max allowed amounts
      const selectedInvoices = this.paymentReceviableList
        .filter(item => this.selectedInvoices.has(item.id))
        .map(item => {
          // Calculate deductions excluding GST deduction
          const otherDeductions = (item.holdAmount || 0) + (item.creditNote || 0) + (item.tdsDeduction || 0);
          const maxAmount = Number((this.getTransactionItemBalanceAmount(item) - otherDeductions).toFixed(2));
          return {
            invoice: item,
            maxAmount: maxAmount
          };
        });

      // Sort by max amount in ascending order
      selectedInvoices.sort((a, b) => a.maxAmount - b.maxAmount);

      let remainingAmount = Number(this.totalGstDeduction.toFixed(2));

      // Distribute amount considering max limits
      selectedInvoices.forEach(({ invoice, maxAmount }) => {
        if (remainingAmount > 0) {
          if (remainingAmount <= maxAmount) {
            // If remaining amount is less than or equal to max amount, use remaining amount
            invoice.gstDeduction = remainingAmount;
            remainingAmount = 0;
          } else {
            // If remaining amount is more than max amount, use max amount
            invoice.gstDeduction = maxAmount;
            remainingAmount = Number((remainingAmount - maxAmount).toFixed(2));
          }
        } else {
          invoice.gstDeduction = 0;
        }
      });

      // Recalculate total after applying limits
      this.calculateTotalGstDeduction();
    }
  }

  updateInvoiceTdsDeductions(): void {
    const selectedCount = this.selectedInvoices.size;
    if (selectedCount > 0) {
      // First, get all selected invoices with their max allowed amounts
      const selectedInvoices = this.paymentReceviableList
        .filter(item => this.selectedInvoices.has(item.id))
        .map(item => {
          // Calculate deductions excluding TDS deduction
          const otherDeductions = (item.holdAmount || 0) + (item.creditNote || 0) + (item.gstDeduction || 0);
          const maxAmount = Number((this.getTransactionItemBalanceAmount(item) - otherDeductions).toFixed(2));
          return {
            invoice: item,
            maxAmount: maxAmount
          };
        });

      // Sort by max amount in ascending order
      selectedInvoices.sort((a, b) => a.maxAmount - b.maxAmount);

      let remainingAmount = Number(this.totalTdsDeduction.toFixed(2));

      // Distribute amount considering max limits
      selectedInvoices.forEach(({ invoice, maxAmount }) => {
        if (remainingAmount > 0) {
          if (remainingAmount <= maxAmount) {
            // If remaining amount is less than or equal to max amount, use remaining amount
            invoice.tdsDeduction = remainingAmount;
            remainingAmount = 0;
          } else {
            // If remaining amount is more than max amount, use max amount
            invoice.tdsDeduction = maxAmount;
            remainingAmount = Number((remainingAmount - maxAmount).toFixed(2));
          }
        } else {
          invoice.tdsDeduction = 0;
        }
      });

      // Recalculate total after applying limits
      this.calculateTotalTdsDeduction();
    }
  }

  updateFinalInvoiceValue(): void {
    if (!this.isAnyInvoiceSelected) {
      this.balanceAmount = 0;
    } else {
      this.balanceAmount = this.totalInvoiceValue
        - this.totalHoldAmount
        - this.totalCreditNote
        - this.totalGstDeduction
        - this.totalTdsDeduction;
    }
    const totalDeductions = this.totalHoldAmount + this.totalCreditNote + this.totalGstDeduction + this.totalTdsDeduction;

    // Calculate total balance amount from selected invoices
    const totalBalanceAmount = Array.from(this.selectedInvoices)
      .map(invoiceId => {
        const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
        return invoice ? this.calculateItemBalance(invoice) : 0;
      })
      .reduce((sum, balance) => sum + balance, 0);

    const finalValue = totalBalanceAmount - totalDeductions;
    const invoiceValueInput = document.querySelector('input[name="InvoiceValue"]') as HTMLInputElement;
    if (invoiceValueInput) {
      invoiceValueInput.value = finalValue.toFixed(2);
    }
    this.maxChequeAmount = finalValue;
    this.calculateBalanceAmount();
  }

  calculateBalanceAmount(): void {
    const totalDeductions = Number((this.totalHoldAmount + this.totalCreditNote + this.totalGstDeduction + this.totalTdsDeduction).toFixed(2));

    // Calculate total balance amount from selected invoices
    const totalBalanceAmount = Array.from(this.selectedInvoices)
      .map(invoiceId => {
        const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
        return invoice ? this.calculateItemBalance(invoice) : 0;
      })
      .reduce((sum, balance) => sum + balance, 0);

    this.maxChequeAmount = Number((totalBalanceAmount - totalDeductions).toFixed(2));
    this.balanceAmount = Number((this.maxChequeAmount - this.chequeAmount).toFixed(2));
  }

  calculateItemBalance(item: PaymentReceivableItem): number {
    if (!item.transaction || item.transaction.length === 0) {
      return item.invoiceValue || 0;
    }

    const totalDeductions = item.transaction.reduce((sum, trans) => {
      return sum + (trans.creditedAmount || 0) + (trans.gstAndTDSAmount || 0) + (trans.itAndTDSAmount || 0) + (trans.creditNoteDeductionAmount || 0);
    }, 0);

    return (item.invoiceValue || 0) - totalDeductions;
  }

  calculateTotalDeductions(invoice: PaymentReceivableItem): number {
    return (invoice.gstDeduction || 0) +
      (invoice.tdsDeduction || 0) +
      (invoice.holdAmount || 0) +
      (invoice.creditNote || 0);
  }

  getMaximumItemBalanceAmount(item: PaymentReceivableItem): number {
    const totalDeductions = this.calculateTotalDeductions(item);
    return this.getTransactionItemBalanceAmount(item) - totalDeductions;
  }

  getTransactionItemBalanceAmount(item: PaymentReceivableItem): number {
    if (!item.transaction || item.transaction.length === 0) {
      return Number((item.invoiceValue || 0).toFixed(2));
    }

    const totalDeductions = item.transaction.reduce((sum, trans) => {
      const transactionDeductions =
        (trans.creditedAmount || 0) +
        (trans.gstAndTDSAmount || 0) +
        (trans.itAndTDSAmount || 0) +
        (trans.creditNoteDeductionAmount || 0);

      return sum + transactionDeductions;
    }, 0);

    // Calculate remaining balance
    const invoiceValue = item.invoiceValue || 0;
    const remainingBalance = invoiceValue - totalDeductions;

    return Number(Math.abs(remainingBalance).toFixed(2));
  }

  onChequeAmountChange(value: string): void {
    const newAmount = parseFloat(value) || 0;
    if (newAmount > this.maxChequeAmount) {
      this.toasterService.warningToaster('Cheque amount cannot exceed available amount');
      this.chequeAmount = this.maxChequeAmount;
    } else {
      this.chequeAmount = newAmount;
      this.totalBalanceAmount = newAmount; // Set total balance amount to match cheque amount
      this.updateInvoiceBalanceAmounts();
    }
    this.calculateBalanceAmount();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > AppConstant.FILE5MB) {
        this.toasterService.warningToaster(`File "${file.name}" exceeds the size limit of 5MB.`, 'warning');
        return;
      }
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        this.toasterService.warningToaster('Only PDF files are allowed!', 'warning');
        return;
      }
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.creditRemarkForm.patchValue({
        attachment: file
      });
    }
  }

  removeFile(): void {
    this.UploadFlag = 2;
    this.selectedFile = null;
    this.selectedFileName = null;
    this.creditRemarkForm.patchValue({
      attachment: null
    });
  }

  onSubmitCreditRemark(): void {
    if (this.creditRemarkForm.valid && this.selectedInvoiceForCredit) {
      const remark = this.creditRemarkForm.get('remark')?.value;
      const attachment = this.creditRemarkForm.get('attachment')?.value;

      if (remark) {
        // Find the invoice in paymentReceviableList
        const invoice = this.paymentReceviableList.find(item => item.id === this.selectedInvoiceForCredit?.id);
        if (invoice) {
          // Store the remark and attachment in the invoice
          invoice.creditRemark = remark;
          invoice.creditAttachment = attachment || null;

          // Also store in creditRemarks map for quick lookup
          this.creditRemarks[invoice.id] = {
            remark: remark,
            attachment: attachment || null
          };

          this.toasterService.successToaster('Credit remark saved successfully');
          this.closeCreditRemarkModal();
        }
      }
    }
  }

  getCreditRemark(invoiceId: number): string {
    return this.creditRemarks[invoiceId]?.remark || '';
  }

  hasCreditRemark(invoiceId: number): boolean {
    return !!this.creditRemarks[invoiceId];
  }

  onPaymentAdvisoryFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > AppConstant.FILE5MB) {
        this.toasterService.warningToaster(`File "${file.name}" exceeds the size limit of 5MB.`, 'warning');
        return;
      }
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        this.toasterService.warningToaster('Only PDF files are allowed!', 'warning');
        return;
      }
      this.selectedPaymentAdvisoryFile = file;
      this.selectedPaymentAdvisoryFileName = file.name;
    }
  }

  removePaymentAdvisoryFile(): void {
    this.selectedPaymentAdvisoryFile = null;
    this.selectedPaymentAdvisoryFileName = null;
  }

  onSubmitTransaction() {
    this.isSubmitted = true;

    for (const invoiceId of this.selectedInvoices) {
      const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
      if (invoice) {
        const totalDeductions = this.calculateTotalDeductions(invoice);
      }
    }

    if (!this.selectedBank || !this.selectedInvoices.size || !this.chequeNumber || !this.chequeAmount || this.chequeAmount <= 0) {
      return;
    }

    const formData = new FormData();

    // Add basic payment details
    formData.append('PaymentNumber', '1');
    formData.append('PaymentType', this.selectedPaymentType?.toString() || '');
    formData.append('PaymentIdentifier', this.chequeNumber);
    formData.append('PaymentAmount', this.chequeAmount.toString());
    formData.append('PaymentDate', new Date().toISOString());
    formData.append('GSTAndTDSAmount', this.totalGstDeduction.toString());
    formData.append('ITAndTDSAmount', this.totalTdsDeduction.toString());
    formData.append('BankId', this.selectedBank.toString());

    // Add payment advisory attachment if exists
    if (this.selectedPaymentAdvisoryFile) {
      formData.append('AttachmentPath', this.selectedPaymentAdvisoryFile);
    }

    // Prepare invoices data
    const selectedInvoices = Array.from(this.selectedInvoices).map(invoiceId => {
      const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
      if (!invoice) return null;
      const totalDeductions = this.calculateTotalDeductions(invoice);

      let RemainingBalanceAmount = this.getTransactionItemBalanceAmount(invoice) - invoice.balanceAmount - totalDeductions;

      return {
        InvoiceId: invoice.id,
        IsTaxApplicable: false,
        GSTAndTDSAmount: invoice.gstDeduction || 0,
        ITAndTDSAmount: invoice.tdsDeduction || 0,
        HoldAmount: invoice.holdAmount || 0,
        CreditNoteDeductionAmount: invoice.creditNote || 0,
        CreditedAmount: invoice.balanceAmount || 0,
        RemainingBalanceAmount: RemainingBalanceAmount.toFixed(2),
        creditNoteAttachment: this.selectedFile,
        creditRemark: this.creditRemarkForm.get('remark')?.value,
      };
    }).filter(invoice => invoice !== null);

    // Add each invoice with proper index
    selectedInvoices.forEach((invoice, index) => {
      if (invoice) {
        formData.append(`Invoices[${index}].InvoiceId`, invoice.InvoiceId.toString());
        formData.append(`Invoices[${index}].IsTaxApplicable`, invoice.IsTaxApplicable.toString());
        formData.append(`Invoices[${index}].GSTAndTDSAmount`, invoice.GSTAndTDSAmount.toString());
        formData.append(`Invoices[${index}].ITAndTDSAmount`, invoice.ITAndTDSAmount.toString());
        formData.append(`Invoices[${index}].HoldAmount`, invoice.HoldAmount.toString());
        formData.append(`Invoices[${index}].CreditNoteDeductionAmount`, invoice.CreditNoteDeductionAmount.toString());
        formData.append(`Invoices[${index}].CreditedAmount`, invoice.CreditedAmount.toString());
        formData.append(`Invoices[${index}].RemainingBalanceAmount`, invoice.RemainingBalanceAmount.toString());
        formData.append(`Invoices[${index}].creditNoteAttachment`, invoice.creditNoteAttachment || '');
        formData.append(`Invoices[${index}].creditRemark`, invoice.creditRemark || '');
      }
    });

    // Call the API
    this.paymentReciveableService.postPaymentReciveable(AppConstant.POST_PAYMENT_RECEVIABLE, formData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toasterService.successToaster('Payment saved successfully');
            // Reset form and selections
            this.resetForm();
          } else {
            this.toasterService.errorToaster(response.message || 'Failed to save payment');
          }
        },
      });
  }

  downloadTaxInvoice(id: number): void {
    if (!this.selectedInvoices.has(id)) {
      this.toasterService.warningToaster('Please select the invoice before downloading');
      return;
    }

    this.selectedInvoiceId = id;

    const selectedInvoice = this.paymentReceviableList.find(item => item.id === id);

    if (selectedInvoice) {
      const payrollId = selectedInvoice.payrollId;
      const url = `${AppConstant.PAYROLL_TEXT_INVOICE_ATTACHMENT}/${payrollId}`;

      this.paymentReciveableService.getDownloadTaxInvoice(url).subscribe({
        next: (res: any) => {
          if (res?.data?.length > 0) {
            const { filePath, fileName } = res.data[0];

            const a = document.createElement('a');
            a.href = filePath;
            a.download = fileName || `Tax_Invoice_${payrollId}.pdf`;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            this.toasterService.warningToaster('No invoice file available for download');
          }
        }
      });
    } else {
      this.toasterService.warningToaster('Invoice not found');
    }
  }

  downloadProFormaInvoice(id: number): void {
    if (!this.selectedInvoices.has(id)) {
      this.toasterService.warningToaster('Please select the invoice before downloading');
      return;
    }

    this.selectedInvoiceId = id;
    const selectedInvoice = this.paymentReceviableList.find(item => item.id === this.selectedInvoiceId);

    if (selectedInvoice) {
      const payrollId = selectedInvoice.payrollId;

      const formData = new FormData();
      formData.append('PayrollId', payrollId.toString());

      this.paymentReciveableService.postDownloadTaxInvoice(AppConstant.GET_PERFORMA_INVOICE, formData).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ProForma_Invoice_${payrollId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      });
    }
  }

  private resetForm(): void {
    // Reset selected invoices and their values
    this.selectedInvoices.clear();
    this.paymentReceviableList.forEach(invoice => {
      invoice.holdAmount = 0;
      invoice.creditNote = 0;
      invoice.gstDeduction = 0;
      invoice.tdsDeduction = 0;
      invoice.balanceAmount = 0;
      invoice.creditRemark = null;
      invoice.creditAttachment = null;
    });

    // Reset form fields
    this.selectedBank = null;
    this.selectedPaymentType = null;
    this.chequeAmount = 0;
    this.chequeNumber = '';
    this.balanceAmount = 0;
    this.totalHoldAmount = 0;
    this.totalCreditNote = 0;
    this.totalGstDeduction = 0;
    this.totalTdsDeduction = 0;
    this.totalBalanceAmount = 0;
    this.totalInvoiceValue = 0;
    this.maxChequeAmount = 0;
    this.selectedFile = null;
    this.selectedFileName = null;
    this.selectedPaymentAdvisoryFile = null;
    this.selectedPaymentAdvisoryFileName = null;
    this.isAnyInvoiceSelected = false;
    this.isSubmitted = false;

    // Reset credit remark form
    this.creditRemarkForm.reset();
    this.selectedInvoiceForCredit = null;
    this.viewPaymentReceivable();
  }

  filesDropped(files: FileHandle[]): void {
    if (files.length > 0) {
      const file = files[0].file;
      if (file) {
        if (file.size > AppConstant.FILE5MB) {
          this.toasterService.warningToaster(`File "${file.name}" exceeds the size limit of 5MB.`, 'warning');
          return;
        }
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          this.toasterService.warningToaster('Only PDF files are allowed!', 'warning');
          return;
        }
        this.selectedFile = file;
        this.selectedFileName = file.name;
        this.creditRemarkForm.patchValue({
          attachment: file
        });
      }
    }
  }

  filesDroppedPaymentAdvisory(files: FileHandle[]): void {
    if (files.length > 0) {
      const file = files[0].file;
      if (file) {
        if (file.size > AppConstant.FILE5MB) {
          this.toasterService.warningToaster(`File "${file.name}" exceeds the size limit of 5MB.`, 'warning');
          return;
        }
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          this.toasterService.warningToaster('Only PDF files are allowed!', 'warning');
          return;
        }
        this.selectedPaymentAdvisoryFile = file;
        this.selectedPaymentAdvisoryFileName = file.name;
      }
    }
  }

  handleFileSizeErrors(errors: string[]): void {
    errors.forEach(error => {
      this.toasterService.warningToaster(error, 'warning');
    });
  }

  triggerProfileFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  getTransactionHoldAmount(item: PaymentReceivableItem): number {
    if (!item.transaction || item.transaction.length === 0) {
      return 0;
    }

    return item.transaction[item.transaction.length - 1].holdAmount
  }

  onBalanceAmountChange(value: string, invoiceId?: number): void {
    const amount = parseFloat(value) || 0;
    if (invoiceId) {
      const invoice = this.paymentReceviableList.find(item => item.id === invoiceId);
      if (invoice) {
        const totalDeductions = this.calculateTotalDeductions(invoice);
        const maxAllowedAmount = this.getTransactionItemBalanceAmount(invoice) - totalDeductions;

        if (maxAllowedAmount <= 0) {
          this.toasterService.warningToaster('No available balance for settlement amount');
          invoice.balanceAmount = 0;
          return;
        }

        if (amount > maxAllowedAmount) {
          this.toasterService.warningToaster(`Settlement amount cannot exceed available balance of ₹${maxAllowedAmount}`);
          invoice.balanceAmount = maxAllowedAmount;
        } else {
          invoice.balanceAmount = amount;
        }
        this.calculateTotalBalanceAmount();
        this.chequeAmount = this.totalBalanceAmount;
      }
    } else {
      // For total balance amount, check each selected invoice
      const selectedInvoices = this.paymentReceviableList.filter(item => this.selectedInvoices.has(item.id));
      const totalMaxAllowed = selectedInvoices.reduce((sum, invoice) => {
        const totalDeductions = this.calculateTotalDeductions(invoice);
        const maxAmount = this.getTransactionItemBalanceAmount(invoice) - totalDeductions;
        return sum + (maxAmount > 0 ? maxAmount : 0);
      }, 0);

      if (totalMaxAllowed <= 0) {
        this.toasterService.warningToaster('No available balance for settlement amount');
        this.totalBalanceAmount = 0;
        // Reset all balance amounts to 0
        selectedInvoices.forEach(invoice => {
          invoice.balanceAmount = 0;
        });
      } else if (amount > totalMaxAllowed) {
        this.toasterService.warningToaster(`Total settlement amount cannot exceed available balance of ₹${totalMaxAllowed}`);
        this.totalBalanceAmount = totalMaxAllowed;
      } else {
        this.totalBalanceAmount = amount;
      }
      this.updateInvoiceBalanceAmounts();
      // Update cheque amount based on total balance amount
      this.chequeAmount = this.totalBalanceAmount;
    }
    this.updateFinalInvoiceValue();
  }

  calculateTotalBalanceAmount(): void {
    this.totalBalanceAmount = this.paymentReceviableList
      .filter(item => this.selectedInvoices.has(item.id))
      .reduce((sum, item) => sum + (item.balanceAmount || 0), 0);
  }

  updateInvoiceBalanceAmounts(): void {
    const selectedCount = this.selectedInvoices.size;
    if (selectedCount > 0) {
      // First, get all selected invoices with their max allowed amounts
      const selectedInvoices = this.paymentReceviableList
        .filter(item => this.selectedInvoices.has(item.id))
        .map(item => {
          const totalDeductions = this.calculateTotalDeductions(item);
          const maxAmount = Number((this.getTransactionItemBalanceAmount(item) - totalDeductions).toFixed(2));
          return {
            invoice: item,
            maxAmount: maxAmount
          };
        });

      // Sort by max amount in ascending order
      selectedInvoices.sort((a, b) => a.maxAmount - b.maxAmount);

      let remainingAmount = Number(this.totalBalanceAmount.toFixed(2));
      let remainingInvoices = selectedInvoices.length;

      // Distribute amount considering max limits
      selectedInvoices.forEach(({ invoice, maxAmount }, index) => {
        if (remainingInvoices > 0) {
          const equalShare = Number((remainingAmount / remainingInvoices).toFixed(2));

          if (equalShare <= maxAmount) {
            // If equal share is within limit, use it
            invoice.balanceAmount = equalShare;
            remainingAmount = Number((remainingAmount - equalShare).toFixed(2));
          } else {
            // If equal share exceeds limit, use max amount
            invoice.balanceAmount = maxAmount;
            remainingAmount = Number((remainingAmount - maxAmount).toFixed(2));
          }
          remainingInvoices--;
        }
      });

      // Recalculate total after applying limits
      this.calculateTotalBalanceAmount();

      // Update cheque amount to match the actual distributed amount
      this.chequeAmount = Number(this.totalBalanceAmount.toFixed(2));
      this.calculateBalanceAmount();
    }
  }

  getTotalMaxAllowedAmount(): number {
    const selectedInvoices = this.paymentReceviableList.filter(item => this.selectedInvoices.has(item.id));
    return selectedInvoices.reduce((sum, invoice) => sum + this.getTransactionItemBalanceAmount(invoice), 0);
  }

  isBalanceAmountDisabled(invoice: PaymentReceivableItem): boolean {
    const totalDeductions = this.calculateTotalDeductions(invoice);
    const maxAllowedAmount = this.getTransactionItemBalanceAmount(invoice) - totalDeductions;
    return maxAllowedAmount <= 0;
  }
}

