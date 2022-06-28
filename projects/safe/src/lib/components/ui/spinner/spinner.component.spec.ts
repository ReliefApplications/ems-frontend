import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSpinnerComponent } from './spinner.component';

describe('SafeSpinnerComponent', () => {
  let component: SafeSpinnerComponent;
  let fixture: ComponentFixture<SafeSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSpinnerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
