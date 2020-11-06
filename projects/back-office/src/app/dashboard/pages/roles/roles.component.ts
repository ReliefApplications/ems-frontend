import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Role, WhoSnackBarService } from '@who-ems';
import { AddRoleMutationResponse, ADD_ROLE, EditRoleMutationResponse, EDIT_ROLE } from '../../../graphql/mutations';
import { GetRolesQueryResponse, GET_ROLES } from '../../../graphql/queries';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public roles = [];
  public displayedColumns = ['title', 'usersCount', 'actions'];

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: WhoSnackBarService
  ) { }

  /*  Load the roles.
  */
  ngOnInit(): void {
    this.getRoles();
  }

  /*  Load the roles.
  */
  private getRoles(): void {
    this.apollo.watchQuery<GetRolesQueryResponse>({
      query: GET_ROLES
    }).valueChanges.subscribe(res => {
      this.roles = res.data.roles;
      this.loading = res.loading;
    });
  }

  /*  Display the AddRole modal, and create a role when closed, if there is a result.
  */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddRoleComponent);
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<AddRoleMutationResponse>({
          mutation: ADD_ROLE,
          variables: {
            title: value.title
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar(`${value.title} role created`);
          this.getRoles();
        });
      }
    });
  }

  /*  Display the EditRole modal, passing a role as a parameter.
    Edit the role when closed, if there is a result.
  */
  onEdit(role: Role): void {
    const dialogRef = this.dialog.open(EditRoleComponent, {
      data: {
        role
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<EditRoleMutationResponse>({
          mutation: EDIT_ROLE,
          variables: {
            id: role.id,
            permissions: value.permissions
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar(`${role.title} role updated.`);
          this.getRoles();
        });
      }
    });
  }
}
