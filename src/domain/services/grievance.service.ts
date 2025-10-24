import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstant } from '../../common/app-constant';
import { BaseResponse } from '../models/base.model';
import { ApiService } from './base-service/api.service';

@Injectable({
    providedIn: 'root'
})

export class GrievanceService {

    constructor(private apiService: ApiService, private http: HttpClient,) { }

    getGrievanceAllData<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    postGrievanceComment<T>(formData: FormData, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, formData);
    }

    postAssignTicket<T>(Obj: any, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, Obj);
    }

    getDownloadAttechFile(url: string, params?: HttpParams): Observable<Blob> {
        return this.http.get(`${AppConstant.BASE_URL}${url}`, {
            responseType: 'blob',
            params: params
        });
    }

    putCustomReport<T>(URL: string, Obj: any,): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, Obj);
    }


}
