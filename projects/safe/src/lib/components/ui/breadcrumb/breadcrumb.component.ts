import { Component, Input, OnInit } from '@angular/core';
import { BreadCrumbService, Breadcrumb } from '../../../services/bread-crumb.service';

@Component({
  selector: 'safe-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class SafeBreadcrumbComponent implements OnInit {
  public items: Breadcrumb[] = [];

  constructor(private breadCrumbService: BreadCrumbService) {}

  ngOnInit(): void {
    this.breadCrumbService.breadCrumb$.subscribe((breadCrumb: any) => {
      this.items = breadCrumb;
    });
  }
}
