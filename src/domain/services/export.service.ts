import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstant } from '../../common/app-constant';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private http: HttpClient,
  ) { }

  get(url: string,params?: HttpParams): Observable<Blob> {  
    return this.http.get(`${AppConstant.BASE_URL}${url}`, {
      responseType: 'blob',  
      params: params 
    });
  }
}
