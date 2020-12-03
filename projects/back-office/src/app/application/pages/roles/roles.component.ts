import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, Role, WhoConfirmModalComponent } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../services/application.service';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, OnDestroy {

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
    });
  }

  ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddRoleComponent);
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.addRole(value);
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
        this.applicationService.editRole(role, value);
      }
    });
  }

  /* Display a modal to confirm the deletion of the role.
    If confirmed, the role is removed from the system.
  */
  onDelete(item: any): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: 'Delete role',
        content: `Do you confirm the deletion of the role ${item.title} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.deleteRole(item);
      }
    });
  }

}
