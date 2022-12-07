import { Apollo } from 'apollo-angular';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SafeSnackBarService } from '../../services/snackbar/snackbar.service';
import { User, Role } from '../../models/user.model';
import {
  DELETE_USERS,
  DeleteUsersMutationResponse,
  AddUsersMutationResponse,
  ADD_USERS,
} from './graphql/mutations';
import { MatSort } from '@angular/material/sort';
import { PositionAttributeCategory } from '../../models/position-attribute-category.model';
import { SafeConfirmService } from '../../services/confirm/confirm.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SafeInviteUsersComponent } from './components/invite-users/invite-users.component';
import { SafeAuthService } from '../../services/auth/auth.service';
import { SafeDownloadService } from '../../services/download/download.service';
import { TranslateService } from '@ngx-translate/core';
import { SafeApplicationService } from '../../services/application/application.service';
import { Router, ActivatedRoute } from '@angular/router';

/** User columns to display for the main user administration page */
const ADMIN_COLUMNS = ['select', 'name', 'username', 'oid', 'roles', 'actions'];

/** User columns to display for the user administration page in an application */
const APPLICATION_COLUMNS = [
  'select',
  'name',
  'username',
  'oid',
  'roles',
  'attributes',
  'actions',
];

/**
 * A component to display the list of users
 */
