import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleUsersComponent } from './role-users.component';

describe('RoleUsersComponent', () => {
  let component: RoleUsersComponent;
  let fixture: ComponentFixture<RoleUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleUsersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
