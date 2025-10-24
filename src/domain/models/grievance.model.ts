export class GrievanceModel {
    id: number = 0;
    grievanceNumber: string = "";
    employeeCode: string = "";
    employeeId: number = 0;
    employeeName: string = "";
    userId: number = 0;
    inputTypeId: number = 0;
    inputTypeName: string = "";
    classificationTypeId: number = 0;
    classificationTypeName: string = "";
    subClassificationId: number = 0;
    subClassificationName: string = "";
    description: string = "";
    resolutionComments: string = "";
    statusId: number = 0;
    statusName: string = "";
    statusColorCode: string = "";
    priorityId: number = 0;
    priorityName: string = "";
    priorityColorCode: string = "";
    assignedEmployeeId: number = 0;
    assignedEmployeeName: string = "";
    grievanceTypeId: number = 0;
    grievanceTypeName: string = "";
}

export class GrievanceStatusModel {
    id: number = 0;
    count: number = 0;
    name: string = "";
    colorCode: string = "";
}

export class GrievanceCommentModel {
    id: number = 0;
    employeeId: number = 0;
    employeeName: string = "";
    assignedEmployeeId: number = 0;
    assignedEmployeeName: string = "";
    grievanceId: number = 0;
    description: string = "";
    createdTime: string = "";
    attachments: GrievanceCommenAttechmentModel[] = [];
    empInfo: EmployeeInfo | null = null;
    replyInfo: EmployeeInfo | null = null;
    profilePic: string = "";
}

export class EmployeeInfo {
    userId: Number | null = null;
    id: number | null = null;
    name: string = "";
    profilePic: string | null = null;
}

export class GrievanceCommenAttechmentModel {
    id: number = 0;
    commentId: number = 0;
    attachment: string = "";
}

export class AssignTicketModel {
    grievanceIds: number[] = [];
    assignEmployeeId: number = 0;
}

export class HoIdAndNameModel {
    designations: number = 0;
}

export class CraeteTicketModel {
    employeeId: number = 0;
    inputTypeId: number = 0;
    classificationTypeId: number = 0;
    subClassificationId: number = 0;
    description: string = "";
}

export class Employee {
    userId: number = 0;
    id: number = 0;
    fullName: string = "";
    employeeCode: string = "";
}

export class ProjectId {
    id: number = 0;
    name: string = "";
}

export class statusdataModel {
    id: number = 0;
    name: string = "";
    enumItem: string = "";
    isDefault: boolean = false;
}
