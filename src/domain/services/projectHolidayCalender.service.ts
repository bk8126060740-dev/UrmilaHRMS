import { Injectable } from '@angular/core';
import { ApiService } from './base-service/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ProjectHolidayCalenderModel } from '../models/projectHolidayCalender.model';

@Injectable({
  providedIn: 'root'
})
export class projectHolidayCalenderService {

  constructor( private apiService: ApiService ) {}

  getProjectHolidayCalender(URL: any , params?:HttpParams): Observable<ProjectHolidayCalenderModel> {
    return this.apiService.get<ProjectHolidayCalenderModel>(URL , params)
  }

  postProjectHolidayCalender(Obj: any, URL: any): Observable<ProjectHolidayCalenderModel> {
    return this.apiService.post<ProjectHolidayCalenderModel>(URL , Obj);
  }

  putProjectHolidayCalender(Obj: any, URL: any, params: HttpParams): Observable<ProjectHolidayCalenderModel> {
    return this.apiService.put<ProjectHolidayCalenderModel>(URL, Obj, params);
  }

  deleteProjectHolidayCalender(URL: any, params: HttpParams): Observable<ProjectHolidayCalenderModel> {
    return this.apiService.delete<ProjectHolidayCalenderModel>(URL,params);
  }
}
