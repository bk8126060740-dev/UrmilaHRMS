export class EsicChallanList {
    id: number = 0;
    tag: string = '';
    challanNo: any = null;
    transactionNo: any = null;
    challanSubmittedDate: any = null;
    amountPaid: any = null;
    remark: any = null;
    errorFilePath: any = null;
    status: Status = new Status();
    payrolls: Payroll[] = [];
}

export class Status {
    id: number = 0;
    name: string = '';
    color: string = '';
}

export class Payroll {
    id: number = 0;
    name: string = '';
    project: Project = new Project();
}

export class Project {
    id: number = 0;
    name: string = '';
    client: Client = new Client();
}

export class Client {
    id: number = 0;
    name: string = '';
}

export class EsicChallan {
    id: number = 0;
    name: string = "";
    esicChallanHistory: EsicChallanList[] = [];
}


export class PayrollESICList {
    id: number = 0;
    payrollESICId: number = 0;
    calcNoOfDaysWork: number = 0;
    calcTotalWages: number = 0;
    deptNoOfDaysWork: number = 0;
    deptTotalWages: number = 0;
    diffNoOfDaysWork: number = 0;
    diffTotalWages: number = 0;
    arrier: number = 0;
    projectName: string = '';
    location: string = '';
    period: string = '';
    invoiceNo: string = '';
    invoiceDate: string = '';
    employeeId: number = 0;
    employeeCode: string = '';
    employeeName: string = '';
    esicNo: string = '';
    presentDays: any = null;
    grossWages: number = 0;
    calcIpContribution: number = 0;
    deptIpContribution: number = 0;
    diffIpContribution: number = 0;
    challanNo: string = '';
    challanDate: string = '';
    ecrNo: string = '';
    status: string = '';
}

export class ESICAttachment {
    payrollESICId: number = 0;
    payrollESICChallanHistoryId: number = 0;
    attachments: Attachment[] = [];
}

export class Attachment {
    id: number = 0;
    filePath: string = '';
    fileType: number = 0;
    fileTypeName: string = '';
}
