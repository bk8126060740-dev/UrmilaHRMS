import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PFDashboardComponent } from './pfdashboard.component';

describe('PFDashboardComponent', () => {
  let component: PFDashboardComponent;
  let fixture: ComponentFixture<PFDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PFDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PFDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
