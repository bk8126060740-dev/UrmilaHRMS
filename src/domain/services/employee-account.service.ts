import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstant } from '../../common/app-constant';
import { BaseResponse } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAccountService {
  constructor(private http: HttpClient,
    ) { }

    post<T>(url: string,body:any): Observable<BaseResponse<T>> {  
    return this.http.post<BaseResponse<T>>(`${AppConstant.BASE_URL}${url}`,body);
  }
}
