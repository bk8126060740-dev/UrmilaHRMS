export class ProjectHolidayCalenderModel {
    totalCount : number =0
    data :any[] = [] ;
    success: boolean = false;
    message: string = "";
}

export class ProjectHolidayCalenderDaum  {  
    id: number=0;
    projectId: number= 0;
    date:string= '';
    holidayDescription:string= '';
    holidayType:string= '';
    weekOff : number[] = [];
    isHalfDay:boolean= false;
    isHalfDayName?:string ='';
    formattedDate?:string=''
}
