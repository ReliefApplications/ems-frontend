import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, Role, User } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../services/application.service';
import { InviteUserComponent } from './components/invite-user/invite-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public users: User[] = [];
  public displayedColumns = ['username', 'name', 'oid', 'roles', 'actions'];
  private applicationSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.users = application.users;
      } else {
        this.users = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
  }

  onInvite(): void {
    const dialogRef = this.dialog.open(InviteUserComponent);
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.inviteUser(value);
      }
    });
  }

  onEdit(user: User): void {}

}
