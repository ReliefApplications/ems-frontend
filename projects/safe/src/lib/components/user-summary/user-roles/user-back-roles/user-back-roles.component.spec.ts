import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBackRolesComponent } from './user-back-roles.component';

describe('UserBackRolesComponent', () => {
  let component: UserBackRolesComponent;
  let fixture: ComponentFixture<UserBackRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBackRolesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBackRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
