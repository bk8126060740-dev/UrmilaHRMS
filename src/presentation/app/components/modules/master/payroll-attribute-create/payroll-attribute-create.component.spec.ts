import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollAttributeCreateComponent } from './payroll-attribute-create.component';

describe('PayrollAttributeCreateComponent', () => {
  let component: PayrollAttributeCreateComponent;
  let fixture: ComponentFixture<PayrollAttributeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayrollAttributeCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollAttributeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
