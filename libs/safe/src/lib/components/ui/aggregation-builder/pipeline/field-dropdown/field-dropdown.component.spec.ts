import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeFieldDropdownComponent } from './field-dropdown.component';
import { setupSpecConfig } from '../shared-config/spec/config';

describe('SafeFieldDropdownComponent', () => {
  let component: SafeFieldDropdownComponent;
  let fixture: ComponentFixture<SafeFieldDropdownComponent>;

  beforeEach(async () => setupSpecConfig(SafeFieldDropdownComponent));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFieldDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
