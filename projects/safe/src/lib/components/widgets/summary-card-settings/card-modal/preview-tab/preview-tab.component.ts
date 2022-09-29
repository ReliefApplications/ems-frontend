import { Component, Input, OnInit } from '@angular/core';
import { Record } from '../../../../../models/record.model';
import { getFieldsValue } from '../../../summary-card/parser/utils';

/**
 * Component used in the card-modal-settings for previewing the final result.
 */
@Component({
  selector: 'safe-preview-tab',
  templateUrl: './preview-tab.component.html',
  styleUrls: ['./preview-tab.component.scss'],
})
export class SafePreviewTabComponent implements OnInit {
  @Input() html = '';
  @Input() fields: any[] = [];
  @Input() record: Record | null = null;

  public fieldsValue: any;

  ngOnInit() {
    this.fieldsValue = getFieldsValue(this.record);
  }
}
