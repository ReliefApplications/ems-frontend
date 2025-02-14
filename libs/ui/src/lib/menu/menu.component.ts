import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

/**
 * UI Menu Component
 * todo(tailwind): use directive instead of class for the menu items
 */
@Component({
  selector: 'ui-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  /** Reference to the menu template. */
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
  /** Event emitter for when the menu is closed. */
  @Output() closed = new EventEmitter<void>();
  /** Container classes for the menu. */
  @Input() containerClasses = '';

  /** @returns default classes concatenated with the ones provided by the user */
  get classes(): string {
    return `w-56 shrink bg-white text-sm font-normal leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5 flex flex-col rounded-lg overflow-hidden py-1 ${this.containerClasses}`;
  }
}
