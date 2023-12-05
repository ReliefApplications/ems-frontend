import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleAutoAssignmentModalComponent } from './edit-role-auto-assignment-modal.component';

describe('EditRoleAutoAssignmentModalComponent', () => {
  let component: EditRoleAutoAssignmentModalComponent;
  let fixture: ComponentFixture<EditRoleAutoAssignmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRoleAutoAssignmentModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoleAutoAssignmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
