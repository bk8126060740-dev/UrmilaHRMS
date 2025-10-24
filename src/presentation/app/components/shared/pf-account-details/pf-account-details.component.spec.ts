import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfAccountDetailsComponent } from './pf-account-details.component';

describe('PfAccountDetailsComponent', () => {
  let component: PfAccountDetailsComponent;
  let fixture: ComponentFixture<PfAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PfAccountDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PfAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
