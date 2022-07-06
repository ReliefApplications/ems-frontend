import { Component, Input, OnInit } from '@angular/core';
import { get } from 'lodash';
import { Application } from '../../../models/application.model';
import { ContentType, Page } from '../../../models/page.model';
import { Role } from '../../../models/user.model';

/**
 * Features tab of Role Summary component.
 * Visible only in applications.
 */
@Component({
  selector: 'safe-role-features',
  templateUrl: './role-features.component.html',
  styleUrls: ['./role-features.component.scss'],
})
export class RoleFeaturesComponent implements OnInit {
  @Input() role!: Role;
  @Input() application?: Application;
  @Input() loading = false;

  get dashboards(): Page[] {
    return get(this.application, 'pages', []).filter(
      (x) => x.type === ContentType.dashboard
    );
  }

  get forms(): Page[] {
    return get(this.application, 'pages', []).filter(
      (x) => x.type === ContentType.form
    );
  }

  get workflows(): Page[] {
    return get(this.application, 'pages', []).filter(
      (x) => x.type === ContentType.workflow
    );
  }

  /**
   * Features tab of Role Summary component.
   * Visible only in applications.
   */
  constructor() {}

  ngOnInit(): void {
    console.log(this.application);
  }
}
