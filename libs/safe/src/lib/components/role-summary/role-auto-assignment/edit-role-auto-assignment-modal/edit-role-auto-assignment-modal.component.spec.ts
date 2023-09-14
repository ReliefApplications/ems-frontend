import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditRoleAutoAssignmentModalComponent } from './edit-role-auto-assignment-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

describe('EditRoleAutoAssignmentModalComponent', () => {
  let component: EditRoleAutoAssignmentModalComponent;
  let fixture: ComponentFixture<EditRoleAutoAssignmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DIALOG_DATA, useValue: {} },
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
      ],
      imports: [
        EditRoleAutoAssignmentModalComponent,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoleAutoAssignmentModalComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({
      logic: new UntypedFormControl(),
      filters: new UntypedFormArray([]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
