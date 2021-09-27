import {Apollo} from 'apollo-angular';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SafeSnackBarService } from '../../services/snackbar.service';
import { SafeApplicationService } from '../../services/application.service';
import { User, Role } from '../../models/user.model';
import {
  EditUserMutationResponse,
  EDIT_USER,
  DELETE_USERS, DeleteUsersMutationResponse, AddUsersMutationResponse, ADD_USERS
} from '../../graphql/mutations';
import { SafeEditUserComponent } from './components/edit-user/edit-user.component';
import { MatSort } from '@angular/material/sort';
import { PositionAttributeCategory } from '../../models/position-attribute-category.model';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SelectionModel } from '@angular/cdk/collections';
import { NOTIFICATIONS } from '../../const/notifications';
import { SafeInviteUsersComponent } from './components/invite-users/invite-users.component';

@Component({
  selector: 'safe-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class SafeUsersComponent implements OnInit, AfterViewInit {

  // === INPUT DATA ===
  @Input() users: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  @Input() roles: Role[] = [];
  @Input() positionAttributeCategories: PositionAttributeCategory[] = [];
  @Input() applicationService?: SafeApplicationService;

  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['select', 'username', 'name', 'oid', 'attributes', 'roles', 'actions'];

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERS ===
  public searchText = '';
  public roleFilter = '';
  public showFilters = false;

  selection = new SelectionModel<User>(true, []);
  loading = false;

  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.users.filterPredicate = (data: any) => {
      return (
        (this.searchText.trim().length === 0 ||
          (this.searchText.trim().length > 0 && !!data.name && data.name.toLowerCase().includes(this.searchText.trim()))) &&
        (this.roleFilter.trim().toLowerCase().length === 0 ||
          (this.roleFilter.trim().toLowerCase().length > 0 && !!data.roles && data.roles.length > 0 &&
            data.roles.filter((r: any) => r.title.toLowerCase().includes(this.roleFilter.trim().toLowerCase())).length > 0))
      );
    };
  }

  onInvite(): void {
    const dialogRef = this.dialog.open(SafeInviteUsersComponent, {
      panelClass: 'add-dialog',
      data: {
        roles: this.roles,
        users: this.users.data,
        downloadPath: this.applicationService ? this.applicationService.usersDownloadPath : 'download/invite',
        uploadPath: this.applicationService ? this.applicationService.usersUploadPath : 'upload/invite',
        ...this.positionAttributeCategories && { positionAttributeCategories: this.positionAttributeCategories }
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.loading = true;
        if (this.applicationService) {
          this.applicationService.inviteUser(value, () => this.loading = false);
        } else {
          this.apollo.mutate<AddUsersMutationResponse>({
            mutation: ADD_USERS,
            variables: {
              users: value
            }
          }).subscribe(res => {
            if (!res.errors) {
              this.snackBar.openSnackBar(NOTIFICATIONS.usersActions('invited', res?.data?.addUsers.length));
              this.users.data = this.users.data.concat(res?.data?.addUsers || []);
            } else {
              this.snackBar.openSnackBar(NOTIFICATIONS.userInvalidActions('invited'), { error: true });
            }
            this.loading = false;
          });
        }
      }
    });
  }

  onEdit(user: User): void {
    const dialogRef = this.dialog.open(SafeEditUserComponent, {
      data: {
        user,
        availableRoles: this.roles,
        multiple: true,
        ...this.positionAttributeCategories && { positionAttributeCategories: this.positionAttributeCategories }
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.loading = true;
        if (this.applicationService) {
          this.applicationService.editUser(user, value, () => this.loading = false);
        } else {
          this.apollo.mutate<EditUserMutationResponse>({
            mutation: EDIT_USER,
            variables: {
              id: user.id,
              roles: value.roles,
              ...value.positionAttributes && { positionAttributes: value.positionAttributes }
            }
          }).subscribe(res => {
            if (res.data) {
              this.snackBar.openSnackBar(NOTIFICATIONS.userRolesUpdated(user.username));
              this.users.data = this.users.data.map(x => {
                if (x.id === user.id) {
                  x.roles = res.data?.editUser?.roles?.filter(role => !role.application);
                }
                return x;
              });
            }
            this.loading = false;
          });
        }
      }
    });
  }

  onDelete(users: User[]): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete user',
        content: `Do you confirm the deletion of ${users.length > 1 ? 'the selected users' : users[0].username} ${Boolean(!this.applicationService) ? '' : 'from the application'} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const ids = users.map(u => u.id);
        this.loading = true;
        this.selection.clear();
        if (this.applicationService) {
          this.applicationService.deleteUsersFromApplication(ids, () => this.loading = false);
        } else {
          this.apollo.mutate<DeleteUsersMutationResponse>({
            mutation: DELETE_USERS,
            variables: { ids }
          }).subscribe(res => {
            this.loading = false;
            if (res.data?.deleteUsers) {
              this.snackBar.openSnackBar(NOTIFICATIONS.usersActions('deleted', res.data.deleteUsers));
              this.users.data = this.users.data.filter(u => !ids.includes(u.id));
            } else {
              this.snackBar.openSnackBar(NOTIFICATIONS.userInvalidActions('deleted'), { error: true });
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
      this.searchText = !!event ? event.target.value.trim().toLowerCase() : this.searchText;
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
    this.isAllSelected() ?
      this.selection.clear() :
      this.users.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
