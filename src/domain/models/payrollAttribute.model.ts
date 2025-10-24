export class PayrollAttributeModel {
    totalCount: number = 0
    data: PayrollAttributeDaum[] = [];
    success: boolean = false;
    message: string = "";
}

export class PayrollAttributeDaum {
    id: number = 0;
    name: string = ''
    isActive: boolean = true;
    isAttendance: boolean = false;
    isCalculated: boolean = false;
    isDeductable: boolean = false;
    isPercentage: boolean = false;
    isTotal: boolean = false;
    isMaster: boolean = false;
    groupId: number = 0;
    groupName: string = "";
    sequence: number = 0;
}
