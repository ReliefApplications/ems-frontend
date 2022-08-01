import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoRoleAssignmentComponent } from './auto-role-assignment.component';

describe('AutoRoleAssignmentComponent', () => {
  let component: AutoRoleAssignmentComponent;
  let fixture: ComponentFixture<AutoRoleAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoRoleAssignmentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRoleAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
