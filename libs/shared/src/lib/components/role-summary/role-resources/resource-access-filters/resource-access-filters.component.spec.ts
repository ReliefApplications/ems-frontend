import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleResourceFiltersComponent } from './resource-access-filters.component';

describe('RoleResourceFiltersComponent', () => {
  let component: RoleResourceFiltersComponent;
  let fixture: ComponentFixture<RoleResourceFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleResourceFiltersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleResourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
