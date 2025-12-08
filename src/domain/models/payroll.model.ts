import { number } from "mathjs";

export class PayrollModel {
    id: number = 0;
    name: string = "";
    month: number = 0;
    monthName: string = '';
    year: number = 0;
    desciption: string = "";
    status: number = 0;
    colorCode: string = "";
    statusColorCode: string = "";
    projectId: number = 0;
    description: string = "";
    statusName: string = "";
    isAttendanceValid: boolean = false;
    isInvoice: boolean = false;
    isBankSheet: boolean = false;
    file: string = "";
    payrollId: number = 0;
    bankSheetId: number = 0;
    projectName: string = "";
    InvoiceUrl: string = "";
    payrollPath: string = "";
    genratedStatus:boolean=false;
    taxInvoices:PayrollList[] =[];
    isTaxInvoice:IsTaxInvoice[]=[];
}

export class PayrollList {
    invoicePath: string = "";
    invoicePrefix: string = "";
}
export class IsTaxInvoice {
    number: string = "";
}
export class PayrollListByProject {
    id: number = 0;
    name: string = "";
    month: number = 0;
    year: number = 0;
    projectId: number = 0;
    projectName: string = "";
    displayName: string = "";
}

export class StatusWithCountModel {
    id: number = 0;
    count: number = 0;
    name: string = "";
    colorCode: string = "";
}

export class PayrollAttribute {
    id: number = 0;
    name: string = "";
    groupId: number = 0;
    groupName: string = "";
    sequenceId: number = 0;
}

export interface PayrollValue {
    payrollAttributeId: number;
    id: number;
    value: number;
}

export class PayrollEmployeeSummary {
    employeeId: number = 0;
    isSelected: boolean = false;
    name: string = "";
    payrollValues: PayrollValue[] = [];
}

export class PayrollData {
    payrollAttributes: PayrollAttribute[] = [];
    data: PayrollEmployeeSummary[] = [];
}

export class AttributeBYPayrollId {
    value: number = 0;
    isSuccess: boolean = false;
    message: string = "";
    type: number = 0;
}

export class FileList {
    bankSheetId: number = 0;
    payrollId: number = 0;
    payrollName: string = "";
    payrollAttributeId: number = 0;
    payrollAttributeName: string = "";
    month: string = "";
    bankResources: string = "";
    bankResourceId: number = 0;
    errorFilePath: any = null;
    status: number = 0;
    colorCode: string = "";
    statusName: string = "";
    attachments: Attachment[] = [];
}

export class Attachment {
    id: number = 0;
    filePath: string = "";
    fileType: number = 0;
    fileTypeName: string = "";
}


export class PFChallanModel {
    file: string = "";
    id: number = 0;
    fileName: string = "";
    filePath: string = "";
    projectId: number = 0;
    projectName: string = "";
    payrollId: number = 0;
}

export class UTRModel {
    file: string = "";
    bankSheetId: number = 0;
}

export class ApprovedAttendanceList {
    id: number = 0;
    month: number = 0;
    year: number = 0;
    srNo: number = 0;
}

export class TaxInvoice {
    id: number = 0;
    fileName: string = "";
    filePath: string = "";
    payrollId: number = 0;
    amount: number = 0;
    invoiceDate: string = "";
    number: string = "";
    remarks: string = "";
}


export class BankSheetReport {
    id: number = 0;
    location: string = "";
    invoiceNo: string = "";
    invoiceDate: string = "";
    projectName: string = "";
    period: string = "";
    employeeName: string = "";
    employeeCode: string = "";
    bankName: string = "";
    accountNo: string = "";
    ifscCode: string = "";
    bankSheetAmount: number = 0;
    utrFileAmount: number = 0;
    differenceAmount: number = 0;
    utrReferenceNumber: string = "";
    status: string = "";
}

export class BankSheetReportAttachment {
    bankSheetId: number = 0;
    attachments: BankSheetReportAttachment2[] = [];
}

export class BankSheetReportAttachment2 {
    id: number = 0;
    filePath: string = "";
    fileType: number = 0;
    fileTypeName: string = "";
}
