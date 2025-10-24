import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectToAndroidComponent } from './redirect-to-android.component';

describe('RedirectToAndroidComponent', () => {
  let component: RedirectToAndroidComponent;
  let fixture: ComponentFixture<RedirectToAndroidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedirectToAndroidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectToAndroidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
