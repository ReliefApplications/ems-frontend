import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { WhoSnackBarService } from '../../services/snackbar.service';
import { User, Role } from '../../models/user.model';
import { AddRoleToUserMutationResponse, ADD_ROLE_TO_USER, EditUserMutationResponse, EDIT_USER } from '../../graphql/mutations';
import { WhoEditUserComponent } from './components/edit-user/edit-user.component';
import { WhoInviteUserComponent } from './components/invite-user/invite-user.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'who-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class WhoUsersComponent implements OnInit, AfterViewInit {

  // === INPUT DATA ===
  @Input() users: MatTableDataSource<User>;
  @Input() roles: Role[];
  @Input() applicationService: any;

  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['username', 'name', 'oid', 'roles', 'actions'];

  // === SORTING ===
  @ViewChild(MatSort) sort: MatSort;

  // === FILTERS ===
  public filters = [{id: 'username', value: ''}, {id: 'name', value: ''}, {id: 'oid', value: ''}, {id: 'roles', value: ''},
    {id: 'actions', value: ''}];

  constructor(
    private apollo: Apollo,
    private snackBar: WhoSnackBarService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.users.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);

      filters.forEach(filter => {
        // check for null values
        let val = !!data[filter.id] ? data[filter.id] : '';
        // for filter roles we have to check if is an array
        if (val instanceof Array) {
          val = val.length > 0 ? val[0].title : '';
        }
        matchFilter.push(val.toString().toLowerCase().includes(filter.value.toLowerCase()));
      });

      return matchFilter.every(Boolean); // AND condition
      // return matchFilter.some(Boolean); // OR condition
    };
  }

  onInvite(): void {
    const dialogRef = this.dialog.open(WhoInviteUserComponent, {
      panelClass: 'add-dialog',
      data: {
        roles: this.roles
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
            this.snackBar.openSnackBar(`${res.data.addRoleToUser.username} invited.`);
            this.users.data = this.users.data.concat([res.data.addRoleToUser]);
          });
        }
      }
    });
  }

  onEdit(user: User): void {
    const dialogRef = this.dialog.open(WhoEditUserComponent, {
      panelClass: 'add-dialog',
      data: {
        userRoles: user.roles,
        availableRoles: this.roles,
        multiple: Boolean(!this.applicationService)
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

  applyFilter(column: any, event: any): void {
    this.filters.map(f => {
      if (f.id === column) {
        f.value = event.target.value;
      }
    });
    this.users.filter = JSON.stringify(this.filters);
  }
}
