import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Variant } from '../../../types/variant';

/**
 * UI Tab component
 */
@Component({
  selector: 'ui-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  @Input() disabled = false;
  @ViewChild('button')
  button!: ElementRef;

  @Output() openTab: EventEmitter<void> = new EventEmitter();

  @ViewChild('tabContent')
  tabContent!: TemplateRef<any>;

  variant: Variant = 'default';
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
            (this.variant === 'default'
              ? 'primary'
              : this.variant === 'light'
              ? 'grey'
              : this.variant)
        );
      }
    }
    return classes;
  }
}
