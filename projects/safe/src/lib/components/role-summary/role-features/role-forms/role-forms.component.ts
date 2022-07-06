import { Component, Input, OnInit } from '@angular/core';
import { Page } from '../../../../models/page.model';

@Component({
  selector: 'safe-role-forms',
  templateUrl: './role-forms.component.html',
  styleUrls: ['./role-forms.component.scss'],
})
export class RoleFormsComponent implements OnInit {
  @Input() pages: Page[] = [];
  public displayedColumns = ['name', 'actions'];

  constructor() {}

  ngOnInit(): void {}
}
