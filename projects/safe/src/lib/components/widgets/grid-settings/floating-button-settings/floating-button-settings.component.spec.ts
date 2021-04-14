import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingButtonSettingsComponent } from './floating-button-settings.component';

describe('FloatingButtonSettingsComponent', () => {
  let component: FloatingButtonSettingsComponent;
  let fixture: ComponentFixture<FloatingButtonSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatingButtonSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatingButtonSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
