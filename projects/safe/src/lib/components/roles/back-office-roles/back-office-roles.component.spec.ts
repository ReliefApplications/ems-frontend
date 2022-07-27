import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeBackOfficeRolesComponent } from './back-office-roles.component';

describe('SafeBackOfficeRolesComponent', () => {
  let component: SafeBackOfficeRolesComponent;
  let fixture: ComponentFixture<SafeBackOfficeRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeBackOfficeRolesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeBackOfficeRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
