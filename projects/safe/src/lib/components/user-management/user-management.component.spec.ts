import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeUserManagementComponent } from './user-management.component';

describe('UserManagementComponent', () => {
  let component: SafeUserManagementComponent;
  let fixture: ComponentFixture<SafeUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeUserManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
