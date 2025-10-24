import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { CodeModel } from "../models/code.model";
import { ApiService } from "./base-service/api.service";
import { HttpParams } from "@angular/common/http";
import { BaseResponse } from "../models/base.model";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  constructor(private apiService: ApiService) { }

  getMenu<T>(URL: any): Observable<BaseResponse<T>> {
    return this.apiService.get<BaseResponse<T>>(URL);
  }


}
