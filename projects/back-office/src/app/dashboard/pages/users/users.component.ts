import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { GetUsersQueryResponse, GET_USERS } from '../../../graphql/queries';
import { EditUserMutationResponse, EDIT_USER } from '../../../graphql/mutations';
import { User, WhoSnackBarService } from '@who-ems/builder';
import { EditUserComponent } from './components/edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
/*  Accessible with '/settings/users' route.
  Managelent of users.
*/
export class UsersComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public users = [];
  public displayedColumns = ['username', 'name', 'oid', 'roles', 'actions'];

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService
  ) { }

  /*  Load the users/
  */
  ngOnInit(): void {
    this.getUsers();
  }

  /*  Load the users/
  */
  private getUsers(): void {
    this.apollo.watchQuery<GetUsersQueryResponse>({
      query: GET_USERS
    }).valueChanges.subscribe(res => {
      this.users = res.data.users;
      this.loading = res.loading;
    });
  }

  /*  Display the EditUser modal, passing an user as parameter.
    Edit the user when closed, if there is a result.
  */
  onEdit(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      data: {
        roles: user.roles
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<EditUserMutationResponse>({
          mutation: EDIT_USER,
          variables: {
            id: user.id,
            roles: value.roles
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar(`${user.username} roles updated.`);
          this.getUsers();
        });
      }
    });
  }
}
