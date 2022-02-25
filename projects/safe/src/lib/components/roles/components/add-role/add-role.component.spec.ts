import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAddRoleComponent } from './add-role.component';

describe('SafeAddRoleComponent', () => {
  let component: SafeAddRoleComponent;
  let fixture: ComponentFixture<SafeAddRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAddRoleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
