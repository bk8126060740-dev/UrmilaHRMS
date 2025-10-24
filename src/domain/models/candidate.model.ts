export class Candidate {
  id: number = 0;
  firstName: string = "";
  midName: string = "";
  lastName: string = "";
  dob: string = "";
  gender: number = 0;
  status: number = 0;
  statusName: string = "";
  tdoj: Date = new Date();
  referralId: number = 0;
  email: string = "";
  mobileNumber: string = "";
  maritalStatus: number = 0;
  maritalStatusName: string = "";
  nationalityType: number = 0;
  nationalityName: string = "";
  preferanceType: number = 0;
  preferanceName: string = "";
  bloodGroup: string = "";
  name: string = "";
  jobId: number = 0;
  jobTitle: string = "";
  genderName: string = "";
  referralName: string = "";
  uploadResume: string = "";
  ctc: number = 0;

  formattedTdoj?: string;
}

export class CandidateSalaryBreakdown {
  id: number = 0;
  candidate: CandidateOfferLatter = new CandidateOfferLatter();
  basicSalary: number = 0;
  hra: number = 0;
  conveyanceAllowance: number = 0;
  grossSalary: number = 0;
  employerPF: number = 0;
  employerESIC: number = 0;
  employeePF: number = 0;
  employeeESIC: number = 0;
  medicalInsurance: number = 0;
}

export class CandidateOfferLatter {
  id: number = 0;
  name: string = "";
  designation: string = "";
  projectName: string = "";
  filePath: string = "";
}

export class ProjectStatus {
  id: number = 0;
  name: string = "";
  count: number = 0;
  colorCode: string = "";
}

export class CandidateAddrssData {
  communicationAddress: CommunicationAddress = new CommunicationAddress();
  permanentAddress: PermanentAddress = new PermanentAddress();
}

export class CommunicationAddress {
  id: number = 0;
  candidateId: number = 0;
  addressLine1: string = "";
  addressLine2: string = "";
  city: string = "";
  cityId: number = 0;
  state: string = "";
  stateId: number = 0;
  zipCode: string = "";
  landmark: string = "";
  country: string = "";
  addressType: number = 0;
}

export class PermanentAddress {
  id: number = 0;
  candidateId: number = 0;
  addressLine1: string = "";
  addressLine2: string = "";
  city: string = "";
  cityId: number = 0;
  state: string = "";
  stateId: number = 0;
  zipCode: string = "";
  landmark: string = "";
  country: string = "";
  addressType: number = 0;
}

export class JobPositionList {
  id: number = 0;
  name: string = "";
}

export class HROfferSent {
  id: number = 0;
  name: string = "";
}

export class OfferStatus {
  id: number = 0;
  candidateId: number = 0;
  hiringManagerEmployeeId: number = 0;
  doj: any;
  onBoardingLink: any;
  statusId: number = 0;
  comments: string = "";
}

export class BulkOfferSent {
  ctc: number = 0;
  candidates: number[] = [];
}

export class Status {
  id: number = 0;
  name: string = "";
  colorCode: string = "";
  allowStatus: AllowStatus[] = [];
}

export class AllowStatus {
  id: number = 0;
  name: string = "";
  colorCode: string = "";
  allowStatus: any[] = [];
}
