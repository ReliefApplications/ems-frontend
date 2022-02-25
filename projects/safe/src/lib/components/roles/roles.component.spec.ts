import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRolesComponent } from './roles.component';

describe('SafeRolesComponent', () => {
  let component: SafeRolesComponent;
  let fixture: ComponentFixture<SafeRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeRolesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
