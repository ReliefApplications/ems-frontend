import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeInviteUsersComponent } from './invite-users.component';

describe('SafeInviteUsersComponent', () => {
  let component: SafeInviteUsersComponent;
  let fixture: ComponentFixture<SafeInviteUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeInviteUsersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeInviteUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
