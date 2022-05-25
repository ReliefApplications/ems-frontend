import { Apollo } from 'apollo-angular';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { Application } from '../../models/application.model';
import { Role } from '../../models/user.model';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SafeSnackBarService } from '../../services/snackbar.service';
import { SafeApplicationService } from '../../services/application.service';
import { SafeAddRoleComponent } from './components/add-role/add-role.component';
import { SafeEditRoleComponent } from './components/edit-role/edit-role.component';
import {
  AddRoleMutationResponse,
  ADD_ROLE,
  DeleteRoleMutationResponse,
  DELETE_ROLE,
  EditRoleMutationResponse,
  EDIT_ROLE,
} from '../../graphql/mutations';
import { GetRolesQueryResponse, GET_ROLES } from '../../graphql/queries';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'safe-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class SafeRolesComponent implements OnInit, OnDestroy, AfterViewInit {
  // === INPUT DATA ===
  @Input() inApplication = false;

  // === DATA ===
  public loading = true;
  public roles: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public displayedColumns = ['title', 'usersCount', 'actions'];
  private applicationSubscription?: Subscription;

  // === SORTING ===
  @ViewChild(MatSort) sort!: MatSort;

  // === FILTERS ===
  public filters = [
    { id: 'title', value: '' },
    { id: 'usersCount', value: '' },
  ];
  public showFilters = false;
  public searchText = '';
  public usersFilter = '';

  constructor(
    public dialog: MatDialog,
    private applicationService: SafeApplicationService,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.filterPredicate();

    if (this.inApplication) {
      this.loading = false;
      this.applicationSubscription =
        this.applicationService.application$.subscribe(
          (application: Application | null) => {
            if (application) {
              this.roles.data = application.roles || [];
            } else {
              this.roles.data = [];
            }
          }
        );
    } else {
      this.getRoles();
    }
  }

  private filterPredicate(): void {
    this.roles.filterPredicate = (data: any) =>
      (this.searchText.trim().length === 0 ||
        (this.searchText.trim().length > 0 &&
          data.title.toLowerCase().includes(this.searchText.trim()))) &&
      (this.usersFilter.trim().length === 0 ||
        (this.usersFilter.trim().length > 0 &&
          data.usersCount.toString().includes(this.usersFilter.trim())));
  }

  /*  Load the roles.
   */
  private getRoles(): void {
    this.apollo
      .watchQuery<GetRolesQueryResponse>({
        query: GET_ROLES,
      })
      .valueChanges.subscribe((res) => {
        this.roles.data = res.data.roles;
        this.loading = res.loading;
      });
  }

  ngOnDestroy(): void {
    if (this.inApplication && this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(SafeAddRoleComponent);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (this.inApplication) {
          this.applicationService.addRole(value);
        } else {
          this.apollo
            .mutate<AddRoleMutationResponse>({
              mutation: ADD_ROLE,
              variables: {
                title: value.title,
              },
            })
            .subscribe(
              (res) => {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectCreated', {
                    type: this.translate
                      .instant('common.role.one')
                      .toLowerCase(),
                    value: value.title,
                  })
                );
                this.getRoles();
              },
              (err) => {
                console.log(err);
              }
            );
        }
      }
    });
  }

  /*  Display the EditRole modal, passing a role as a parameter.
    Edit the role when closed, if there is a result.
  */
  onEdit(role: Role): void {
    const dialogRef = this.dialog.open(SafeEditRoleComponent, {
      data: {
        role,
        application: this.inApplication,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (this.inApplication) {
          this.applicationService.editRole(role, value);
        } else {
          this.apollo
            .mutate<EditRoleMutationResponse>({
              mutation: EDIT_ROLE,
              variables: {
                id: role.id,
                permissions: value.permissions,
                channels: value.channels,
                title: value.title,
              },
            })
            .subscribe((res) => {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectUpdated', {
                  type: this.translate.instant('common.role.one').toLowerCase(),
                  value: role.title,
                })
              );
              this.getRoles();
            });
        }
      }
    });
  }

  /* Display a modal to confirm the deletion of the role.
    If confirmed, the role is removed from the system.
  */
  onDelete(item: any): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('components.role.delete.title'),
        content: this.translate.instant(
          'components.role.delete.confirmationMessage',
          {
            name: item.title,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
        confirmColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (this.inApplication) {
          this.applicationService.deleteRole(item);
        } else {
          this.apollo
            .mutate<DeleteRoleMutationResponse>({
              mutation: DELETE_ROLE,
              variables: {
                id: item.id,
              },
            })
            .subscribe((res) => {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectDeleted', {
                  value: item.title,
                })
              );
              this.getRoles();
            });
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.roles.sort = this.sort;
  }

  applyFilter(column: string, event: any): void {
    if (column === 'usersCount') {
      this.usersFilter = !!event.target
        ? event.target.value.trim().toLowerCase()
        : '';
    } else {
      this.searchText = !!event
        ? event.target.value.trim().toLowerCase()
        : this.searchText;
    }
    this.roles.filter = '##';
  }

  clearAllFilters(): void {
    this.searchText = '';
    this.usersFilter = '';
    this.applyFilter('', null);
  }
}
