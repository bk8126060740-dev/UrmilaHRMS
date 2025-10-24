export class clientListModel {
    value: number = 0;
    text: string = "";
}

export class ProjectListModel {
    id: number = 0;
    name: string = "";
}

export class PaymentReceviableReportListModel {
    id: number = 0;
    payrollId: number = 0;
    projectId: number = 0;
    projectName: string = "";
    clientId: number = 0;
    clientName: string = "";
    invoiceId: number = 0;
    invoiceTaxAttachmentId: number = 0;
    paymentDate: string = "";
    performaInvoice: string = "";
    taxInvoiceDate?: string = "";
    taxInvoiceAmount: number = 0;
    taxInvoicenumber: string = "";
    gstInvoice: any
    billTo: string = "";
    grossAmount: number = 0;
    cgstAmount: number = 0;
    sgstAmount: number = 0;
    totalTax: number = 0;
    invoiceValue: number = 0;
    bankName: string = "";
    bankAccountNo: string = "";
    chequenumber: string = "";
    chequeDate: string = "";
    gstAndTDSAmount: number = 0;
    itAndTDSAmount: number = 0;
    holdAmount: number = 0;
    creditNoteDeductionAmount: number = 0;
    creditedAmount: number = 0;
    creditNoteRemark: any
    remainingBalanceAmount: number = 0;
    paymentAdvice: string = "";
    items: any[] = [];
}  
