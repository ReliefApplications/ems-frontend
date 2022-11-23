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

import { Application } from '../../../../models/application.model';
import { Role } from '../../../../models/user.model';
import { SafeConfirmService } from '../../../../services/confirm/confirm.service';
import { SafeSnackBarService } from '../../../../services/snackbar/snackbar.service';
import { SafeApplicationService } from '../../../../services/application/application.service';
import { SafeAddRoleComponent } from '../add-role/add-role.component';
import {
  AddRoleMutationResponse,
  ADD_ROLE,
  DeleteRoleMutationResponse,
  DELETE_ROLE,
} from '../../graphql/mutations';
import { GetRolesQueryResponse, GET_ROLES } from '../../graphql/queries';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * This component is used to display the back-office roles tab
 * in the platform
 */
@Component({
  selector: 'safe-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class SafeRoleListComponent implements OnInit, OnDestroy, AfterViewInit {
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

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param dialog This is the Angular Material Dialog service.
   * @param applicationService This is the service that will be used to get
   * the application data from the backend.
   * @param apollo This is the Apollo client that will be used to make GraphQL
   * requests.
   * @param snackBar This is the service that will be used to display the snackbar.
   * @param confirmService This is the service that will be used to display the
   * confirm window.
   * @param translate This is the service that is used to
   * translate the text in the application.
   * @param router Angular router
   * @param activatedRoute Current Angular route
   */
  constructor(
    public dialog: MatDialog,
    private applicationService: SafeApplicationService,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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

  /**
   * Filter roles and users.
   */
  private filterPredicate(): void {
    this.roles.filterPredicate = (data: any) =>
      (this.searchText.trim().length === 0 ||
        (this.searchText.trim().length > 0 &&
          data.title.toLowerCase().includes(this.searchText.trim()))) &&
      (this.usersFilter.trim().length === 0 ||
        (this.usersFilter.trim().length > 0 &&
          data.usersCount.toString().includes(this.usersFilter.trim())));
  }

  /**
   *  Load the roles.
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

  /**
   * Adds a role
   */
  onAdd(): void {
    const dialogRef = this.dialog.open(SafeAddRoleComponent, {
      data: { title: 'components.role.add.title' },
    });
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
              () => {
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

  /**
   * Display a modal to confirm the deletion of the role.
   * If confirmed, the role is removed from the system.
   *
   * @param item Role to delete
   */
  onDelete(item: any): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('components.role.delete.title'),
      content: this.translate.instant(
        'components.role.delete.confirmationMessage',
        {
          name: item.title,
        }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmColor: 'warn',
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
            .subscribe(() => {
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

  /**
   * Applies filters to the list of roles on event
   *
   * @param column Name of the column where the filtering happens
   * @param event The event
   */
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

  /**
   * Clear all the filters
   */
  clearAllFilters(): void {
    this.searchText = '';
    this.usersFilter = '';
    this.applyFilter('', null);
  }

  /**
   * Open role in new page
   *
   * @param role role to see details of
   */
  onOpen(role: Role): void {
    this.router.navigate([role.id], { relativeTo: this.activatedRoute });
  }
}
