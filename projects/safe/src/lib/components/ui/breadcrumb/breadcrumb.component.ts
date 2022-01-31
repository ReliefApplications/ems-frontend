import { Component, Input, OnInit } from '@angular/core';
import { BreadCrumbService } from '../../../services/bread-crumb.service';

interface Breadcrumb {
  name: string;
  route: string;
  queryParams?: any;
}

@Component({
  selector: 'safe-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class SafeBreadcrumbComponent implements OnInit {
  items: Breadcrumb[] = [];

  constructor(private breadCrumbService: BreadCrumbService) {}

  ngOnInit(): void {
    this.breadCrumbService.breadCrumb$.subscribe((breadCrumb: any) => {
      this.items = breadCrumb;
    });
  }
}
