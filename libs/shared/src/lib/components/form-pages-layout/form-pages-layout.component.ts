import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconModule } from '@oort-front/ui';

/** New layout on the left of the form */
@Component({
  standalone: true,
  imports: [CommonModule, IconModule],
  selector: 'shared-form-pages-layout',
  templateUrl: './form-pages-layout.component.html',
  styleUrls: ['./form-pages-layout.component.scss'],
})
export class FormPagesLayoutComponent {
  /** Current page */
  @Input() selectedPageIndex = 0;
  /** Number of pages in the form */
  @Input() pages: { name: string; title: string; containsErrors: boolean }[] =
    [];
  /** show page when clicking on page name */
  @Output() showPage = new EventEmitter<number>();
}
