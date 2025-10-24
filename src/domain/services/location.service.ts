import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { LocationModel } from "../models/location.model";
import { HttpParams } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class LocationServices {

    constructor(private apiService : ApiService){

    }

    getState(URL: any){
        return this.apiService.get<LocationModel>(URL);
    }

    getCity(URL: any,params : HttpParams){
        return this.apiService.get<LocationModel>(URL,params);
    }
}
