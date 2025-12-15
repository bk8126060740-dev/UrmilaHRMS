export class Token {
  token: string = "";
  tokenType: string = "";
  expiresIn: number = 0;
  refreshToken: string = "";
  user: User = new User();
}

export class User {
  id: number = 0;
  fullName: string = "";
  emailId: string = "";
  profilePic: string = "";
  userTypeId: number = 0;
  isCheckIn: boolean = false;
  isHo: boolean = false;
  isOnboardComplete: boolean = false;
  designationId: string = "";
}

export class LoginModel {
  success: boolean = false
  message: string = ""
  data: Token = new Token
}

export class ReportModel {
  id: number = 0;
  title: string = "";
  destinationSourceId: number = 0;
  destinationSourceName?: string = "";
  inputSourceId: number = 0;
  inputSourceName?: string = "";
  customColumns!: CustomColumnModel[];
}

export class CustomColumnModel {
  id: number = 0;
  builderTableColumnId: number = 0;
  customName: string = "";
  order: number = 0;
}

export class ReportDestinationSourceModel {
  id: number = 0;
  name: string = "";
  enumItem: string = "";
  isDefault: boolean = false
}

export class userPropertyDataModel {
  id: number = 0;
  userProperty: string = "";
}

export class CustomColumn {
  id: number = 0;
  order: number = 0;
  builderTableColumnId: number = 0;
  customName: string = "";
}

export class DataModel {
  id: number = 0;
  title: string = "";
  destinationSourceId: number = 0;
  destinationSourceName: string = "";
  inputSourceId: number = 0;
  inputSourceName: string = "";
  customColumns!: CustomColumn[];
}
