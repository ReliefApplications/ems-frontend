import { Component, Input, OnInit } from '@angular/core';
import { Page } from '../../../../models/page.model';

@Component({
  selector: 'safe-role-dashboards',
  templateUrl: './role-dashboards.component.html',
  styleUrls: ['./role-dashboards.component.scss'],
})
export class RoleDashboardsComponent implements OnInit {
  @Input() pages: Page[] = [];
  public displayedColumns = ['name', 'actions'];

  constructor() {}

  ngOnInit(): void {
    console.log(this.pages);
  }
}
