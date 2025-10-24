import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UnsavedChangesService {
  private hasUnsavedChanges = false;
  private unsavedChangesSubject = new Subject<boolean>();

    
  unsavedChanges$ = this.unsavedChangesSubject.asObservable();

  setUnsavedChanges(hasChanges: boolean) {
    this.hasUnsavedChanges = hasChanges;
    this.unsavedChangesSubject.next(this.hasUnsavedChanges);
  }

  getUnsavedChanges(): boolean {
    return this.hasUnsavedChanges;
  }
}
