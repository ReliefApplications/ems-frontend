import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Generic widget component, must be extended by other widgets.
 */
@Component({
  selector: 'shared-base-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-widget.component.html',
  styleUrls: ['./base-widget.component.scss'],
})
export class BaseWidgetComponent {
  /** Widget header template reference */
  @ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  /** If had an empty response */
  public isEmpty = false;
}
