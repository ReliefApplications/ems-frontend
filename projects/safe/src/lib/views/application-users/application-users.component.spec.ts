import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeApplicationUsersComponent } from './application-users.component';

describe('SafeApplicationUsersComponent', () => {
  let component: SafeApplicationUsersComponent;
  let fixture: ComponentFixture<SafeApplicationUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeApplicationUsersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
