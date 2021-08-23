import { Component, Input, OnInit } from '@angular/core';
import { ButtonCategory } from './button-category.enum';
import { ButtonSize } from './button-size.enum';
import { ButtonVariant } from './button-variant.enum';

@Component({
  selector: 'safe-button',
  templateUrl: './button.component.html',
  styleUrls: [
    './button.component.scss'
  ]
})
export class SafeButtonComponent implements OnInit  {

  @Input() category: ButtonCategory = ButtonCategory.PRIMARY;

  @Input() size: ButtonSize = ButtonSize.MEDIUM;

  @Input() variant: ButtonVariant = ButtonVariant.DEFAULT;

  @Input() block = false;

  @Input() disabled = false;

  @Input() loading = false;

  @Input() icon = '';

  get color(): string {
    switch (this.variant) {
      case 'primary': {
        return 'primary';
      }
      case 'danger': {
        return 'warn';
      }
      default: {
        return '';
      }
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
