import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { ButtonValue } from './interfaces/button-value.interface';
import { isEqual } from 'lodash';
import { ButtonIconPosition } from '../button/enums/button-icon-position.enum';
import { Size } from '../shared/size.enum';
import { Variant } from '../shared/variant.enum';

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

  buttonIconPosition = ButtonIconPosition;
  buttonSize = Size;
  buttonVariant = Variant;

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
  public buttonGroupClasses(index: number): string {
    if (this.values[index].selected)
      return 'shadow-none bg-gray-300 ring-gray-300 z-10';
    else return 'shadow-none hover:bg-gray-50';
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
