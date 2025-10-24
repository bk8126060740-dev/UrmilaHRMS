import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSheetReportComponent } from './bank-sheet-report.component';

describe('BankSheetReportComponent', () => {
  let component: BankSheetReportComponent;
  let fixture: ComponentFixture<BankSheetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankSheetReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankSheetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
