import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonMapperService {
  constructor() {}

  
  mapResponse<T extends { [key: string]: any }>(apiResponse: any, model: new () => T): T {
    const instance = new model();
    Object.keys(instance).forEach(key => {
      if (apiResponse.hasOwnProperty(key)) {
        (instance as any)[key] = apiResponse[key];
      }
    });
    return instance;
  }

  
  mapResponseArray<T extends { [key: string]: any }>(apiResponseArray: any[], model: new () => T): T[] {
    return apiResponseArray.map(apiResponse => this.mapResponse(apiResponse, model));
  }
}
