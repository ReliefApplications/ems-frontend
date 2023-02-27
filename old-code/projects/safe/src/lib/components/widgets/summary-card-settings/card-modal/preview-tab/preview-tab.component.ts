import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { get } from 'lodash';
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
export class SafePreviewTabComponent implements OnInit, OnChanges {
  @Input() form: any;
  @Input() fields: any[] = [];
  @Input() record: Record | null = null;
  @Input() layout: any;

  public fieldsValue: any;
  public styles: any[] = [];

  ngOnInit() {
    this.fieldsValue = getFieldsValue(this.record);
    this.styles = get(this.layout, 'query.style', []);
  }

  ngOnChanges() {
    this.fieldsValue = getFieldsValue(this.record);
    this.styles = get(this.layout, 'query.style', []);
  }
}
