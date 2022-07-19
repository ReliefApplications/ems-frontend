import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRoleFormFiltersComponent } from './role-form-filters.component';

describe('SafeRoleFormFiltersComponent', () => {
  let component: SafeRoleFormFiltersComponent;
  let fixture: ComponentFixture<SafeRoleFormFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeRoleFormFiltersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRoleFormFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
