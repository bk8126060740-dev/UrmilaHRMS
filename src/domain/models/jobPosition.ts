export class JobPositionResponseModel {
  data: jobPositionCreateRequestModel[] = [];
  success: boolean = false;
  message: string = "";
  status: number = 0;
  totalCount: number = 0;
}

export class jobPositionCreateRequestModel {
  hiringManagerEmployeeId: number = 0;
  noOfPosition: number = 0;
  ctcMin: number = 0;
  ctcMax: number = 0;
  ectcMin: number = 0;
  ectcMax: number = 0;
  experienceTypeId: number = 0;
  experienceMin: number = 0;
  experienceMax: number = 0;
  positionFilled: number = 0;
  status: number | null = 0;
  description: string = "";
  location: string = "";
  ageMin: number = 0;
  ageMax: number = 0;
  languages: string = "";
  note: string = "";
  departmentId: number = 0;
  desgnationId: number = 0;
  designationId: number = 0;
  desgnationName: string = "";
  role: string = "";
  modeId: number = 0;
  duration: string = "";
  startDate: string = "";
  endDate: string = "";
  skills: Skill[] = [];
  qualifications: Qualification[] = [];
}

export class jobPositionModel extends jobPositionCreateRequestModel {
  id: number = 0;
  projectName: string = "";
  hiringManagerEmployeeName: string = "";
  qualificationString: string = "";
  skillString: string = "";
}

export class jobPositionGetResponseModel {
  data: jobPositionModel = new jobPositionModel();
  success: boolean = false;
  message: string = "";
  status: number = 0;
}

export class jobPositionStatusModel {
  id: number = 0;
  name: string = "";
  count: number = 0;
  colorCode: string = "";
}

export class Skill {
  id: number = 0;
  skillName: string = "";
}

export class Qualification {
  id: number = 0;
  qualificationName: string = "";
  description: string = "";
}

export class Department {
  id: number = 0;
  departmentName: string = "";
  desciption: string = "";
}

export class DepartmentResponse {
  data: Department[] = [];
  totalCount: number = 0;
  success: boolean = false;
  message: string = "";
  status: number = 0;
}

export class HiringManager {
  id: number = 0;
  fullName: string = "";
}

export class HiringManagerResponse {
  data: HiringManager[] = [];
  success: boolean = false;
  message: string = "";
  status: number = 0;
}
