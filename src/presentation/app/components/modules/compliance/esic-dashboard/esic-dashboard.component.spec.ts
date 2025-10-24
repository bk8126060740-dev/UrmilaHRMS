import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsicDashboardComponent } from './esic-dashboard.component';

describe('EsicDashboardComponent', () => {
  let component: EsicDashboardComponent;
  let fixture: ComponentFixture<EsicDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EsicDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsicDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
