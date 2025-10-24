import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PFContributionReportComponent } from './pfcontribution-report.component';

describe('PFContributionReportComponent', () => {
  let component: PFContributionReportComponent;
  let fixture: ComponentFixture<PFContributionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PFContributionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PFContributionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
