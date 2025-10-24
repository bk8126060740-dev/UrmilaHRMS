export interface ICode {
    success: boolean;
    message: string;
    data: codeDaum[];
  }
  
  export class codeDaum {
    id: number = 0; 
    codeTypeId: number = 0;
    name?: string = "";
    enumItem: string = ""; 
    isDefault: boolean = true; 
    isActive: boolean = true; 
  }
  
  export class CodeModel {
    success: boolean = false;
    message: string = "";
    totalCount: number = 0;
    data: codeDaum[] = []; 
  }
  
