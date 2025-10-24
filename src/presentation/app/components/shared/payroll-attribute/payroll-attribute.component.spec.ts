import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollAttributeComponent } from './payroll-attribute.component';

describe('PayrollAttributeComponent', () => {
  let component: PayrollAttributeComponent;
  let fixture: ComponentFixture<PayrollAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayrollAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
