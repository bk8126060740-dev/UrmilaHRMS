import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinacialDetailsComponent } from './finacial-details.component';

describe('FinacialDetailsComponent', () => {
  let component: FinacialDetailsComponent;
  let fixture: ComponentFixture<FinacialDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinacialDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinacialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
