import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HtmlWidgetContentModule } from '../../../widgets/common/html-widget-content/html-widget-content.module';
import { DataTemplateService } from '../../../../services/data-template/data-template.service';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { SafeHtml } from '@angular/platform-browser';

/**
 * Dialog data interface
 */
interface DialogData {
  title: string;
  html: string;
}

/**
 * Modal to show a
 */
@Component({
  standalone: true,
  imports: [HtmlWidgetContentModule, DialogModule, ButtonModule],
  selector: 'shared-editor-modal',
  templateUrl: './editor-modal.component.html',
  styleUrls: ['./editor-modal.component.scss'],
})
export class EditorModalComponent {
  /** Formatted html */
  public formattedHtml: SafeHtml = '';

  /**
   * Modal to show html linked
   *
   * @param dialogRef Reference to the dialog
   * @param data Dialog data
   * @param dataTemplateService data template service
   */
  constructor(
    public dialogRef: DialogRef<EditorModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private dataTemplateService: DataTemplateService
  ) {
    this.formattedHtml = this.dataTemplateService.renderHtml(this.data.html);
  }
}
