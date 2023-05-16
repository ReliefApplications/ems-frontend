import { Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CommonModule } from '@angular/common';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { SafeFilterModule } from '../../../filter/filter.module';
import { ButtonModule, Variant, Category } from '@oort-front/ui';

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
  imports: [CommonModule, SafeModalModule, SafeFilterModule, ButtonModule],
  selector: 'safe-edit-role-auto-assignment-modal',
  templateUrl: './edit-role-auto-assignment-modal.component.html',
  styleUrls: ['./edit-role-auto-assignment-modal.component.scss'],
})
export class EditRoleAutoAssignmentModalComponent {
  public formGroup!: UntypedFormGroup;
  public fields: any[] = [];

  // === UI VARIANT AND CATEGORY ===
  public variant = Variant;
  public category = Category;

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
}
