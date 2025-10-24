import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './base-service/api.service';
import { BaseResponse } from '../models/base.model';

@Injectable({
    providedIn: 'root'
})

export class PayrollService {

    constructor(private apiService: ApiService) { }

    getPayrollAllData<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    getPayrollById<T>(URL: string): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL);
    }

    postPayroll<T>(Obj: any, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, Obj);
    }

    putPayroll<T>(Obj: any, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, Obj);
    }

    deletePayrollById<T>(URL: string, obj?: any): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL, obj);
    }

    deletePayroll<T>(URL: string, obj: any): Observable<BaseResponse<T>> {
        return this.apiService.deleteWithBody<BaseResponse<T>>(URL, obj);
    }

}
