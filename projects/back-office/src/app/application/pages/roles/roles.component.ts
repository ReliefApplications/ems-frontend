import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, Role } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../services/application.service';

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
  private applicationSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.roles = application.roles;
      } else {
        this.roles = [];
      }
      console.log(this.roles);
    });
  }

  onAdd(): void {}

  onEdit(role: Role): void {}

}
