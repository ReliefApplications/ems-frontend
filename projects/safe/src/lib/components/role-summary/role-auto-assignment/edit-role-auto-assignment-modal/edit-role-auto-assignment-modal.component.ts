import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/** Interface of component dialog data */
interface DialogData {
  formGroup: UntypedFormGroup;
  fields: any[];
}

/**
 * Modal interface to edit auto assignment rule of roles.
 */
@Component({
  selector: 'safe-edit-role-auto-assignment-modal',
  templateUrl: './edit-role-auto-assignment-modal.component.html',
  styleUrls: ['./edit-role-auto-assignment-modal.component.scss'],
})
export class EditRoleAutoAssignmentModalComponent implements OnInit {
  public formGroup!: UntypedFormGroup;
  public fields: any[] = [];

  /**
   * Modal interface to edit auto assignment rule of roles.
   *
   * @param data component modal data
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData
  ) {
    this.formGroup = data.formGroup;
    this.fields = data.fields;
  }

  ngOnInit(): void {}
}
