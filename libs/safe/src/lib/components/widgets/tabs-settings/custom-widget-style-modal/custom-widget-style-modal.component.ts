import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@oort-front/ui';
import { CustomWidgetStyleComponent } from '../../../custom-widget-style/custom-widget-style.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'safe-custom-widget-style-modal',
  standalone: true,
  imports: [CommonModule, CustomWidgetStyleComponent, DialogModule],
  templateUrl: './custom-widget-style-modal.component.html',
  styleUrls: ['./custom-widget-style-modal.component.scss'],
})
export class CustomWidgetStyleModalComponent {
  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private dialogRef: DialogRef
  ) {}

  onCancel() {
    this.dialogRef.close();
  }
}
