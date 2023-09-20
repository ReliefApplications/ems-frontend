import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AlertModule,
  ButtonModule,
  DialogModule,
  CronEditorModule,
} from '@oort-front/ui';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ReadableCronModule } from '../../../pipes/readable-cron/readable-cron.module';

/**
 * Dialog data interface
 */
interface DialogData {
  value: string;
}

/**
 * Cron expression form control modal
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    CronEditorModule,
    FormsModule,
    ReactiveFormsModule,
    ReadableCronModule,
    DialogModule,
    ButtonModule,
    AlertModule,
  ],
  selector: 'shared-cron-expression-control-modal',
  templateUrl: './cron-expression-control-modal.component.html',
  styleUrls: ['./cron-expression-control-modal.component.scss'],
})
export class CronExpressionControlModalComponent {
  public control: FormControl = new FormControl();
  public cronValid!: boolean;

  /**
   *  Cron expression form control modal
   */
  constructor(@Inject(DIALOG_DATA) public data: DialogData) {
    // The cron editor we're using doesn't support two way binding,
    // meaning the UI will always be initialized in the 'Minutes' tab, with 'every 1 minute' selected
    // So it's useless to inject the value from the parent component
    // That way, it's better to always initialize the control with the default value
    this.control.setValue(data);
    if (!this.control.value) {
      this.control = new FormControl();
    }
  }

  public cronIsValid(value: boolean) {
    this.cronValid = value;
  }
}
