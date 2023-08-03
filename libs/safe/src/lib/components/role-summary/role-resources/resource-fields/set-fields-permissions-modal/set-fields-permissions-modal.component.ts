import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DialogModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import { DialogRef } from '@angular/cdk/dialog';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { ToggleComponent } from '../../../../../../../../ui/src/lib/toggle/toggle.component';

/**
 * Modal content to edit the permissions over resources.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    FormsModule,
    ToggleModule,
    ReactiveFormsModule,
  ],
  selector: 'safe-set-fields-permissions-modal',
  templateUrl: './set-fields-permissions-modal.component.html',
  styleUrls: ['./set-fields-permissions-modal.component.scss'],
})
export class SetFieldsPermissionsModalComponent implements OnInit {
  public setForm: UntypedFormGroup = new UntypedFormGroup({});

  @ViewChild('canUpdateToggle') canUpdateToggle?: ToggleComponent;

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
      canSee: [true],
      canUpdate: [true],
    });

    this.setForm.controls.canSee.valueChanges.subscribe((value: boolean) => {
      this.canUpdateToggle?.setDisabledState(!value);
      if (!value) this.canUpdateToggle?.writeValue(false);
    });
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
