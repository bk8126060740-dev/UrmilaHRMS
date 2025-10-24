import { Injectable } from '@angular/core';
import { ApiService } from './base-service/api.service';
import { Observable } from 'rxjs';
import { ClientModel } from '../models/client.model';
import { HttpParams } from '@angular/common/http';
import { CodesByCodeTypeDropdownModel } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(    
    private apiService: ApiService ) {}

  getClient(URL: any , params?:HttpParams): Observable<ClientModel> {
    return this.apiService.get<ClientModel>(URL , params)
  }

  postClient(Obj: any, URL: any): Observable<ClientModel> {
    return this.apiService.post<ClientModel>(URL , Obj);
  }

  postFormClient( URL: any,formData?: FormData): Observable<ClientModel> {
    return this.apiService.postFormData<ClientModel>(URL , formData);
  }

  putClient(Obj: any, URL: any, params: HttpParams): Observable<ClientModel> {
    return this.apiService.put<ClientModel>(URL, Obj, params);
  }

  putFormClient( URL: any,formData?: FormData, params?: HttpParams): Observable<ClientModel> {
    return this.apiService.putFormData<ClientModel>(URL , formData , params);
  }

  deleteClient(URL: any, params: HttpParams): Observable<ClientModel> {
    return this.apiService.delete<ClientModel>(URL,params);
  }
  
  getAllCodesByCodeTypesDropdownData(obj: any, URL: string): Observable<CodesByCodeTypeDropdownModel> {
    return this.apiService.post<CodesByCodeTypeDropdownModel>(URL, obj);
  }

}
