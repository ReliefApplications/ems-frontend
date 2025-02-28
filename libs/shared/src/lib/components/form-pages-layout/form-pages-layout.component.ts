import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule, IconModule, TooltipModule } from '@oort-front/ui';

/** New layout on the left of the form */
@Component({
  standalone: true,
  imports: [CommonModule, IconModule, TooltipModule, ButtonModule],
  selector: 'shared-form-pages-layout',
  templateUrl: './form-pages-layout.component.html',
  styleUrls: ['./form-pages-layout.component.scss'],
  animations: [
    trigger('toggle', [
      state(
        'collapsed',
        style({ width: '0px', opacity: 0, overflow: 'hidden' })
      ),
      state('expanded', style({ width: '*', opacity: 1 })),
      transition('expanded => collapsed', [
        animate(
          '225ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ width: '0px' })
        ),
        animate('225ms ease-out', style({ opacity: 0 })),
      ]),
      transition('collapsed => expanded', [
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ width: '*' })),
        animate('225ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class FormPagesLayoutComponent {
  /** Current page */
  @Input() selectedPageIndex = 0;
  /** Number of pages in the form */
  @Input() pages: { name: string; title: string; containsErrors: boolean }[] =
    [];
  /** show page when clicking on page name */
  @Output() showPage = new EventEmitter<number>();
  /** Is panel collapsed */
  isPanelCollapsed = false;

  /** Expands or collapses the panel */
  togglePanel() {
    this.isPanelCollapsed = !this.isPanelCollapsed;
  }
}
