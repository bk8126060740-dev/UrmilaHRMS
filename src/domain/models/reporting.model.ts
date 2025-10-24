export class CustomReportTemplateList {
    id: number = 0;
    title: string = "";
    destinationSourceId: number = 0;
    destinationSourceName: string = "";
    inputSourceId: number = 0;
    inputSourceName: string = "";
    columnCount: number = 0;
    customReportColumnTableList: CustomReportColumnTableList[] = [];
}

export class CustomReportColumnTableList {
    id: any = null;
    customReportTemplateId: number = 0;
    builderTableColumnId: number = 0;
    builderTableColumnName: string = "";
    customName: string = "";
    order: number = 0;
}


export class BuilderTableIdAndName {
    id: number = 0;
    userProperty: string = "";
}

export class ApprovedPayroll {
    id: number = 0;
    name: string = "";
    month: number = 0;
    year: number = 0;
    displayName: string = "";
}




export class DynamicList {
    name: string = "";
    lable: string = "";
    type: string = "";
    isOptional: boolean = false;
    values: Value[] = [];
}

export class Value {
    key: number = 0;
    keyValue: any;
    childValue?: DynamicList = new DynamicList()
}
