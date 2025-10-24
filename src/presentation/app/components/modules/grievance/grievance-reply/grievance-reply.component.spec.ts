import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceReplyComponent } from './grievance-reply.component';

describe('GrievanceReplyComponent', () => {
  let component: GrievanceReplyComponent;
  let fixture: ComponentFixture<GrievanceReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrievanceReplyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GrievanceReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
