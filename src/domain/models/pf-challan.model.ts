export class PayrollPfdetail {
    id: number = 0;
    employeeId: number = 0;
    employeeName: string = '';
    payrollPfId: number = 0;
    calcGross: number = 0;
    calcEpf: number = 0;
    calcEps: number = 0;
    calcEdli: number = 0;
    calcEe: number = 0;
    calcEpS833: number = 0;
    calcEr: number = 0;
    calcNcpdays: number = 0;
    deptGross: number = 0;
    deptEpf: number = 0;
    deptEps: number = 0;
    deptEdli: number = 0;
    deptEe: number = 0;
    deptEpS833: number = 0;
    deptEr: number = 0;
    deptNcpdays: number = 0;
    diffGross: number = 0;
    diffEpf: number = 0;
    diffEps: number = 0;
    diffEdli: number = 0;
    diffEe: number = 0;
    diffEpS833: number = 0;
    diffEr: number = 0;
    diffNcpdays: number = 0;
    arrier: number = 0;
    totalCalculated: number = 0;
    totalDepartment: number = 0;
    difference: number = 0;
}

export class PfAttachment {
    payrollPFId: number = 0;
    payrollPFChallanHistoryId: number = 0;
    attachments: Attachment[] = [];
}

export class Attachment {
    id: number = 0;
    filePath: string = '';
    fileType: number = 0;
    fileTypeName: string = '';
}

export class PfChallanHistory {
    id: number = 0;
    tag: string = '';
    trrnNo: string = '';
    errorFilePath: string = '';
    challanGeneratedDate: string = '';
    amount: number = 0;
    crnNo: string = '';
    remark: any = null;
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


export class PfChallan {
    id: number = 0;
    name: string = "";
    pfChallanHistory: PfChallanHistory[] = [];
}

export class Report {
    id: number = 0;
    name: string = '';
    status: number = 0;
    statusName: string = '';
    reportFilePath: string = '';
    createdDate: string | Date = '';
    updatedDate: string = '';
}
