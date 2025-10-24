import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./base-service/api.service";
import { BaseResponse } from "../models/base.model";

@Injectable({
    providedIn: "root",
})

export class EmployeeDesignationHistoryService {

    constructor(private apiService: ApiService) { }

    getEmployeeDesignationHistory<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    postEmployeeDesignationHistory<T>(Obj: any, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, Obj);
    }

}
