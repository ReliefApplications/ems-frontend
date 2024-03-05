import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Variant } from '../../../types/variant';
import { TemplatePortal } from '@angular/cdk/portal';
import { TabContentDirective } from '../../directives/tab-content.directive';
import { v4 as uuidv4 } from 'uuid';

/**
 * UI Tab component
 */
@Component({
  selector: 'ui-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements AfterContentChecked, AfterContentInit {
  /** Unique tab id, visible in the dom. */
  @HostBinding()
  @Input()
  id = uuidv4();
  /** Whether the tab is enabled or not */
  @Input() disabled = false;
  /** Button reference */
  @ViewChild('button')
  button!: ElementRef;

  /** Output decorator for tab opening */
  @Output() openTab: EventEmitter<void> = new EventEmitter();

  /** @returns content portal of the tab */
  get content(): TemplatePortal | null {
    return this.contentPortal;
  }

  /** Tab content directive */
  @ContentChild(TabContentDirective, { read: TemplateRef<any> })
  explicitContent?: TemplateRef<any> = undefined;

  /** Template reference */
  @ViewChild(TemplateRef, { static: true })
  implicitContent!: TemplateRef<any>;

  /** Tab variant */
  variant: Variant = 'default';
  /** Whether the tab is vertical or not */
  vertical = false;
  /** Whether the tab is selected or not */
  selected = false;
  /** Tab index */
  index = 0;
  /** Tab classes */
  resolveTabClasses: string[] = [];

  /** Content portal */
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
    this.resolveTabClasses = classes;
  }
}
