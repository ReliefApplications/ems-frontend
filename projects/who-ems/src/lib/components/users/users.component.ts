import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { WhoSnackBarService } from '../../services/snackbar.service';
import { User, Role } from '../../models/user.model';
import { AddRoleToUserMutationResponse, ADD_ROLE_TO_USER, EditUserMutationResponse, EDIT_USER } from '../../graphql/mutations';
import { WhoEditUserComponent } from './components/edit-user/edit-user.component';
import { WhoInviteUserComponent } from './components/invite-user/invite-user.component';
import { MatSort } from '@angular/material/sort';
import { PositionAttributeCategory } from '../../models/position-attribute-category.model';

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
  public displayedColumns = ['username', 'name', 'oid', 'roles', 'actions'];

  // === SORTING ===
  @ViewChild(MatSort) sort: MatSort;

  // === FILTERS ===
  public searchText = '';
  public roleFilter = '';
  public showFilters = false;

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
}
