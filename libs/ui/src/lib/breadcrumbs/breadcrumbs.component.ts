import { Component, Input } from '@angular/core';

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
  @Input() seperator: BreadcrumbSeperator = BreadcrumbSeperator.CHEVRON;
  @Input() display: BreadcrumbDisplay = BreadcrumbDisplay.SIMPLE;

  //In order to be able to use enumerations in html
  BreadcrumbsTypes = BreadcrumbDisplay;
  BreadcrumbsSeperators = BreadcrumbSeperator;
}

/**
 * Enumeration of possible display styles
 */
export enum BreadcrumbDisplay {
  SIMPLE,
  CONTAINED,
  FULL,
}

/**
 * Enumeration of possible seperators styles
 */
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
