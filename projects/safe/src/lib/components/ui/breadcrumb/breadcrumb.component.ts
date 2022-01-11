import { Component, Input, OnInit } from '@angular/core';

interface Breadcrumb {
  name: string;
  href: string;
  queryParams?: any;
}

@Component({
  selector: 'safe-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class SafeBreadcrumbComponent implements OnInit {

  @Input() items: Breadcrumb[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
