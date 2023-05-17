import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * UI Select option component
 */
@Component({
  selector: 'ui-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
})
export class SelectOptionComponent {
  @Input() value!: any;
  @Input() selected = false;
  @Output() optionClick = new EventEmitter<any>();

  /**
   * Emit optionClick output and updates option selected status
   */
  onChangeFunction(): void {
    this.selected = !this.selected;
    this.optionClick.emit(this.selected);
  }
}
