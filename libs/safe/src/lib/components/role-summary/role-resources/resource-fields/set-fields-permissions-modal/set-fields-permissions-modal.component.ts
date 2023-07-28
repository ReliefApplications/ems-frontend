import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DialogModule, TooltipModule } from '@oort-front/ui';
import { DialogRef } from '@angular/cdk/dialog';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  selector: 'safe-set-fields-permissions-modal',
  templateUrl: './set-fields-permissions-modal.component.html',
  styleUrls: ['./set-fields-permissions-modal.component.scss'],
})
export class SetFieldsPermissionsModalComponent {
  public setForm: UntypedFormGroup = new UntypedFormGroup({});
  public canSee = true;
  public canUpdate = true;

  /**
   * Modal to add a new resource.
   *
   * @param formBuilder Angular Form builder service
   * @param dialogRef Dialog reference
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: DialogRef<SetFieldsPermissionsModalComponent>
  ) {}

  /**
   * Loads the resources and build the form.
   */
  ngOnInit(): void {
    this.setForm = this.formBuilder.group({
      see: this.canSee,
      update: this.canUpdate,
    });
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
