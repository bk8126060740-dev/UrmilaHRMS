import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectattendanceuploadComponent } from './projectattendanceupload.component';

describe('ProjectattendanceuploadComponent', () => {
  let component: ProjectattendanceuploadComponent;
  let fixture: ComponentFixture<ProjectattendanceuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectattendanceuploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectattendanceuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
