import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { ButtonValue } from './interfaces/button-value.interface';
import { isEqual } from 'lodash';

/**
 * UI Button Group Component
 */
@Component({
  selector: 'ui-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
})
export class ButtonGroupComponent implements OnInit {
  @Input() values!: ButtonValue[];
  @Input() selectedValue!: ButtonValue;
  @Output() selectedOption: EventEmitter<ButtonValue> = new EventEmitter();

  ngOnInit(): void {
    if (this.selectedValue) {
      for (const button of this.values) {
        if (isEqual(button, this.selectedValue)) {
          button.selected = true;
          break;
        }
      }
    }
  }

  /**
   * Get button classes
   *
   * @param index button index
   * @returns button scss style classes
   */
  public buttonClass(index: number): string[] {
    const classes = [];
    if (this.values.length > 1)
      classes.push(
        index === 0
          ? 'first-button'
          : index === this.values.length - 1
          ? 'last-button'
          : 'middle-button'
      );
    if (this.values[index].selected) classes.push('selected-button');
    return classes;
  }

  /**
   * Handle button selection
   *
   * @param button selected button
   */
  public onButtonClick(button: ButtonValue): void {
    this.values.forEach((b: ButtonValue) => {
      b.selected = false;
    });
    button.selected = true;
    this.selectedOption.emit(button);
  }
}
