export class ProjectHistoryDetails {
    id: number = 0;
    employeeId: number = 0;
    projectId: number = 0;
    projectName: string = "";
    startDate: Date = new Date();
    endDate: Date = new Date();
    role: string = "";
    formattedStartDate?: string;
    formattedEndDate?: string;
}

export class getProjectNameModel {
    id: number = 0;
    name: string = "";
}
