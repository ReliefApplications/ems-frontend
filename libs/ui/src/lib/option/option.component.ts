import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * UI Option component
 */
@Component({
  selector: 'ui-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionComponent {
  @Input() value!: any;
  @Input() isGroup = false;
  @Output() itemClick = new EventEmitter<any>();

  selected = false;

  /**
   * Emit the value attribute of the option
   */
  onClickItem() {
    this.selected = !this.selected;
    this.itemClick.emit(this.selected);
  }
}
