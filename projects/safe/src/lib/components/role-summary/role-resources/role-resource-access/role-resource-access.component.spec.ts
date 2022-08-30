import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleResourceAccessComponent } from './role-resource-access.component';

describe('RoleResourceAccessComponent', () => {
  let component: RoleResourceAccessComponent;
  let fixture: ComponentFixture<RoleResourceAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleResourceAccessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleResourceAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
