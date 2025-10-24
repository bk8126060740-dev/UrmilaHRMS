import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseResponse } from "../models/base.model";

@Injectable({
  providedIn: "root",
})
export class AccountreportService {
  constructor(private apiService: ApiService) { }

  getAccountreport<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.get<BaseResponse<T>>(URL, params);
  }

  putAccountreport<T>(URL: any, Obj?: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.put<BaseResponse<T>>(URL, Obj, params);
  }

  postAccountreport<T>(URL: any, Obj?: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.post<BaseResponse<T>>(URL, Obj, params);
  }

  deleteAccountreport<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.delete<BaseResponse<T>>(URL, params);
  }

}


