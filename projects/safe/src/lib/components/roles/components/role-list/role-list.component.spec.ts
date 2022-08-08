import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRoleListComponent } from './role-list.component';

describe('SafeRoleListComponent', () => {
  let component: SafeRoleListComponent;
  let fixture: ComponentFixture<SafeRoleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeRoleListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
