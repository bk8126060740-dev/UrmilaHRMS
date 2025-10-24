import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderDropdownService {
  private dropdownValueSource = new BehaviorSubject<number>(-1); 
  dropdownValue$ = this.dropdownValueSource.asObservable();

  private dropdownChangesSource = new BehaviorSubject<number>(-1); 
  dropdownChanges$ = this.dropdownChangesSource.asObservable();

  updateDropdownValue(value: number) {
    this.dropdownValueSource.next(value);
  }

  updateDropdown(value: number) {
    this.dropdownChangesSource.next(value);
  }
}
