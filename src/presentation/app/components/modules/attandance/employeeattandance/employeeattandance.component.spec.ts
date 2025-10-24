import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeattandanceComponent } from './employeeattandance.component';

describe('EmployeeattandanceComponent', () => {
  let component: EmployeeattandanceComponent;
  let fixture: ComponentFixture<EmployeeattandanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeattandanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeattandanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
