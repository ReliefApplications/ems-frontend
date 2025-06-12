import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarSpinnerComponent } from './snackbar-spinner.component';

describe('SnackbarSpinnerComponent', () => {
  let component: SnackbarSpinnerComponent;
  let fixture: ComponentFixture<SnackbarSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnackbarSpinnerComponent],
      imports: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
