import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstant } from '../../common/app-constant';
import { BaseResponse, ProjectAttendaceBaseResponse } from '../models/base.model';
import { ApiService } from './base-service/api.service';

@Injectable({
    providedIn: 'root'
})

export class EmployeeAttendanceService {

    constructor(private http: HttpClient, private apiService: ApiService) { }

    getEmployeeAttendanceFile(url: string, params?: HttpParams): Observable<Blob> {
        return this.http.get(`${AppConstant.BASE_URL}${url}`, {
            responseType: 'blob',
            params: params
        });
    }

    getDownloadUploadFile(url: string, params?: HttpParams): Observable<Blob> {
        return this.http.get(`${AppConstant.BASE_URL}${url}`, {
            responseType: 'blob',
            params: params
        });
    }

    getEmployeeAttendanceUpload<T, U = void>(URL: any, params?: HttpParams): Observable<ProjectAttendaceBaseResponse<T, U>> {
        return this.apiService.get<ProjectAttendaceBaseResponse<T, U>>(URL, params)
    }

    postEmployeeAttendanceUpload<T>(formData: any, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, formData);
    }

    putEmployeeAttendanceUpload<T>(formData: FormData, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, formData);
    }

    putProjectAttendanceStatus<T>(formData: FormData, URL: string): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, formData);
    }
    postEmployeeDesignation<T>(URL: string, body: any): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, body);
    }

}
