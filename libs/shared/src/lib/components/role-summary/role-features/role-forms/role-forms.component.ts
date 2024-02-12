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

/** Component for the forms section of the roles features */
@Component({
  selector: 'shared-role-forms',
  templateUrl: './role-forms.component.html',
  styleUrls: ['./role-forms.component.scss'],
})
export class RoleFormsComponent implements OnInit, OnChanges {
  /** Role */
  @Input() role!: Role;
  /** Pages array */
  @Input() pages: Page[] = [];
  /** Loading status */
  @Input() loading = false;
  /** Search string */
  @Input() search = '';

  /** Event emitter for edit */
  @Output() edit = new EventEmitter();

  /** Columns to display */
  public displayedColumns = ['name', 'actions'];
  /** Accessible pages array */
  public accessiblePages: string[] = [];
  /** Filtered pages array */
  public filteredPages = this.pages;

  ngOnInit(): void {
    this.accessiblePages = this.getAccessibleElementIds(this.filteredPages);
  }

  ngOnChanges(): void {
    this.filteredPages = this.pages.filter((x) =>
      x.name?.toLowerCase().includes(this.search)
    );
    this.accessiblePages = this.getAccessibleElementIds(this.filteredPages);
  }

  /**
   *Returns the page ids that can be access by the current role
   *
   * @param filteredElements Elements to check if can be access by the current role
   * @returns ids of the elements that can be access by the current role
   */
  private getAccessibleElementIds(filteredElements: Array<Page>): string[] {
    return filteredElements
      .filter((x) =>
        get(x, 'permissions.canSee', [])
          .map((y: any) => y.id)
          .includes(this.role.id)
      )
      .map((x) => x.id as string);
  }

  /**
   * Emits an event with the changes in permission for a given form page
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
