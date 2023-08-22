import { Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SafeFilterModule } from '../../../filter/filter.module';
import { ButtonModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';
import { DIALOG_DATA } from '@angular/cdk/dialog';

/** Interface of component dialog data */
interface DialogData {
  formGroup: UntypedFormGroup;
  fields: any[];
}

/**
 * Modal interface to edit auto assignment rule of roles.
 */
@Component({
  standalone: true,
  imports: [CommonModule, DialogModule, SafeFilterModule, ButtonModule],
  selector: 'safe-edit-role-auto-assignment-modal',
  templateUrl: './edit-role-auto-assignment-modal.component.html',
  styleUrls: ['./edit-role-auto-assignment-modal.component.scss'],
})
export class EditRoleAutoAssignmentModalComponent {
  public formGroup!: UntypedFormGroup;
  public fields: any[] = [];

  /**
   * Modal interface to edit auto assignment rule of roles.
   *
   * @param data component modal data
   */
  constructor(
    @Inject(DIALOG_DATA)
    public data: DialogData
  ) {
    this.formGroup = data.formGroup;
    this.fields = data.fields;
  }
}
