import { Injectable } from "@angular/core";
import { ApiService } from "./base-service/api.service";
import { HttpParams } from "@angular/common/http";
import { BaseModel } from "../models/on-board.modal";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OnBoardService {
    constructor(private apiService: ApiService) {
    }

    UploadExcel(URL: any,formData: FormData): Observable<BaseModel> {
        return this.apiService.postFormData<BaseModel>(URL, formData);
    }

    GetAllEmployeeOnBoardings(URL: any, params: HttpParams): Observable<BaseModel> {
        return this.apiService.get<BaseModel>(URL, params);
    }
}
