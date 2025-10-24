import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsicAccountDetailsComponent } from './esic-account-details.component';

describe('EsicAccountDetailsComponent', () => {
  let component: EsicAccountDetailsComponent;
  let fixture: ComponentFixture<EsicAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EsicAccountDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsicAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
