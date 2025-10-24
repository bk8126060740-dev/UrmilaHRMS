export class ProjectPayrollAttributeModel {
  totalCount: number = 0;
  data: ProjectPayrollAttributeDaum[] = [];
  success: boolean = false;
  message: string = "";
  status: number = 0;
  payrollAttributeName: string = "";
}

export class ProjectPayrollAttributeDaum {
  groupId: number | null = 0;
  groupName: string = "";
  sequence: number = 0;
  allowOverride: boolean = false;
  defaultValue: number = 0;
  id: number = 0;
  isCalculated: boolean = false;
  payrollAttributeId: number = 0;
  projectId: number = 0;
  payrollAttributeName: string = "";
  projectName: string = "";
  isSelected: boolean = false;
  formula: AttriuteFormulla[] = [];
}

export class GetProjectPayrollAttributeWithoutFilterModel {
  data: GetProjectPayrollAttributeWithoutFilter[] = [];
  totalCount: number = 0;
  success: boolean = false;
  message: string = "";
  status: number = 0;
}

export class GetProjectPayrollAttributeWithoutFilter {
  id: number = 0;
  name: string = "";
  isDeductable: boolean = false;
  isPercentage: boolean = false;
  isCalculated: boolean = false;
  isActive: boolean = false;
  isAttendance: boolean = false;
  visible: boolean = true;
}

export class Formulla {
  id: number = 0;
  name: string = "";
  acId: number = 0;
  isAttribute: boolean = false;
  isOperator: boolean = false;
  isDefault: boolean = false;
  defaultValue: number = 0;
  order: number = 0;
}

export class RequestedBody {
  id: number = 0;
  projectId: number = 1;
  payrollAttributeId: number = 1;
  isCalculated: boolean = true;
  defaultValue: number = 0;
  allowOverride: boolean = true;
  payrollAttributeName: string = "";
  formulas: AttriuteFormulla[] = [];
}

export interface AttriuteFormulla {
  id: number | null;
  sequence: number;
  sourceProjectPayrollAttributeId: number | null;
  fixedValue: number | null;
  operator: string | null;
}
