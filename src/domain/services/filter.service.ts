import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { CodeModel } from "../models/code.model";
import { ApiService } from "./base-service/api.service";
import { HttpParams } from "@angular/common/http";
import { FilterModel } from "../models/filter.model";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  constructor(private apiService: ApiService) {}

  getFilter(URL: any,params?:HttpParams): Observable<FilterModel> {
    return this.apiService.get<FilterModel>(URL,params);
  }
}
