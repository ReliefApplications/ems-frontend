import { Component, OnInit } from '@angular/core';
import {
  Breadcrumb,
  SafeBreadcrumbService,
} from '../../../services/breadcrumb/breadcrumb.service';

/**
 * Breadcrumb component
 */
@Component({
  selector: 'safe-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class SafeBreadcrumbComponent implements OnInit {
  public breadcrumbs: Breadcrumb[] = [];

  /**
   * Breadcrumb service
   *
   * @param breadcrumbService Shared breadcrumb service
   */
  constructor(private breadcrumbService: SafeBreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe((res) => {
      this.breadcrumbs = res;
    });
  }
}
