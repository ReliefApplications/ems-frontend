import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeUsersComponent } from './users.component';

describe('SafeUsersComponent', () => {
  let component: SafeUsersComponent;
  let fixture: ComponentFixture<SafeUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeUsersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
