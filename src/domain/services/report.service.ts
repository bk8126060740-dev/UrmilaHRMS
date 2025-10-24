import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { Observable } from "rxjs";
import { BaseResponse, DynamicApiResponse, DynamicArrayApiResponse } from '../models/base.model';
import { AppConstant } from '../../common/app-constant';

@Injectable({ providedIn: "root" })


export class ReportingService {

    constructor(private apiService: ApiService,
        private http: HttpClient,
    ) { }

    get<T>(URL: string, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    getObject<T>(URL: string, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    getArray(URL: string, params?: any): Observable<DynamicArrayApiResponse> {
        return this.apiService.post<DynamicArrayApiResponse>(URL, params)
    }


    getObj<T>(URL: string, obj?: any): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, obj)
    }

    post<T>(URL: string, body: any): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, body)
    }

    delete<T>(URL: string, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL, params)
    }

    put<T>(URL: string, body: any): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, body)
    }

    getDownloadFile(url: string, params?: any): Observable<Blob> {
        return this.http.post<Blob>(`${AppConstant.BASE_URL}${url}`, params, {
            // Attach query parameters if available
            responseType: 'blob' as 'json'// Ensure only the Blob is returned
        });
    }
}
