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
  @Input() seperator = '>';
  @Input() display = '';
}
