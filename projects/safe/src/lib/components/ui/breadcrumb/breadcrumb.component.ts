import { Component, Input, OnInit } from '@angular/core';

/**
 * Breadcrumb interface.
 */
interface Breadcrumb {
  name: string;
  href: string;
  queryParams?: any;
}

/**
 * Breadcrumb component
 */
@Component({
  selector: 'safe-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class SafeBreadcrumbComponent implements OnInit {
  @Input() items: Breadcrumb[] = [];

  /**
   * Breadcrumb component
   */
  constructor() {}

  ngOnInit(): void {}
}
