import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { WhoSnackBarService } from '../../services/snackbar.service';
import { User, Role } from '../../models/user.model';
import {
  AddRoleToUserMutationResponse,
  ADD_ROLE_TO_USER,
  EditUserMutationResponse,
  EDIT_USER,
  DeleteUserFromApplicationMutationResponse, DELETE_USER_FROM_APPLICATION, DELETE_USER, DeleteUserMutationResponse
} from '../../graphql/mutations';
import { WhoEditUserComponent } from './components/edit-user/edit-user.component';
import { WhoInviteUserComponent } from './components/invite-user/invite-user.component';
import { MatSort } from '@angular/material/sort';
import { PositionAttributeCategory } from '../../models/position-attribute-category.model';
import { WhoConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'who-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class WhoUsersComponent implements OnInit, AfterViewInit {

  // === INPUT DATA ===
  @Input() users: MatTableDataSource<User>;
  @Input() roles: Role[];
  @Input() positionAttributeCategories: PositionAttributeCategory[];
  @Input() applicationService: any;

  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['select', 'username', 'name', 'oid', 'roles', 'actions'];

  // === SORTING ===
  @ViewChild(MatSort) sort: MatSort;

  // === FILTERS ===
  public searchText = '';
  public roleFilter = '';
  public showFilters = false;

  selection = new SelectionModel<User>(true, []);
  loading = false;

  constructor(
    private apollo: Apollo,
    private snackBar: WhoSnackBarService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.users.filterPredicate = (data: any) => {
      return ((this.searchText.trim().length === 0 ||
        (this.searchText.trim().length > 0 && data.name.toLowerCase().includes(this.searchText.trim()))) &&
        (this.roleFilter.trim().toLowerCase().length === 0 ||
          (this.roleFilter.trim().toLowerCase().length > 0 && !!data.roles && data.roles.length > 0 &&
          data.roles.filter(r => r.title.toLowerCase().includes(this.roleFilter.trim().toLowerCase())).length > 0)));
    };
  }

  onInvite(): void {
    const dialogRef = this.dialog.open(WhoInviteUserComponent, {
      panelClass: 'add-dialog',
      data: {
        roles: this.roles,
        ...this.positionAttributeCategories && { positionAttributeCategories: this.positionAttributeCategories }
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (this.applicationService) {
          this.applicationService.inviteUser(value);
        } else {
          this.apollo.mutate<AddRoleToUserMutationResponse>({
            mutation: ADD_ROLE_TO_USER,
            variables: {
              username: value.email,
              role: value.role
            }
          }).subscribe(res => {
            if (!res.errors) {
              this.snackBar.openSnackBar(`${res.data.addRoleToUser.username} invited.`);
              this.users.data = this.users.data.concat([res.data.addRoleToUser]);
            } else {
              this.snackBar.openSnackBar('User could not be invited.', { error: true });
            }
          });
        }
      }
    });
  }

  onEdit(user: User): void {
    const dialogRef = this.dialog.open(WhoEditUserComponent, {
      panelClass: 'add-dialog',
      data: {
        user,
        availableRoles: this.roles,
        multiple: Boolean(!this.applicationService),
        ...this.positionAttributeCategories && { positionAttributeCategories: this.positionAttributeCategories }
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (this.applicationService) {
          this.applicationService.editUser(user, value);
        } else {
          this.apollo.mutate<EditUserMutationResponse>({
            mutation: EDIT_USER,
            variables: {
              id: user.id,
              roles: value.roles
            }
          }).subscribe(res => {
            this.snackBar.openSnackBar(`${user.username} roles updated.`);
            this.users.data = this.users.data.map(x => {
              if (x.id === user.id) {
                x.roles = res.data.editUser.roles.filter(role => !role.application);
              }
              return x;
            });
          });
        }
      }
    });
  }

  onDelete(users: User[]): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: 'Delete user',
        content: `Do you confirm the deletion of ${users.length > 1 ? 'the selected users' : users[0].username} ${Boolean(!this.applicationService) ? '' : 'from the application'} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.loading = true;
        this.selection.clear();
        if (this.applicationService) {
          const usernames = [];
          let roles = [];
          users.map(u => {
            usernames.push(u.username);
            roles = roles.concat(u.roles.map(r => r.id));
          });
          roles = Array.from(new Set(roles));
          this.applicationService.deleteUserFromApplication(usernames, roles, () => this.loading = false);
        } else {
          const ids = users.map(u => u.id);
          this.apollo.mutate<DeleteUserMutationResponse>({
            mutation: DELETE_USER,
            variables: { ids }
          }).subscribe(res => {
            this.loading = false;
            if (!res.errors) {
              const usersLength = ids.length;
              this.snackBar.openSnackBar(`${usersLength} user${usersLength > 1 ? 's' : ''} has been deleted`,
                { duration: 3000 });
              this.users.data = this.users.data.filter(u => !ids.includes(u.id));
            } else {
              this.snackBar.openSnackBar('Users could not be deleted.', { error: true });
            }
          });
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.users.sort = this.sort;
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
