import { Injectable } from '@angular/core';
import { GlobalConfiguration } from './global-configration';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): any | null {
    const encryptedItem = localStorage.getItem(key);
    return encryptedItem;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

  setSession(key: string, value: any) {
    sessionStorage.setItem(key, value);
  }

  getSessionItem(key: string): any | null {
    const encryptedItem = sessionStorage.getItem(key);
    return encryptedItem;
  }
}
