import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAutoAssignmentComponent } from './role-auto-assignment.component';

describe('RoleAutoAssignmentComponent', () => {
  let component: RoleAutoAssignmentComponent;
  let fixture: ComponentFixture<RoleAutoAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleAutoAssignmentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAutoAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
