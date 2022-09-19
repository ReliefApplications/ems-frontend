import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBackRolesModalComponent } from './user-back-roles-modal.component';

describe('UserBackRolesModalComponent', () => {
  let component: UserBackRolesModalComponent;
  let fixture: ComponentFixture<UserBackRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBackRolesModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBackRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
