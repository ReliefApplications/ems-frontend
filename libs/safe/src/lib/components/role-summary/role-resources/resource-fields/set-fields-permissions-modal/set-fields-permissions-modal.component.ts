import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DialogModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { SafeUnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

/**
 * Modal to update multiple fields permissions.
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
export class SetFieldsPermissionsModalComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public setForm: UntypedFormGroup = new UntypedFormGroup({});

  /**
   * Constructor of the component.
   *
   * @param formBuilder Angular Form builder service
   */
  constructor(private formBuilder: UntypedFormBuilder) {
    super();
  }

  /**
   * Build the form and subscribe to changes.
   */
  ngOnInit(): void {
    this.setForm = this.formBuilder.group({
      canSee: [true],
      canUpdate: [true],
    });

    this.setForm.controls.canSee.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        if (!value) {
          // Is necessary provide permission to see before allow permission to update.
          this.setForm.controls.canUpdate.disable();
          this.setForm.controls.canUpdate.setValue(false);
        } else {
          this.setForm.controls.canUpdate.enable();
        }
      });
  }
}
