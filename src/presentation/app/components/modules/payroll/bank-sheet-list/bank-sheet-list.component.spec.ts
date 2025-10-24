import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSheetListComponent } from './bank-sheet-list.component';

describe('BankSheetListComponent', () => {
  let component: BankSheetListComponent;
  let fixture: ComponentFixture<BankSheetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankSheetListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankSheetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
