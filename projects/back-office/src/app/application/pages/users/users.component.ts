import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Application, User } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../services/application.service';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { InviteUserComponent } from './components/invite-user/invite-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public users = new MatTableDataSource<User>([]);
  public displayedColumns = ['username', 'name', 'oid', 'roles', 'actions'];
  private applicationSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      console.log(application);
      if (application) {
        this.users.data = application.users;
      } else {
        this.users.data = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
  }

  onInvite(): void {
    const dialogRef = this.dialog.open(InviteUserComponent, {
      panelClass: 'add-dialog'
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.inviteUser(value);
      }
    });
  }

  onEdit(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      panelClass: 'add-dialog',
      data: {
        roles: user.roles
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.editUser(user, value);
      }
    });
  }

}
