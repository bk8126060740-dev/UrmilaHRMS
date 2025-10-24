import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './base-service/api.service';
import { BaseResponse } from '../models/base.model';

@Injectable({
    providedIn: 'root'
})

export class BankResourceMasterService {

    constructor(private apiService: ApiService) { }

    getBankResource<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    postBankResource<T>(URL: string, obj: any): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, obj);
    }

    putBankResource<T>(URL: string, obj: any,): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, obj);
    }

    deleteBankResource<T>(URL: any, params: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL, params);
    }

}
