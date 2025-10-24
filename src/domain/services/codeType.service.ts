import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CodeTypeModel } from "../models/codeType.model";
import { ApiService } from "./base-service/api.service";

@Injectable({
  providedIn: "root",
})
export class CodeTypeService {
  constructor( private apiService: ApiService) {}

  getCodeType(URL: any ,params?:HttpParams): Observable<CodeTypeModel> {
    return this.apiService.get<CodeTypeModel>(URL , params)
  }

  postCodeType(Obj: any, URL: any): Observable<CodeTypeModel> {
    return this.apiService.post<CodeTypeModel>(URL , Obj);
  }

  putCodeType(Obj: any, URL: any): Observable<CodeTypeModel> {
    return this.apiService.put<CodeTypeModel>(URL, Obj);
  }

  deleteCodeType(URL: any , params: HttpParams): Observable<CodeTypeModel> {
    return this.apiService.delete<CodeTypeModel>(URL , params);
  }

}
