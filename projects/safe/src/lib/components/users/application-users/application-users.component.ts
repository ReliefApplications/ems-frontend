import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, Role } from '../../../models/user.model';
import { PositionAttributeCategory } from '../../../models/position-attribute-category.model';
import { SafeConfirmService } from '../../../services/confirm/confirm.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SafeInviteUsersComponent } from '../components/invite-users/invite-users.component';
import { SafeDownloadService } from '../../../services/download/download.service';
import { Application } from '../../../models/application.model';
import { TranslateService } from '@ngx-translate/core';
import { SafeApplicationUsersService } from '../../../services/application-users/application-users.service';
import { SafeApplicationService } from '../../../services/application/application.service';

/** Initial page info */
const INIT_PAGE_INFO = {
  users: {
    endCursor: '',
    hasNextPage: true,
    totalCount: 0,
  },
  autoAssignedUsers: {
    endCursor: '',
    hasNextPage: true,
    totalCount: 0,
  },
};

/** Columns displayed in the app users table */
const APP_USERS_COLUMNS = [
  'select',
  'name',
  'username',
  'oid',
  'roles',
  'attributes',
  'actions',
];

/** Application users */
@Component({
  selector: 'safe-application-users',
  templateUrl: './application-users.component.html',
  styleUrls: ['./application-users.component.scss'],
})
export class SafeApplicationUsersComponent implements OnInit {
  // Application users data sources
  public users: User[] = [];
  public autoUsers: User[] = [];

  public pageInfo = INIT_PAGE_INFO;

  // Application data
  public roles: Role[] = [];
  public positionAttributeCategories: PositionAttributeCategory[] = [];

  // Loading states
  public loadingUsers = true;
  public loadingAutoUsers = true;
  public loadingAppData = true;

  // Columns to be displayed
  public manualColumns = APP_USERS_COLUMNS;
  public autoColumns = APP_USERS_COLUMNS.filter((col) => col !== 'actions');

  // === FILTERS ===
  public searchText = '';
  public roleFilter = '';
  public showFilters = false;

  // === SELECTION ===
  public selection = new SelectionModel<User>(true, []);
  public selectingFrom: 'manual' | 'auto' = 'manual';

  /**
   * Constructor of the users component
   *
   * @param dialog The material dialog service
   * @param downloadService The download service
   * @param confirmService The confirm service
   * @param translate The translation service
   * @param appService Shared application service
   * @param usersService Shared application users service
   */
  constructor(
    public dialog: MatDialog,
    private downloadService: SafeDownloadService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private appService: SafeApplicationService,
    public usersService: SafeApplicationUsersService
  ) {}

  async ngOnInit(): Promise<void> {
    // Subscribe to data
    this.appService.application$.subscribe((app) => {
      if (!app) return;
      this.roles = app.roles || [];
      this.positionAttributeCategories = app.positionAttributeCategories || [];
      this.loadingAppData = false;
    });

    this.usersService.users$.subscribe((users) => {
      this.users = users;
      this.pageInfo.users = this.usersService.getManualPageInfo();
      this.loadingUsers = false;
    });

    this.usersService.autoAssignedUsers$.subscribe((users) => {
      this.autoUsers = users;
      this.pageInfo.autoAssignedUsers = this.usersService.getAutoPageInfo();
      this.loadingAutoUsers = false;
    });
  }

  /**
   * Show a dialog for inviting someone
   */
  public onInvite(): void {
    const dialogRef = this.dialog.open(SafeInviteUsersComponent, {
      data: {
        roles: this.roles,
        users: this.users,
        downloadPath: this.appService
          ? this.appService.usersDownloadPath
          : 'download/invite',
        uploadPath: this.appService
          ? this.appService.usersUploadPath
          : 'upload/invite',
        ...(this.positionAttributeCategories && {
          positionAttributeCategories: this.positionAttributeCategories,
        }),
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.usersService.addUsers(value);
      }
    });
  }

  /**
   * Show a dialog to confirm the deletion of users
   *
   * @param users The list of users to delete
   */
  async onDelete(users: User[]): Promise<void> {
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
    const value = await this.confirmService
      .openConfirmModal({
        title,
        content,
        confirmText: this.translate.instant('components.confirmModal.delete'),
        confirmColor: 'warn',
      })
      .afterClosed()
      .toPromise();

    if (value) {
      const ids = users.map((u) => u.id);
      this.loadingUsers = true;
      this.selection.clear();
      await this.usersService.removeUsers(ids);
      this.loadingUsers = false;
    }
  }

  /**
   * Export the list of users
   *
   * @param type The type of file we want ('csv' or 'xlsx')
   */
  onExport(type: string): void {
    // if we are in the Users page of an application
    this.appService.application$.subscribe((value: Application | null) => {
      const fileName = `users_${value?.name}.${type}`;
      const path = `download/application/${value?.id}/users`;
      const queryString = new URLSearchParams({ type }).toString();
      this.downloadService.getFile(
        `${path}?${queryString}`,
        `text/${type};charset=utf-8;`,
        fileName
      );
    });
  }

  /**
   *  Updates selection value when a row is selected or deselected
   *
   * @param table Origin of the selection
   * @param event The selection event
   */
  onSelectionChange(
    table: 'manual' | 'auto',
    event: SelectionModel<User>
  ): void {
    this.selectingFrom = table;
    this.selection = event;
  }
}
