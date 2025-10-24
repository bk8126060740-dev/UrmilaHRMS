import { Injectable } from '@angular/core';
import { ApiService } from './base-service/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { GetProjectPayrollAttributeWithoutFilterModel, ProjectPayrollAttributeModel } from '../models/projectPayrollAttribute.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectPayrollAttributeService {

  constructor( private apiService: ApiService ) {}

  getProjectPayrollAttribute(URL: any , params?:HttpParams): Observable<ProjectPayrollAttributeModel> {
    return this.apiService.get<ProjectPayrollAttributeModel>(URL , params);
  }

  getAllProjectPayrollAttributeWithoutFilter(URL: any , params?:HttpParams): Observable<GetProjectPayrollAttributeWithoutFilterModel> {
    return this.apiService.get<GetProjectPayrollAttributeWithoutFilterModel>(URL , params);
  }

  postProjectPayrollAttribute(Obj: any, URL: any): Observable<ProjectPayrollAttributeModel> {
    return this.apiService.post<ProjectPayrollAttributeModel>(URL , Obj);
  }

  putProjectPayrollAttribute(Obj: any, URL: any, params?: HttpParams): Observable<ProjectPayrollAttributeModel> {
    return this.apiService.put<ProjectPayrollAttributeModel>(URL, Obj, params);
  }

  deleteProjectPayrollAttribute(URL: any, params: HttpParams): Observable<ProjectPayrollAttributeModel> {
    return this.apiService.delete<ProjectPayrollAttributeModel>(URL,params);
  }

  
}
