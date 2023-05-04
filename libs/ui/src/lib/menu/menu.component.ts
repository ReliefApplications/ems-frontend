import {
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

/**
 * UI Menu Component
 */
@Component({
  selector: 'ui-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
  @Output() closed = new EventEmitter<void>();
}
