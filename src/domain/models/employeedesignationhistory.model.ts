export class EmployeeDesignationHistoryModel {
    id: number = 0;
    employeeId: number = 0;
    designationId: number = 0;
    designationName: string = '';
    isCurrent!: boolean;
}
