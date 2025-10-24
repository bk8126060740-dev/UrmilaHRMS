import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { Observable } from "rxjs";

import { HttpParams } from "@angular/common/http";
import {
  CodesByCodeTypeDropdownModel,
  EmployeeDropdownModel,
} from "../models/project.model";
import { BaseResponse } from "../models/base.model";
import { EmployeeAddrssData, EmployeeBasicDetails } from "../models/employee.model";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private apiService: ApiService) { }

  getEmployee<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.get<BaseResponse<T>>(URL, params);
  }

  putEmployee<T>(URL: any, Obj?: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.put<BaseResponse<T>>(URL, Obj, params);
  }

  postEmployee<T>(URL: any, Obj?: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.post<BaseResponse<T>>(URL, Obj, params);
  }

  deleteEmployee<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.delete<BaseResponse<T>>(URL, params);
  }

}


