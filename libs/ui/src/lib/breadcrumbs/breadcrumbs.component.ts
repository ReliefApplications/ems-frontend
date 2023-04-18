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
  @Input() breadcrumbs: Breadcrumb[] = [];
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
/** Interface of breadcrumb */
export interface Breadcrumb {
  alias?: string;
  uri: string;
  text?: string;
  key?: string;
  queryParams?: any;
}
