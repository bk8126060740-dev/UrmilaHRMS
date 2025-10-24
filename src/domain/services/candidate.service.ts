import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { Observable } from "rxjs";

import { HttpParams } from "@angular/common/http";
import { BaseResponse, CandidateBaseResponse } from "../models/base.model";

@Injectable({
  providedIn: "root",
})
export class CandidateService {
  constructor(private apiService: ApiService) { }

  getCandidate<T, U = void>(URL: any, params?: HttpParams): Observable<CandidateBaseResponse<T, U>> {
    return this.apiService.get<CandidateBaseResponse<T, U>>(URL, params);
  }

  putCandidate<T>(URL: any, Obj?: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.put<BaseResponse<T>>(URL, Obj, params);
  }

  postCandidate<T>(URL: any, Obj?: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.post<BaseResponse<T>>(URL, Obj, params);
  }

  post<T>(URL: any, params: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.post<BaseResponse<T>>(URL, null, params);
  }

  deleteCandidate<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.delete<BaseResponse<T>>(URL, params);
  }

}


