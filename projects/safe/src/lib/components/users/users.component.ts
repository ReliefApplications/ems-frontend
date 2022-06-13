import { Apollo } from 'apollo-angular';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SafeSnackBarService } from '../../services/snackbar.service';
import { User, Role } from '../../models/user.model';
import {
  EditUserMutationResponse,
  EDIT_USER,
  DELETE_USERS,
  DeleteUsersMutationResponse,
  AddUsersMutationResponse,
  ADD_USERS,
} from '../../graphql/mutations';
import { SafeEditUserComponent } from './components/edit-user/edit-user.component';
import { MatSort } from '@angular/material/sort';
import { PositionAttributeCategory } from '../../models/position-attribute-category.model';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SelectionModel } from '@angular/cdk/collections';
import { SafeInviteUsersComponent } from './components/invite-users/invite-users.component';
import { SafeAuthService } from '../../services/auth.service';
import { SafeDownloadService } from '../../services/download.service';
import { Application } from '../../models/application.model';
import { TranslateService } from '@ngx-translate/core';
import { SafeApplicationService } from '../../services/application.service';
import { PageEvent } from '@angular/material/paginator';

const ADMIN_COLUMNS = ['select', 'name', 'username', 'oid', 'roles', 'actions'];

const APPLICATION_COLUMNS = [
  'select',
  'name',
  'username',
  'oid',
  'roles',
  'attributes',
  'actions',
];

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
  @Input() pageInfo!: {
    pageIndex: number;
    pageSize: number;
    length: number;
    endCursor: string;
  };

  @Output() page = new EventEmitter<PageEvent>();

  // === DISPLAYED COLUMNS ===
  public displayedColumns: string[] = [];

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERS ===
  public searchText = '';
  public roleFilter = '';
  public showFilters = false;

  selection = new SelectionModel<User>(true, []);

  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    public dialog: MatDialog,
    private downloadService: SafeDownloadService,
    private translate: TranslateService
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

  onInvite(): void {
    const dialogRef = this.dialog.open(SafeInviteUsersComponent, {
      panelClass: 'add-dialog',
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

  onEdit(user: User): void {
    const dialogRef = this.dialog.open(SafeEditUserComponent, {
      data: {
        user,
        availableRoles: this.roles,
        ...(this.positionAttributeCategories && {
          positionAttributeCategories: this.positionAttributeCategories,
        }),
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (this.applicationService) {
          this.applicationService.editUser(user, value);
        } else {
          this.apollo
            .mutate<EditUserMutationResponse>({
              mutation: EDIT_USER,
              variables: {
                id: user.id,
                roles: value.roles,
              },
            })
            .subscribe((res) => {
              if (res.data) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'models.user.notifications.rolesUpdated',
                    {
                      username: user.username,
                    }
                  )
                );
                this.users.data = this.users.data.map((x) => {
                  if (x.id === user.id) {
                    x = {
                      ...x,
                      roles: res.data?.editUser?.roles?.filter(
                        (role) => !role.application
                      ),
                    };
                  }
                  return x;
                });
                this.authService.getProfile();
              }
            });
        }
      }
    });
  }

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
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title,
        content,
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
        confirmColor: 'warn',
      },
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

  clearAllFilters(): void {
    this.searchText = '';
    this.roleFilter = '';
    this.applyFilter('', null);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.users.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected()
      ? this.selection.clear()
      : this.users.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  onExport(type: string): void {
    // if we are in the Users page of an application
    if (this.applicationService) {
      this.applicationService.application$.subscribe(
        (value: Application | null) => {
          const fileName = `users_${value?.name}.${type}`;
          const path = `download/application/${value?.id}/users`;
          const queryString = new URLSearchParams({ type }).toString();
          this.downloadService.getFile(
            `${path}?${queryString}`,
            `text/${type};charset=utf-8;`,
            fileName
          );
        }
      );
    } else {
      const fileName = `users.${type}`;
      const path = `download/users`;
      const queryString = new URLSearchParams({ type }).toString();
      this.downloadService.getFile(
        `${path}?${queryString}`,
        `text/${type};charset=utf-8;`,
        fileName
      );
    }
  }

  /**
   * Emits an page event
   *
   * @param e The page event
   */
  onPage(e: PageEvent) {
    this.page.emit(e);
  }
}
