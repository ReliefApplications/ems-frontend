import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafePreferencesModalComponent } from './preferences-modal.component';

describe('SafePreferencesModalComponent', () => {
  let component: SafePreferencesModalComponent;
  let fixture: ComponentFixture<SafePreferencesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafePreferencesModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePreferencesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
