import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSettingsComponent } from './form-settings.component';

describe('FormSettingsComponent', () => {
  let component: FormSettingsComponent;
  let fixture: ComponentFixture<FormSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
