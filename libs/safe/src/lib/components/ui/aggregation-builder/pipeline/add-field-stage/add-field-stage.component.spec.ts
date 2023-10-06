import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormArray } from '@angular/forms';
import { SafeAddFieldStageComponent } from './add-field-stage.component';
import { setupSpecConfig } from '../shared-config/spec/config';

describe('SafeAddFieldStageComponent', () => {
  let component: SafeAddFieldStageComponent;
  let fixture: ComponentFixture<SafeAddFieldStageComponent>;

  beforeEach(async () => setupSpecConfig(SafeAddFieldStageComponent));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddFieldStageComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
