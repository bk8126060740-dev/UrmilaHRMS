export class EmployeeAttendanceUploadModel {
    id: number = 0;
    employeeId: number = 0;
    employeeName: string = "";
    totalWorkingDays: number = 0;
    paidDays: number = 0;
    nightDuty: number = 0;
    ghnhDuty: number = 0;
    direlmentInHour: number = 0;
    overtime: number = 0;
    projectAttendanceId: number = 0;
    resultMessage: string = "";
    resultCodeMessage: string = "";
    colorCode: string = "";
}

export class EmployeeAttendanceUploadModeldata {
    id: number = 0;
    projectId: number = 0;
    month: any;
    year: number = 0;
    totalWorkingDays: number = 0;
    statusId: number = 0;
    monthName: string = "";
    statusColorCode: string = "";
    statusName: string = "";
    srNo: number = 0;
}

export class statusCount {
    id: number = 0;
    count: number = 0;
    name: string = "";
    colorCode: string = "";
}

export class ProjectAttendaceIdModel {
    id: number = 0;
    projectAttendanceId: number = 0;
    fileName: string = "";
    description: string = "";
    uploadDate: Date = new Date;
    status: number = 0;
    colorCode: string = "";
    statusName: string = "";
    displayedFile: string = "";
    errorFile: string = "";
}

export class EmployeeAttendaceIdModel {
    id: number = 0;
    projectAttendanceId: number = 0;
    employeeId: number = 0;
    employeeName: string = "";
    totalWorkingDays: number = 0;
    paidDays: number = 0;
    nightDuty: number = 0;
    ghnhDuty: number = 0;
    direlmentInHour: number = 0;
    overtime: number = 0;
    resultMessage: number = 0;
    resultCodeMessage: string = "";
    colorCode: string = "";
}
