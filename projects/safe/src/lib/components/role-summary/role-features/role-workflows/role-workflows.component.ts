import { Component, Input, OnInit } from '@angular/core';
import { Page } from '../../../../models/page.model';

@Component({
  selector: 'safe-role-workflows',
  templateUrl: './role-workflows.component.html',
  styleUrls: ['./role-workflows.component.scss'],
})
export class RoleWorkflowsComponent implements OnInit {
  @Input() pages: Page[] = [];
  public displayedColumns = ['name', 'actions'];

  constructor() {}

  ngOnInit(): void {}
}
