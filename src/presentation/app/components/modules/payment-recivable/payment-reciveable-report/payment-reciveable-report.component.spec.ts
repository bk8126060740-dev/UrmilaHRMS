import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReciveableReportComponent } from './payment-reciveable-report.component';

describe('PaymentReciveableReportComponent', () => {
  let component: PaymentReciveableReportComponent;
  let fixture: ComponentFixture<PaymentReciveableReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentReciveableReportComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PaymentReciveableReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
