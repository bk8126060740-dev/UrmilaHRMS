import { Injectable } from '@angular/core';
import { ApiService } from './base-service/api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, BaseResponseModel } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class BankintiateService {
constructor(private apiService: ApiService) { }

  getBankTransferList<T>(URL: any, params?: HttpParams): Observable<BaseResponse<T>> {
    return this.apiService.get<BaseResponse<T>>(URL, params);
  }

    sendBankTransferSheet<T>(URL: any, data?: any): Observable<BaseResponse<T>> {
    return this.apiService.post<BaseResponse<T>>(URL, data);
  }

}
