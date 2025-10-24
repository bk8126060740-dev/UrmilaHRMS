import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './base-service/api.service';
import { BaseResponse } from '../models/base.model';

@Injectable({
    providedIn: 'root'
})

export class DepartmentMasterService {

    constructor(private apiService: ApiService) { }

    getDepartmentAllData<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    postDepartmentMaster<T>(formData: FormData, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, formData);
    }

    putDepartmentMaster<T>(formData: FormData, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, formData);
    }

    deleteDepartmentMaster<T>(URL: any, params: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL, params);
    }

    deleteReporting<T>(URL: any): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL);
    }

}
