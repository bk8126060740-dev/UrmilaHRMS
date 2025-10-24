import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReciveableDashboardComponent } from './payment-reciveable-dashboard.component';

describe('PaymentReciveableDashboardComponent', () => {
  let component: PaymentReciveableDashboardComponent;
  let fixture: ComponentFixture<PaymentReciveableDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentReciveableDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentReciveableDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
