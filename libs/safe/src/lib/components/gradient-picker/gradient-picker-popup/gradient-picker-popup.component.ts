import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Gradient } from '../gradient-picker.component';

/**
 * Available gradients
 * todo: pass as input
 */
const GRADIENTS: Gradient[] = [
  [
    {
      color: 'blue',
      ratio: 0,
    },
    {
      color: 'red',
      ratio: 1,
    },
  ],
  [
    {
      color: 'black',
      ratio: 0,
    },
    {
      color: 'aqua',
      ratio: 0.5,
    },
    {
      color: 'white',
      ratio: 1,
    },
  ],
  [
    {
      color: 'blue',
      ratio: 0,
    },
    {
      color: 'green',
      ratio: 0.25,
    },
    {
      color: 'yellow',
      ratio: 0.5,
    },
    {
      color: 'orange',
      ratio: 0.75,
    },
    {
      color: 'red',
      ratio: 1,
    },
  ],
  [
    {
      color: 'white',
      ratio: 0,
    },
    {
      color: 'lightgrey',
      ratio: 0.25,
    },
    {
      color: 'grey',
      ratio: 0.5,
    },
    {
      color: 'darkgrey',
      ratio: 0.75,
    },
    {
      color: 'black',
      ratio: 1,
    },
  ],
  [
    {
      color: 'red',
      ratio: 0,
    },
    {
      color: 'orange',
      ratio: 0.1667,
    },
    {
      color: 'yellow',
      ratio: 0.3333,
    },
    {
      color: 'green',
      ratio: 0.5,
    },
    {
      color: 'blue',
      ratio: 0.6667,
    },
    {
      color: 'indigo',
      ratio: 0.8333,
    },
    {
      color: 'violet',
      ratio: 1,
    },
  ],
];

/**
 * Gradient control popup
 */
@Component({
  selector: 'safe-gradient-picker-popup',
  templateUrl: './gradient-picker-popup.component.html',
  styleUrls: ['./gradient-picker-popup.component.scss'],
})
export class GradientPickerPopupComponent {
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close: EventEmitter<Gradient> = new EventEmitter();
  private show = true;

  public gradients = GRADIENTS;

  /** Listen to click event on the document */
  @HostListener('click')
  clickInside() {
    this.show = true;
  }

  /** Listen to document click event and close the component if outside of it */
  @HostListener('document:click')
  clickout() {
    if (!this.show) {
      this.close.emit();
    }
    this.show = false;
  }

  /**
   * Select gradient
   *
   * @param gradient gradient name
   */
  select(gradient: Gradient): void {
    this.close.emit(gradient);
    this.show = false;
  }
}
