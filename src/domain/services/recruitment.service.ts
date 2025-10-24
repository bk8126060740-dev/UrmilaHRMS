import {
  DepartmentResponse,
  HiringManagerResponse,
  JobPositionResponseModel,
  jobPositionCreateRequestModel,
  jobPositionGetResponseModel,
} from "./../models/jobPosition";
import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { ProjectDropdownModel } from "../models/recruitment.model";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class RecruitmentService {
  constructor(private apiService: ApiService) { }

  getProjectDropdownData(URL: any, params?: HttpParams): Observable<ProjectDropdownModel> {
    return this.apiService.get<ProjectDropdownModel>(URL, params);
  }

  getDepartmentDropdownData(URL: any, params?: HttpParams): Observable<DepartmentResponse> {
    return this.apiService.get<DepartmentResponse>(URL, params);
  }

  getHiringManagerDropdownData(URL: any, params?: HttpParams): Observable<HiringManagerResponse> {
    return this.apiService.get<HiringManagerResponse>(URL, params);
  }

  postJobPosition(URL: any, jobPosition: jobPositionCreateRequestModel): Observable<JobPositionResponseModel> {
    return this.apiService.post<JobPositionResponseModel>(URL, jobPosition);
  }
  putJobPosition(URL: any, jobPosition: jobPositionCreateRequestModel): Observable<JobPositionResponseModel> {
    return this.apiService.put<JobPositionResponseModel>(URL, jobPosition);
  }

  getJobPosition(URL: any, params?: HttpParams): Observable<JobPositionResponseModel> {
    return this.apiService.get<JobPositionResponseModel>(URL, params);
  }

  getJobPositionById(URL: any, params?: HttpParams): Observable<jobPositionGetResponseModel> {
    return this.apiService.get<jobPositionGetResponseModel>(URL, params);
  }

  deleteJobPosition(URL: any, params?: HttpParams): Observable<JobPositionResponseModel> {
    return this.apiService.delete<JobPositionResponseModel>(URL, params);
  }
}
