import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsicContributionReportComponent } from './esic-contribution-report.component';

describe('EsicContributionReportComponent', () => {
  let component: EsicContributionReportComponent;
  let fixture: ComponentFixture<EsicContributionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EsicContributionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsicContributionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
