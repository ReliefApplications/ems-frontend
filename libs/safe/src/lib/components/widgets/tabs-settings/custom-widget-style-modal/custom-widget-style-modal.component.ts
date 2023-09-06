import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@oort-front/ui';
import { CustomWidgetStyleComponent } from '../../../custom-widget-style/custom-widget-style.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

/**
 * Display custom widget style in a module.
 */
@Component({
  selector: 'safe-custom-widget-style-modal',
  standalone: true,
  imports: [CommonModule, CustomWidgetStyleComponent, DialogModule],
  templateUrl: './custom-widget-style-modal.component.html',
  styleUrls: ['./custom-widget-style-modal.component.scss'],
})
export class CustomWidgetStyleModalComponent {
  /**
   * Display custom widget style in a module.
   *
   * @param data dialog data, contains information about the widget
   * @param dialogRef Dialog reference
   */
  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private dialogRef: DialogRef
  ) {}

  /**
   * Cancel edition of style & close dialog
   */
  onCancel() {
    this.dialogRef.close();
  }
}
