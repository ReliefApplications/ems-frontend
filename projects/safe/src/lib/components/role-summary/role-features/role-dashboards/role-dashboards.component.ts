import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Role } from '../../../../models/user.model';
import { Page } from '../../../../models/page.model';
import { get } from 'lodash';

/** Component for the dashboards section of the roles features */
@Component({
  selector: 'safe-role-dashboards',
  templateUrl: './role-dashboards.component.html',
  styleUrls: ['./role-dashboards.component.scss'],
})
export class RoleDashboardsComponent implements OnInit, OnChanges {
  @Input() role!: Role;
  @Input() pages: Page[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter();

  public displayedColumns = ['name', 'actions'];
  public accessiblePages: string[] = [];

  ngOnInit(): void {
    this.accessiblePages = this.pages
      .filter((x) =>
        get(x, 'permissions.canSee', [])
          .map((y: any) => y.id)
          .includes(this.role.id)
      )
      .map((x) => x.id as string);
  }

  ngOnChanges(): void {
    this.accessiblePages = this.pages
      .filter((x) =>
        get(x, 'permissions.canSee', [])
          .map((y: any) => y.id)
          .includes(this.role.id)
      )
      .map((x) => x.id as string);
  }

  /**
   * Emits an event with the changes in permission for a given dashboard
   *
   * @param page A dashboard page object
   */
  onEditAccess(page: Page): void {
    const canSeePermissions = get(page, 'permissions.canSee', []).map(
      (x: any) => x.id as string
    );
    if (this.accessiblePages.includes(page.id as string)) {
      this.edit.emit({
        page: page.id,
        permissions: canSeePermissions.filter(
          (x: string) => x !== this.role.id
        ),
      });
    } else {
      this.edit.emit({
        page: page.id,
        permissions: [...canSeePermissions, this.role.id],
      });
    }
  }
}
