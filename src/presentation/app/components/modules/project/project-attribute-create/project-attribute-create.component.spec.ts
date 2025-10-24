import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAttributeCreateComponent } from './project-attribute-create.component';

describe('ProjectAttributeCreateComponent', () => {
  let component: ProjectAttributeCreateComponent;
  let fixture: ComponentFixture<ProjectAttributeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectAttributeCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectAttributeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
