import { Component, Input } from '@angular/core';
import { Record } from '../../../../../models/record.model';

/**
 * Component used in the card-modal-settings for previewing the final result.
 */
@Component({
  selector: 'safe-preview-tab',
  templateUrl: './preview-tab.component.html',
  styleUrls: ['./preview-tab.component.scss'],
})
export class SafePreviewTabComponent {
  @Input() html = '';
  @Input() fields: any[] = [];
  @Input() record: Record | null = null;
}
