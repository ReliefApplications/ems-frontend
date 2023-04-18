import { Component, HostBinding, Input } from '@angular/core';
import { ButtonIconPosition } from './enums/button-icon-position.enum';
import { ButtonCategory } from './enums/button-category.enum';
import { Variant } from '../shared/variant.enum';
import { Subject } from 'rxjs';
import { Size } from '../shared/size.enum';

/**
 * UI Button Component
 */
@Component({
  selector: 'ui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() icon = '';
  @Input() iconPosition: ButtonIconPosition = ButtonIconPosition.PREFIX;
  @Input() category: ButtonCategory = ButtonCategory.PRIMARY;
  @Input() size: Size = Size.MEDIUM;
  @Input() variant: Variant = Variant.DEFAULT;
  @Input() loading = false;
  @HostBinding('class.disabled')
  @Input()
  disabled = false;

  buttonIconPosition = ButtonIconPosition;
  buttonCategory = ButtonCategory;
  buttonSize = Size;
  buttonVariant = Variant;

  public emittedEventSubject: Subject<string> = new Subject();
}
