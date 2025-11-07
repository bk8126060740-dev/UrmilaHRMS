import { SafeResourceUrl } from "@angular/platform-browser";

export interface IProject {
  success: boolean;
  message: string;
  data: ProjectDaum[];
}

export class ProjectDaum {
  id: number = 0;
  clientId: string = "";
  name: string = "";
  fileName: string = "";
  bankSheetId: number = 0;
  description: string = "";
  subLocation: string = "";
  projectNatureType: string = "";
  gstin: string = "";
  startDate: Date = new Date;
  endDate: Date = new Date;
  serviceCharge: number = 0;
  projectDeliveryModelType: number = 0;
  projectResourceType: number = 0;
  shift: number = 0;
  attendanceType: number = 0;
  paymentType: number = 0;
  projectStatus: string = "";
  projectResourceRequirement: string = "";
  bankName: string = "";
  projectManager: number | null = 0;
  leader1: number | null = 0;
  leader2: number | null = 0;
  profilePicFile?: File;
  profilePicPath?: string;
  projectStatusValue: string = "";
  projectAddendums: AddEnudumModel[] = [];
  serviceWindowsValue: [] = [];
  serviceWindowsName: string = "";
  labourLICNumber: string = "";
  paymentCycleDays: string = "";
  
  formattedStartDate?: string;
  formattedEndDate?: string;
  statusColorCode?: string;
  pfNumber: string = "";
  esiNumber: string = "";
}

export class ProjectModel {
  success: boolean = false;
  message: string = "";
  totalCount: number = 0;
  status: number = 0;
  statusCount: number = 0;
  data: ProjectDaum[] = []; 
  projectStatus: ProjectStatusModel[] = []; 
}



export class ProjectStatusModel {
  id: number = 0;
  name: string = "";
  count: number = 0;
  colorCode: string = "";
}

export class AddEnudumModel {
  addendumId: number = 0;
  title: string = "";
  description: string = "";
  location: string = "";
  document?: File;
  documentPath: string = "";
  documentUrl?: SafeResourceUrl;
  uploadAddEndNumsFlag: number = 0;
}

export class ClientDropdownModel {
  data: ClientDropdown[] = [];
  totalCount: number = 0;
  success: boolean = true;
  message: string = "";
  status: number = 0;
}

export class ClientDropdown {
  value: number = 0;
  text: string = "";
}

  
export class CodesByCodeTypeDropdownModel {
  data: CodeType[] = [];
  success: boolean = true;
  message: string = "";
  status: number = 0;
}

export interface CodeType {
  id: number;
  name: string;
  codes: Code[];
  isDefault: boolean;
}

export interface Code {
  id: number
  name: string
  enumItem: string
  isDefault: boolean
}

export class EmployeeDropdownModel {
  data: EmployeeDropdown[] = [];
  success: boolean = true;
  message: string = "";
  status: number = 0;
}


export class EmployeeDropdown {
  id: number = 0;
  fullName: string = "";
  employeeCode: string = "";
}

export class UserDropdown {
  id: number = 0;
  firstName: string = "";
  lastName: string = "";
  fullName: string = "";
  employeeCode: string = "";
}
