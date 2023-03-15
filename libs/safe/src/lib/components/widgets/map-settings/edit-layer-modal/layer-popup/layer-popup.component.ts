import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Map layer popup settings component.
 */
@Component({
  selector: 'safe-layer-popup',
  templateUrl: './layer-popup.component.html',
  styleUrls: ['./layer-popup.component.scss'],
})
export class LayerPopupComponent {
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();
  list = [1, 2, 3, 4, 5, 6];

  // constructor() {}
  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param e Event emitted when a layer is reordered
   */
  public onListDrop(e: CdkDragDrop<number[]>) {
    const movedElement = this.list.splice(e.previousIndex, 1);
    this.list.splice(e.currentIndex, 0, movedElement[0]);
  }
}
