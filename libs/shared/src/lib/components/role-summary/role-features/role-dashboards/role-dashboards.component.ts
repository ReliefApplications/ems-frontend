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
  selector: 'shared-role-dashboards',
  templateUrl: './role-dashboards.component.html',
  styleUrls: ['./role-dashboards.component.scss'],
})
export class RoleDashboardsComponent implements OnInit, OnChanges {
  /** Role */
  @Input() role!: Role;
  /** Pages array */
  @Input() pages: Page[] = [];
  /** Search query */
  @Input() search = '';
  /** Loading status */
  @Input() loading = false;

  /** Event emitter for edit */
  @Output() edit = new EventEmitter();

  /** Displayed columns array */
  public displayedColumns = ['name', 'actions'];
  /** Accessible pages string */
  public accessiblePages: string[] = [];
  /** Filtered pages array */
  public filteredPages = this.pages;

  ngOnInit(): void {
    this.accessiblePages = this.filteredPages
      .filter((x) =>
        get(x, 'permissions.canSee', [])
          .map((y: any) => y.id)
          .includes(this.role.id)
      )
      .map((x) => x.id as string);
  }

  ngOnChanges(): void {
    this.filteredPages = this.pages.filter((x) =>
      x.name?.toLowerCase().includes(this.search)
    );
    this.accessiblePages = this.filteredPages
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
    const hasAccess = this.accessiblePages.includes(page.id as string);
    this.edit.emit({
      page: page.id,
      action: { [hasAccess ? 'remove' : 'add']: [this.role.id] },
    });
  }
}
