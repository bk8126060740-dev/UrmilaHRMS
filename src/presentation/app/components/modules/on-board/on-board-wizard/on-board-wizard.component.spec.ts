import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoardWizardComponent } from './on-board-wizard.component';

describe('OnBoardWizardComponent', () => {
  let component: OnBoardWizardComponent;
  let fixture: ComponentFixture<OnBoardWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnBoardWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnBoardWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
