import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { SafeExpressionsComponent } from './expressions.component';
import { setupSpecConfig } from '../shared-config/spec/config';

describe('SafeExpressionsComponent', () => {
  let component: SafeExpressionsComponent;
  let fixture: ComponentFixture<SafeExpressionsComponent>;

  beforeEach(async () => setupSpecConfig(SafeExpressionsComponent));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeExpressionsComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      operator: new UntypedFormControl(),
      field: new UntypedFormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
