import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomNotification } from '@oort-front/shared';
import { Triggers, TriggersType } from '../../triggers.types';

/**
 * Dialog data interface.
 */
interface DialogData {
  trigger?: CustomNotification;
  triggerType: TriggersType;
  formGroup: FormGroup;
}

/**
 * Edit/create trigger modal.
 */
@Component({
  selector: 'app-manage-trigger-modal',
  templateUrl: './manage-trigger-modal.component.html',
  styleUrls: ['./manage-trigger-modal.component.scss'],
})
export class ManageTriggerModalComponent {
  /** Trigger form group */
  public formGroup!: FormGroup;
  /** Triggers enum */
  public TriggersEnum = Triggers;

  /**
   * Edit/create trigger modal.
   *
   * @param data dialog data
   * @param fb Angular form builder
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.formGroup = this.data.formGroup;
    console.log('this.data', this.data);
  }
}
