import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeTypeMasterComponent } from './code-type-master.component';

describe('CodeTypeMasterComponent', () => {
  let component: CodeTypeMasterComponent;
  let fixture: ComponentFixture<CodeTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodeTypeMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
