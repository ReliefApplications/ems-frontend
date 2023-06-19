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
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
  @Output() closed = new EventEmitter<void>();
  @Input() shouldClose? = true;

  closeMenu() {
    if (this.shouldClose) {
      this.closed.emit();
    }
  }
}
