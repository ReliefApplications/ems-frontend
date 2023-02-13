import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

import { SafeSnackbarSpinnerComponent } from './snackbar-spinner.component';

describe('SafeSnackbarSpinnerComponent', () => {
  let component: SafeSnackbarSpinnerComponent;
  let fixture: ComponentFixture<SafeSnackbarSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: MatSnackBarModule,
          useValue: {},
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {}, // Add any data you wish to test if it is passed/used correctly
        },
      ],
      declarations: [SafeSnackbarSpinnerComponent],
      imports: [MatSnackBarModule],
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
