import { Component, EventEmitter } from '@angular/core';

/**
 * Edition of a single tab, in tabs widget
 */
@Component({
  selector: 'grid-settings-modal',
  templateUrl: './grid-settings-modal.component.html',
  styleUrls: ['./grid-settings-modal.component.scss'],
})
export class GridSettingsModalComponent {
  public onUpdate = new EventEmitter();
}
