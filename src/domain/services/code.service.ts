import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { CodeModel } from "../models/code.model";
import { ApiService } from "./base-service/api.service";
import { HttpParams } from "@angular/common/http";
import { CodesByCodeTypeDropdownModel } from "../models/project.model";

@Injectable({
  providedIn: "root",
})
export class CodeService {
  constructor(private apiService: ApiService) {}

  getCodes(URL: any,params?:HttpParams): Observable<CodeModel> {
    return this.apiService.get<CodeModel>(URL,params);
  }

  deleteCode(URL: any): Observable<CodeModel> {
    return this.apiService.delete<CodeModel>(URL);
  }

  postCode(Obj: any, URL: any): Observable<CodeModel> {
    return this.apiService.post<CodeModel>(URL, Obj);
  }
  putCode(Obj: any, URL: any, params?: HttpParams): Observable<CodeModel> {
    return this.apiService.put<CodeModel>(URL, Obj, params);
  }
  patchCode(Obj: any, URL: any): Observable<CodeModel> {
    return this.apiService.patch<CodeModel>(URL, Obj);
  }
  
  getAllCodesByCodeTypesDropdownData(obj: any, URL: string): Observable<CodesByCodeTypeDropdownModel> {
    return this.apiService.post<CodesByCodeTypeDropdownModel>(URL, obj);
  }
}
