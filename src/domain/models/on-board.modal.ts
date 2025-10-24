export class BaseModel {
  success: boolean = false;
  message: string = "";
  totalCount: number = 0;
  status: number = 0;
  statusCount: number = 0;
  data: EmployeeOnBoardData[] = [];
  onBoardingStatus: onBoardingStatus[] = [];
}
export class EmployeeOnBoardData {
  id: number = 0;
  fileName: string = "";
  description: string = "";
  userId: number = 0;
  uploadDate: Date = new Date;
  status: number = 0;
  statusName: string = "";
  colorCode: string = "";
  success: number = 0;
  error: number = 0;
  archiveFile: string = "";
  errorFile: string = "";
  originalFilePath?: string;
  uploadedFilePath?: string;
  formatteduploadDate?: string;
  statusColorCode: string = "";
}


export class onBoardingStatus {
  id: number = 0;
  name: string = "";
  count: number = 0;
  colorCode: string = "";
}
