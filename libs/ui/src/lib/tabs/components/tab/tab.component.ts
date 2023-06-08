import {
  AfterContentChecked,
  ChangeDetectorRef,
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
export class TabComponent implements AfterContentChecked {
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
  resolveTabClasses: string[] = [];
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentChecked(): void {
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
    this.resolveTabClasses = classes;
  }
}
