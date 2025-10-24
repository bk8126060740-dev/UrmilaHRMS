import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { BaseResponse, BaseResponseModel } from "../models/base.model";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppConstant } from "../../common/app-constant";


@Injectable({
    providedIn: 'root'
})

export class PaymentReciveableReportService {

    constructor(private apiService: ApiService, private http: HttpClient) { }

    getPaymentReciveableReport<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

    getPaginationData<T>(URL: any, params?: HttpParams): Observable<BaseResponseModel<T>> {
        return this.apiService.get<BaseResponseModel<T>>(URL, params)
    }

    postPaymentReciveableReport<T>(URL: string, obj: any): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, obj);
    }

    putPaymentReciveableReport<T>(URL: string, obj: any,): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, obj);
    }

    deletePaymentReciveableReport<T>(URL: any, params: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL, params);
    }

    downloadPaymentReceviableReport(url: string, params?: HttpParams): Observable<Blob> {
        return this.http.get(`${AppConstant.BASE_URL}${url}`, {
            responseType: 'blob',
            params: params
        });
    }

}
