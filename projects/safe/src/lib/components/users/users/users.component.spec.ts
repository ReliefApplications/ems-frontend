import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeBackofficeUsersComponent } from './backoffice-users.component';

describe('SafeBackofficeUsersComponent', () => {
  let component: SafeBackofficeUsersComponent;
  let fixture: ComponentFixture<SafeBackofficeUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeBackofficeUsersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeBackofficeUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
