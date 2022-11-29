import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cronValidator } from '../../../../utils/validators/cron.validator';
import get from 'lodash/get';
import { CustomNotification } from '../../../../models/custom-notification.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Dialog data interface
 */
interface DialogData {
  notification: CustomNotification;
}

/**
 * Add / Edit custom notification modal component.
 */
@Component({
  selector: 'safe-edit-notification-modal',
  templateUrl: './edit-notification-modal.component.html',
  styleUrls: ['./edit-notification-modal.component.scss'],
})
export class EditNotificationModalComponent implements OnInit {
  public formGroup!: FormGroup;

  /**
   * Add / Edit custom notification modal component.
   *
   * @param formBuilder Angular form builder
   * @param data Modal injected data
   */
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [get(this.data, 'notification.name', ''), Validators.required],
      description: [get(this.data, 'notification.description', '')],
      schedule: [
        get(this.data, 'pullJob.schedule', ''),
        [Validators.required, cronValidator()],
      ],
      notificationType: [{ value: 'email', disabled: true }],
      resource: [get(this.data, 'notification.resource', '')],
      layout: [get(this.data, 'notification.layout', '')],
      template: [get(this.data, 'notification.template', '')],
    });
  }
}
