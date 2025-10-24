export class ClientList {
    value: number = 0;
    text: string = "";
}

export class ProjectClientListModel {
    id: number = 0;
    name: string = "";
}

export class PaymentReceivableData {
    list: PaymentReceivableItem[] = [];
    totalCount: number = 0;
    lastPaymentNumber: string = '';
}

export class PaymentReceivableItem {
    Id: number = 0;
    taxInvoiceDate: string | null = '';
    taxInvoiceAmount: number = 0;
    taxInvoiceNumber: string | null = '';
    transaction: TransactionHistory[] = [];
    id: number = 0;
    invoicePrefix: string = '';
    buyerId: number = 0;
    projectId: number = 0;
    invoiceDate: string = '';
    payrollId: number = 0;
    paymentMode: string = '';
    termsofDelivery: string = '';
    igstRate: number = 0;
    igstAmount: number = 0;
    cgstAmount: number | null = 0;
    cgstRate: number | null = 0;
    sgstAmount: number | null = 0;
    sgstRate: number | null = 0;
    grossValue: number = 0;
    invoiceValue: number = 0;
    totalTax: number = 0;
    holdAmount: number = 0;
    creditNote: number = 0;
    gstDeduction: number = 0;
    tdsDeduction: number = 0;
    balanceAmount: number = 0;
    creditRemark: string | null = null;
    creditAttachment: File | null = null;
}

export class TransactionHistory {
    creditNoteDeductionAmount: number = 0;
    creditNoteRemark: string | null = null;
    creditedAmount: number = 0;
    gstAndTDSAmount: number = 0;
    holdAmount: number = 0;
    id: number = 0;
    isTaxApplicable: boolean = false;
    itAndTDSAmount: number = 0;
    paymentDate: string = '';
    paymentNumber: string = '';
    paymentType: string = '';
    remainingBalanceAmount: number = 0;
}
