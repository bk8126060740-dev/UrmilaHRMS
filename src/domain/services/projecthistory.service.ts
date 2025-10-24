import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { BaseResponse } from "../models/base.model";

@Injectable({
    providedIn: 'root'
})

export class ProjectHistoryService {

    constructor(private apiService: ApiService) { }

    getAllProjectHistory<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    postProjectHistory<T>(URL: any, obj?: any): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, obj)
    }

    putProjectHistory<T>(URL: any, obj: any): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, obj)
    }

    deleteProjectHistory<T>(URL: any): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL)
    }

}
