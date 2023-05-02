import { Component, Input } from '@angular/core';
import { BreadcrumbDisplay } from './enums/breadcrumb-display.enum';
import { BreadcrumbSeparator } from './enums/breadcrumb-separator.enum';
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
  @Input() separator: BreadcrumbSeparator = BreadcrumbSeparator.CHEVRON;
  @Input() display: BreadcrumbDisplay = BreadcrumbDisplay.SIMPLE;

  //In order to be able to use enumerations in html
  BreadcrumbsTypes = BreadcrumbDisplay;
  BreadcrumbsSeparators = BreadcrumbSeparator;
}
