import { Injectable } from '@angular/core';
import { ApiService } from './base-service/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PayrollAttributeModel } from '../models/payrollAttribute.model';

@Injectable({
  providedIn: 'root'
})
export class payrollAttributeService {

  constructor( private apiService: ApiService ) {}

  getPayrollAttribute(URL: any , params?:HttpParams): Observable<PayrollAttributeModel> {
    return this.apiService.get<PayrollAttributeModel>(URL , params)
  }

  postPayrollAttribute(Obj: any, URL: any): Observable<PayrollAttributeModel> {
    return this.apiService.post<PayrollAttributeModel>(URL , Obj);
  }

  putPayrollAttribute(Obj: any, URL: any, params: HttpParams): Observable<PayrollAttributeModel> {
    return this.apiService.put<PayrollAttributeModel>(URL, Obj, params);
  }

  deletePayrollAttribute(URL: any, params: HttpParams): Observable<PayrollAttributeModel> {
    return this.apiService.delete<PayrollAttributeModel>(URL,params);
  }

  
}
