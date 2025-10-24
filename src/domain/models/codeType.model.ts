export interface ICodeType {
  success: boolean;
  message: string;
  data: Daum[];
}

export class Daum {
  id: number = 0;
  name?: string = "";
  enumName: string = "";
}

export class CodeTypeModel {
  success: boolean = false;
  message: string = "";
  totalCount: number = 0;
  data: Daum[] = [];
}
