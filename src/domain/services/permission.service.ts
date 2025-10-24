import { HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { Observable } from "rxjs";
import { BaseResponse } from '../models/base.model';

@Injectable({ providedIn: "root" })


export class PermissionService {

    constructor(private apiService: ApiService) { }

    getAPI<T>(URL: string, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }
    postAPI<T>(URL: string, body: any): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, body)
    }
    deleteAPI<T>(URL: string, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL, params)
    }

    putAPI<T>(URL: string, body: any): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, body)
    }



















}
