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
  /** Override width of the menu */
  @Input() width = 'w-56';
  /** Should menu close on element click */
  @Input() closeOnClick = true;
  /** Event emitter for when the menu is closed. */
  @Output() closed = new EventEmitter<void>();
}
