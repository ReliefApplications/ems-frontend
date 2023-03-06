import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAppRolesComponent } from './user-app-roles.component';

describe('UserAppRolesComponent', () => {
  let component: UserAppRolesComponent;
  let fixture: ComponentFixture<UserAppRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAppRolesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAppRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
