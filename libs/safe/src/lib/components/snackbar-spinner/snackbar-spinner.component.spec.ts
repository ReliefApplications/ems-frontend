import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSnackbarSpinnerComponent } from './snackbar-spinner.component';

describe('SafeSnackbarSpinnerComponent', () => {
  let component: SafeSnackbarSpinnerComponent;
  let fixture: ComponentFixture<SafeSnackbarSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSnackbarSpinnerComponent],
      imports: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSnackbarSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
