import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRoleResourceFiltersComponent } from './resource-access-filters.component';

describe('SafeRoleResourceFiltersComponent', () => {
  let component: SafeRoleResourceFiltersComponent;
  let fixture: ComponentFixture<SafeRoleResourceFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeRoleResourceFiltersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRoleResourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
