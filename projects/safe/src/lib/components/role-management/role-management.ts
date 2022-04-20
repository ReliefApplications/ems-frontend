import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRoleManagementComponent } from './role-management.component';

describe('SafeRoleManagementComponent', () => {
  let component: SafeRoleManagementComponent;
  let fixture: ComponentFixture<SafeRoleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeRoleManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
