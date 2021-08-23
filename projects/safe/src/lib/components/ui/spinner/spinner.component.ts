import { Component, Input, OnInit } from '@angular/core';
import { SpinnerSize } from './spinner-size.enum';
import { SpinnerVariant } from './spinner-variant.enum';

@Component({
  selector: 'safe-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SafeSpinnerComponent implements OnInit {

  @Input() size: SpinnerSize = SpinnerSize.MEDIUM;

  @Input() variant: SpinnerVariant = SpinnerVariant.DEFAULT;

  get diameter(): number {
    switch (this.size) {
      case SpinnerSize.SMALL: {
        return 18;
      }
      case SpinnerSize.MEDIUM: {
        return 24;
      }
      default: {
        return 24;
      }
    }
  }

  get color(): string {
    switch (this.variant) {
      case SpinnerVariant.PRIMARY: {
        return 'primary';
      }
      case SpinnerVariant.DANGER: {
        return 'warn';
      }
      default: {
        return '';
      }
    }
  }

  constructor() { }

  ngOnInit(): void { }
}
