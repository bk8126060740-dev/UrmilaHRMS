import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAttributeComponent } from './project-attribute.component';

describe('ProjectAttributeComponent', () => {
  let component: ProjectAttributeComponent;
  let fixture: ComponentFixture<ProjectAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
