import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Gradient } from '../gradient-picker.component';

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
];

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
    console.log('select');
    this.close.emit(gradient);
    this.show = false;
  }
}
