import { Component, Input } from '@angular/core';
import { BreadcrumbDisplay } from './types/breadcrumb-display';
import { BreadcrumbSeparator } from './types/breadcrumb-separator';
import { Breadcrumb } from './interfaces/breadcrumb.interface';

/**
 * UI Breadcrumbs Component
 */
@Component({
  selector: 'ui-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  @Input() breadcrumbs: Breadcrumb[] = [];
  @Input() separator: BreadcrumbSeparator = 'slash';
  @Input() display: BreadcrumbDisplay = 'simple';
}
