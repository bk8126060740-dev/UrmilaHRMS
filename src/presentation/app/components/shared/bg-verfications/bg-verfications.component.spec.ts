import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgVerficationsComponent } from './bg-verfications.component';

describe('BgVerficationsComponent', () => {
  let component: BgVerficationsComponent;
  let fixture: ComponentFixture<BgVerficationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BgVerficationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgVerficationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
