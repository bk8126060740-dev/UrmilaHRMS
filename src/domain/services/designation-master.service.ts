import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './base-service/api.service';
import { BaseResponse } from '../models/base.model';

@Injectable({
    providedIn: 'root'
})

export class DesignationMasterService {

    constructor(private apiService: ApiService) { }

    getDesignationAllData<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    postDesignationMaster<T>(obj: any, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, obj);
    }

    putDesignationMaster<T>(obj: any, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, obj);
    }

    deleteDesignationMaster<T>(URL: any, params: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL, params);
    }

    deleteReporting<T>(URL: any): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL);
    }

}
