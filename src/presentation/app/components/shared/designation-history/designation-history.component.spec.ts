import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationHistoryComponent } from './designation-history.component';

describe('DesignationHistoryComponent', () => {
  let component: DesignationHistoryComponent;
  let fixture: ComponentFixture<DesignationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesignationHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
