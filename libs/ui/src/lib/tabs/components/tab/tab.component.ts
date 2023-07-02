import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Variant } from '../../../types/variant';
import { TemplatePortal } from '@angular/cdk/portal';
import { TabContentDirective } from '../../directives/tab-content.directive';

/**
 * UI Tab component
 */
@Component({
  selector: 'ui-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements AfterContentChecked, AfterContentInit {
  @Input() disabled = false;
  @ViewChild('button')
  button!: ElementRef;

  @Output() openTab: EventEmitter<void> = new EventEmitter();

  /** @returns content portal of the tab */
  get content(): TemplatePortal | null {
    return this.contentPortal;
  }

  @ContentChild(TabContentDirective, { read: TemplateRef<any> })
  explicitContent?: TemplateRef<any> = undefined;

  @ViewChild(TemplateRef, { static: true })
  implicitContent!: TemplateRef<any>;

  variant: Variant = 'default';
  vertical = false;
  selected = false;
  index = 0;
  resolveTabClasses: string[] = [];

  contentPortal: TemplatePortal | null = null;

  /**
   * UI tab component
   *
   * @param viewContainerRef Angular view container reference
   */
  constructor(private viewContainerRef: ViewContainerRef) {}

  ngAfterContentInit(): void {
    this.contentPortal = new TemplatePortal(
      this.explicitContent || this.implicitContent,
      this.viewContainerRef
    );
  }

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
    if (this.disabled) {
      classes.push('text-gray-400');
    }
    this.resolveTabClasses = classes;
  }
}
