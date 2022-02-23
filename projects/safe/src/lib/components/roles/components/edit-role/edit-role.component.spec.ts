import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEditRoleComponent } from './edit-role.component';

describe('SafeEditRoleComponent', () => {
  let component: SafeEditRoleComponent;
  let fixture: ComponentFixture<SafeEditRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeEditRoleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
