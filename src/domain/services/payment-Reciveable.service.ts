import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseResponse, BaseResponseModel } from "../models/base.model";
import { Observable } from "rxjs";
import { AppConstant } from "../../common/app-constant";


@Injectable({
    providedIn: 'root'
})

export class PaymentReciveableService {

    constructor(private apiService: ApiService, private http: HttpClient) { }

    getPaymentReciveable<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.get<BaseResponse<T>>(URL, params)
    }

         

    getDownloadTaxInvoice(url: string, params?: HttpParams): Observable<any> {
        return this.http.get(`${AppConstant.BASE_URL}${url}`, { params });
    }

    postDownloadTaxInvoice(url: string, formData?: FormData): Observable<Blob> {
        return this.http.post<Blob>(
            `${AppConstant.BASE_URL}${url}`,
            formData,
            { responseType: 'blob' as 'json' }
        );
    }

    getPaginationData<T>(URL: any, params?: HttpParams): Observable<BaseResponseModel<T>> {
        return this.apiService.get<BaseResponseModel<T>>(URL, params)
    }


    postPaymentReciveable<T>(URL: string, obj: any): Observable<BaseResponse<T>> {
        return this.apiService.post<BaseResponse<T>>(URL, obj);
    }

    putPaymentReciveable<T>(URL: string, obj: any,): Observable<BaseResponse<T>> {
        return this.apiService.put<BaseResponse<T>>(URL, obj);
    }

    deletePaymentReciveable<T>(URL: any, params: HttpParams): Observable<BaseResponse<T>> {
        return this.apiService.delete<BaseResponse<T>>(URL, params);
    }

}
