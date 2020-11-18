import { Component, OnDestroy, OnInit } from '@angular/core';
import { Application, User } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public users = [];
  public displayedColumns = ['username', 'name', 'oid', 'roles', 'actions'];
  private applicationSubscription: Subscription;

  constructor(
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

  onEdit(user: User): void {
    console.log(user);
  }

}
