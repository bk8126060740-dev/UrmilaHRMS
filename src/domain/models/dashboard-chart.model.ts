export class DashboardChartModel {
    clienId: number = 0;
    clientName: string = '';
    attendece: Attendece[] | null = null;
}

export class Attendece {
    atttendnceStatus: string = '';
    count: number = 0;
}

export class DashboardPayrollModel {
    clienId: number = 0;
    clientName: string = '';
    payrolls: Payroll[] = [];
    project: Project = new Project();
}

export class Payroll {
    status: string = '';
    banKSheetCount: number = 0;
    piInvoiceCount: number = 0;
    gstInvoiceCount: number = 0;
    utrCount: number = 0;
    count: number = 0;
    projectCount: number = 0;
}

export class Project {
    banKSheetCount: number = 0;
    banKSheetMissCount: number = 0;
    piInvoiceCount: number = 0;
    piInvoiceMissCount: number = 0;
    gstInvoiceCount: number = 0;
    gstInvoiceMissCount: number = 0;
    utrCount: number = 0;
    utrMissCount: number = 0;
    count: number = 0;
}
