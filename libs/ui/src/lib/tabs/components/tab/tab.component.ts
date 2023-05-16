import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Variant } from '../../../shared/variant.enum';

@Component({
  selector: 'ui-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  @Input() label!: string;
  @Input() disabled = false;
  @ViewChild('button')
  button!: ElementRef;

  @Output() openTab: EventEmitter<null> = new EventEmitter();

  @ViewChild('tabContent')
  tabContent!: TemplateRef<any>;

  variant: Variant = Variant.DEFAULT;
  vertical = false;
  selected = false;
  index = 0;

  /** @returns general resolved classes and variant for tab*/
  get resolveTabClasses(): string[] {
    const classes = [];
    if (this.vertical) {
      classes.push('ui-tab__vertical');
      if (this.selected) {
        classes.push('bg-gray-100');
        classes.push('text-gray-700');
      }
    } else {
      classes.push('ui-tab__horizontal');
      if (this.selected) {
        classes.push(
          'ui-tab__' +
            (this.variant === Variant.DEFAULT
              ? Variant.PRIMARY
              : this.variant === Variant.LIGHT
              ? Variant.GREY
              : this.variant)
        );
      }
    }
    return classes;
  }
}
