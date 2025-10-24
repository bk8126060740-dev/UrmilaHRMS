import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeMasterComponent } from './code-master.component';

describe('CodeMasterComponent', () => {
  let component: CodeMasterComponent;
  let fixture: ComponentFixture<CodeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodeMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
