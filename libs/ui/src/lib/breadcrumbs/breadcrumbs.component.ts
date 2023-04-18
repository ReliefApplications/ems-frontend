import { Component, Input } from '@angular/core';

/**
 *
 */
@Component({
  selector: 'ui-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  @Input() path: string[] = [];
  @Input() seperator: BreadcrumbSeperator = BreadcrumbSeperator.CHEVRON;
  @Input() display: BreadcrumbDisplay = BreadcrumbDisplay.SIMPLE;

  BreadcrumbsTypes = BreadcrumbDisplay;
  BreadcrumbsSeperators = BreadcrumbSeperator;
}
export enum BreadcrumbDisplay {
  SIMPLE,
  CONTAINED,
  FULL,
}
export enum BreadcrumbSeperator {
  CHEVRON,
  SLASH,
}