@Component({
  selector: 'safe-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class SafeUsersComponent implements OnInit, AfterViewInit {
  // === INPUT DATA ===
  @Input() users: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  @Input() roles: Role[] = [];
  @Input() positionAttributeCategories: PositionAttributeCategory[] = [];
  @Input() applicationService?: SafeApplicationService;
  @Input() loading = true;

  // === DISPLAYED COLUMNS ===
  public displayedColumns: string[] = [];

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERS ===
  public searchText = '';
  public roleFilter = '';
  public showFilters = false;

  selection = new SelectionModel<User>(true, []);

  /**
   * Constructor of the users component
   *
   * @param apollo The apollo client
   * @param snackBar The snack bar service
   * @param authService The authentication service
   * @param dialog The material dialog service
   * @param downloadService The download service
   * @param confirmService The confirm service
   * @param translate The translation service
   * @param router Angular router
   * @param activatedRoute Angular active route
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    public dialog: MatDialog,
    private downloadService: SafeDownloadService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.applicationService) {
      this.displayedColumns = APPLICATION_COLUMNS;
    } else {
      this.displayedColumns = ADMIN_COLUMNS;
    }
    this.users.filterPredicate = (data: any) =>
      (this.searchText.trim().length === 0 ||
        (this.searchText.trim().length > 0 &&
          !!data.name &&
          data.name.toLowerCase().includes(this.searchText.trim()))) &&
      (this.roleFilter.trim().toLowerCase().length === 0 ||
        (this.roleFilter.trim().toLowerCase().length > 0 &&
          !!data.roles &&
          data.roles.length > 0 &&
          data.roles.filter((r: any) =>
            r.title.toLowerCase().includes(this.roleFilter.trim().toLowerCase())
          ).length > 0));
  }

  /**
   * Show a dialog for inviting someone
   */
  onInvite(): void {
    const dialogRef = this.dialog.open(SafeInviteUsersComponent, {
      data: {
        roles: this.roles,
        users: this.users.data,
        downloadPath: this.applicationService
          ? this.applicationService.usersDownloadPath
          : 'download/invite',
        uploadPath: this.applicationService
          ? this.applicationService.usersUploadPath
          : 'upload/invite',
        ...(this.positionAttributeCategories && {
          positionAttributeCategories: this.positionAttributeCategories,
        }),
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<AddUsersMutationResponse>({
            mutation: ADD_USERS,
            variables: {
              users: value,
              application: this.roles[0].application?.id,
            },
          })
          .subscribe((res) => {
            if (!res.errors) {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectInvited', {
                  name: this.translate
                    .instant(
                      res.data?.addUsers.length
                        ? 'common.user.few'
                        : 'common.user.one'
                    )
                    .toLowerCase(),
                })
              );
              this.users.data = this.users.data.concat(
                res?.data?.addUsers || []
              );
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotInvited',
                  {
                    name: this.translate
                      .instant(
                        res.data?.addUsers.length
                          ? 'common.user.few'
                          : 'common.user.one'
                      )
                      .toLowerCase(),
                  }
                ),
                { error: true }
              );
            }
          });
      }
    });
  }

  /**
   * Handle click on user row.
   * Redirect to user page
   *
   * @param user user to see details of
   */
  onClick(user: User): void {
    this.router.navigate([user.id], { relativeTo: this.activatedRoute });
  }

  /**
   * Show a dialog to confirm the deletion of users
   *
   * @param users The list of users to delete
   */
  onDelete(users: User[]): void {
    let title = this.translate.instant('common.deleteObject', {
      name: this.translate.instant('common.user.one'),
    });
    let content = this.translate.instant(
      'components.user.delete.confirmationMessage',
      {
        name: users[0].username,
      }
    );
    if (users.length > 1) {
      title = this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.user.few'),
      });
      content = this.translate.instant(
        'components.user.delete.confirmationMessage',
        {
          name: users[0].username,
        }
      );
    }
    const dialogRef = this.confirmService.openConfirmModal({
      title,
      content,
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmColor: 'warn',
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const ids = users.map((u) => u.id);
        this.loading = true;
        this.selection.clear();
        if (this.applicationService) {
          this.applicationService.deleteUsersFromApplication(
            ids,
            () => (this.loading = false)
          );
        } else {
          this.apollo
            .mutate<DeleteUsersMutationResponse>({
              mutation: DELETE_USERS,
              variables: { ids },
            })
            .subscribe((res) => {
              this.loading = false;
              if (res.data?.deleteUsers) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectDeleted', {
                    value: this.translate
                      .instant(
                        res.data.deleteUsers > 1
                          ? 'common.user.few'
                          : 'common.user.one'
                      )
                      .toLowerCase(),
                  })
                );
                this.users.data = this.users.data.filter(
                  (u) => !ids.includes(u.id)
                );
              } else {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotDeleted',
                    {
                      value: this.translate
                        .instant(
                          ids.length > 1 ? 'common.user.few' : 'common.user.one'
                        )
                        .toLowerCase(),
                      error: '',
                    }
                  ),
                  { error: true }
                );
              }
            });
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.users.sort = this.sort || null;
  }

  /**
   * Apply the filters to the list
   *
   * @param column The column used for filtering
   * @param event The event triggered on filter action
   */
  applyFilter(column: string, event: any): void {
    if (column === 'role') {
      this.roleFilter = !!event.value ? event.value.trim() : '';
    } else {
      this.searchText = !!event
        ? event.target.value.trim().toLowerCase()
        : this.searchText;
    }
    this.users.filter = '##';
  }

  /**
   * Clear all the filters
   */
  clearAllFilters(): void {
    this.searchText = '';
    this.roleFilter = '';
    this.applyFilter('', null);
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   *
   * @returns True if it matches, else False
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.users.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected()
      ? this.selection.clear()
      : this.users.data.forEach((row) => this.selection.select(row));
  }

  /**
   * Get the label for the checkbox on the passed row
   *
   * @param row The current row
   * @returns The label for the checkbox
   */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  /**
   * Export the list of users
   *
   * @param type The type of file we want ('csv' or 'xlsx')
   */
  async onExport(type: string) {
    // if is inside of an application
    if (this.applicationService)
      this.applicationService.application$.subscribe((app) => {
        if (!app) return;
        this.downloadService.getUsersExport(
          type,
          this.selection.selected
            .map((x) => x.id || '')
            .filter((x) => x !== ''),
          app
        );
      });
    // if exporting backoffice users
    else
      this.downloadService.getUsersExport(
        type,
        this.selection.selected.map((x) => x.id || '').filter((x) => x !== '')
      );
  }
}
