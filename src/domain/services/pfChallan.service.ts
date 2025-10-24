import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseResponse, BaseResponseModel, PfChallanBaseResponse } from "../models/base.model";
import { Observable } from "rxjs";
import { AppConstant } from "../../common/app-constant";


@Injectable({
    providedIn: 'root'
})

export class PfChallanService {

    constructor(private apiService: ApiService, private http: HttpClient) { }

    getPfChallan<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    getDownloadPfChallan(url: string, params?: HttpParams): Observable<Blob> {
        return this.http.get(`${AppConstant.BASE_URL}${url}`, {
            responseType: 'blob',
            params: params
        });
    }

    postDownloadPfChallan(url: string, formData?: FormData): Observable<Blob> {
        return this.http.post<Blob>(
            `${AppConstant.BASE_URL}${url}`,
            formData,
            { responseType: 'blob' as 'json' }
        );
    }



    getPaginationData<T>(URL: any, params?: HttpParams): Observable<BaseResponseModel<T>> {
        return this.apiService.get<BaseResponseModel<T>>(URL, params)
    }

    getPaginationDataNew<T, U>(URL: any, params?: HttpParams): Observable<PfChallanBaseResponse<T, U>> {
        return this.apiService.get<PfChallanBaseResponse<T, U>>(URL, params)
    }


    postPfChallan<T>(URL: string, obj: any): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, obj);
    }

    putPfChallan<T>(URL: string, obj: any,): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, obj);
    }

    deletePfChallan<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL, params);
    }

}
