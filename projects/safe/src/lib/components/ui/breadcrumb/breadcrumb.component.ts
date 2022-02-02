import { Component, Input, OnInit } from '@angular/core';
import { SafeBreadcrumbService } from '../../../services/breadcrumb.service';

interface Breadcrumb {
  name: string;
  href: string;
  queryParams?: any;
}

@Component({
  selector: 'safe-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class SafeBreadcrumbComponent implements OnInit {
  @Input() breadcrumbs: Breadcrumb[] = [];

  constructor(private breadcrumbService: SafeBreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe((res) => {
      this.breadcrumbs = res;
    });
  }
}
