export class Employee {
  id: number = 0;
  fullName: string = "";
  profilePath: string = "";
  firstName: string = "";
  midName: string = "";
  lastName: string = "";
  dateOfBirth: Date = new Date();
  gender: number = 0;
  genderName: string = "";
  status: number = 0;
  statusName: string = "";
  doj: Date = new Date();
  pfRegistrationDate: Date = new Date();
  esicRegistrationDate: Date = new Date();
  email: string = "";
  mobileNumber: string = "";
  maritalStatus: number = 0;
  maritalStatusName: string = "";
  nationalityType: number = 0;
  nationalityName: string = "";
  preferanceType: number = 0;
  preferanceName: string = "";
  bloodGroup: string = "";
  designation: number = 0;
  designationName: string = "";
  formattedDOJ?: string;
  formattedpfRegistrationDate?: string;
  formattedesicRegistrationDate?: string;
  candidateId: number = 0
  employeeId: number = 0
}

export class EmployeeStatus {
  id: number = 0;
  name: string = "";
  count: number = 0;
  colorCode: string = "";
}

export class EmployeeBasicDetails {
  Id: number = 0;
  id: number = 0;
  profilePath: string = "";
  firstName: string = "";
  midName: string = "";
  lastName: string = "";
  dateOfBirth: string = "";
  gender: number = 0;
  genderName: string = "";
  status: number = 0;
  statusName: string = "";
  doj: string = "";
  email: string = "";
  mobileNumber: string = "";
  maritalStatus: number = 0;
  maritalStatusName: string = "";
  nationalityType: number = 0;
  nationalityName: string = "";
  preferanceType: number = 0;
  preferanceName: string = "";
  bloodGroup: string = "";
  designation: any = 0;
  designationName: any = "";
  tdoj: string = "";
  dob: string = "";
  uploadResume: string = "";
  referralId: number = 0;
  referralEmpName: string = "";
  referralEmpId: number = 0;
  bkcRegNo: string = "";
  isRailwayRetired: boolean = false;
  isWagesRate: boolean = false;
  offerLetter: string = "";
  salarySlips: SalarySlips[] = [];
}

export class SalarySlips {
  id: number = 0;
  month: string = "";
  year: number = 0;
}

export class EmployeeAddrssData {
  communicationAddress: CommunicationAddress = new CommunicationAddress();
  permanentAddress: PermanentAddress = new PermanentAddress();
}

export class CommunicationAddress {
  id: number = 0;
  candidateId: number = 0;
  employeeId: number = 0;
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
  postalCode: string = "";
}

export class PermanentAddress {
  id: number = 0;
  candidateId: number = 0;
  employeeId: number = 0;
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
  postalCode: string = "";
}

export class Experience {
  id: number = 0;
  employeeId: number = 0;
  candidateId: number = 0;
  companyName: string = "";
  company: string = "";
  jobTitle: string = "";
  startDate: Date = new Date();
  endDate: Date = new Date();
  location: string = "";
  designationRole: string = "";
  experienceCertificateDoc: any;
  responsibilities: string = "";

  formattedStartDate?: string;
  formattedEndDate?: string;
}

export class Qualification {
  id: number = 0;
  employeeId: number = 0;
  candidateId: number = 0;
  qualificationTypeId: number = 0;
  qualificationTypeName: string = "";
  degree: string = "";
  institution: string = "";
  fieldOfStudy: string = "";
  startDate: Date = new Date();
  endDate: Date = new Date();
  yearOfPassing: number = 0;
  grade: string = "";
  document: string = "";

  formattedStartDate?: string;
  formattedEndDate?: string;
}

export class SalarySlip {
  id: number = 0;
  employeeId: number = 0;
  companyName: string = "";
  monthYear: string = "";
  salaryAmount: number = 0;
  salarySlipDoc: any;
}

export class FinanceDetails {
  id: number = 0;
  employeeId: number = 0;
  type: string = "";
  name: string = "";
  number: string = "";
  accountType: string = "";
  attachmentFile: string = "";
  ifscCode: string = "";
  attachmentURL: string = "";
}
export class ContactInfos {
  id: number = 0;
  employeeId: number = 0;
  emergencyContactName: string = "";
  emergencyContactRelation: string = "";
  emergencyContactPhone: string = "";
}
export class FamilyDetails {
  id: number = 0;
  employeeId: number = 0;
  relation: string = "";
  name: string = "";
  age: number = 0;
  mobileNumber: string = "";
}
export class DocumentData {
  id: number = 0;
  employeeId: number = 0;
  documentTypeId: number = 0;
  documentType: string = "";
  documentName: string = "";
  documentPath: string = "";
  documentNumber: string = "";
  createDate: any = "";
  attachmentURL: string = "";
}
export class PFAccountDetail {
  id: number = 0;
  employeeId: number = 0;
  uaNno: string = "";
  pfNumber: string = "";
  uploadDocument: string = "";
  pfRegistrationDate: string = "";
}
export class EsicDetail {
  id: number = 0;
  employeeId: number = 0;
  accountNumber: string = "";
  esicNumber: string = "";
  esicRegistrationDate: string = "";
  uploadDocument: string = "";
}
export class EmployeePayrollAttribute {
  attributes: PayrollAttribute[] = [];
  isDailyWagesRate: boolean = false;
}
export class PayrollAttribute {
  projectPayrollAttributeId: number = 0;
  payrollAttributeId: number = 0;
  name: string = "";
  defaultValue: number = 0;
  allowOverride: boolean = false;
  isCalculated: boolean = false;
  isDisabled: boolean = false;
}
export class Agency {
  id: number = 0;
  name: string = "";
  address: string = "";
  description: string = "";
  isActive: boolean = false;
}
export class BGVerification {
  id: number = 0;
  employeeId: number = 0;
  verificationTypeId: number = 0;
  verificationType: string = "";
  agencyId: number = 0;
  agencyName: string = "";
  verificationStatus: string = "";
  verificationDate: string = "";
  remarks: string = "";
  visibility: boolean = false;
}
export class DocumentType {
  id: number = 0;
  documentType: string = "";
  description: string = "";
}
