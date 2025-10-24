export class LocationModel {
    totalCount : number =0
    data :LocationData[] = [] ;
    success: boolean = false;
    message: string = "";
}

export class LocationData  {  
    id: number=0;
    stateId: number = 0;
    cityName: string= ''
    stateName:string= '';
}
