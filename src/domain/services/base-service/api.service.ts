import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConstant } from '../../../common/app-constant';
import { HttpResponse } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient,
  ) { }

  get<T>(url: string, params?: HttpParams): Observable<T> {
    const options = { params };
    return this.http.get<T>(`${AppConstant.BASE_URL}${url}`, options);
  }

  post<T>(url: string, body: any, params?: HttpParams): Observable<T> {
    const options = { params };

    return this.http.post<T>(`${AppConstant.BASE_URL}${url}`, body, options);
  }

  postFormData<T>(url: string, formData?: FormData, params?: HttpParams): Observable<T> {
    const options = { params };
    return this.http.post<T>(`${AppConstant.BASE_URL}${url}`, formData, options);
  }
  delete<T>(url: string, params?: HttpParams): Observable<T> {
    const options = { params }
    return this.http.delete<T>(`${AppConstant.BASE_URL}${url}`, options);
  }



  deleteWithBody<T>(endpoint: string, body: any) {
    const url = `${AppConstant.BASE_URL}${endpoint}`;
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body, 
    };

    return this.http.delete<T>(url, options);
  }

  put<T>(url: string, body: any, params?: HttpParams): Observable<T> {
    const options = { params };
    return this.http.put<T>(`${AppConstant.BASE_URL}${url}`, body, options);
  }

  putFormData<T>(url: string, formData?: FormData, params?: HttpParams): Observable<T> {
    const options = { params };
    return this.http.put<T>(`${AppConstant.BASE_URL}${url}`, formData, options);
  }

  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(`${AppConstant.BASE_URL}${url}`, body);
  }


}
