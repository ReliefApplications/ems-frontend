import { Apollo } from 'apollo-angular';
import { Component, OnInit, Input } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Application } from '../../../../models/application.model';
import { Role } from '../../../../models/user.model';
import { ConfirmService } from '../../../../services/confirm/confirm.service';
import { ApplicationService } from '../../../../services/application/application.service';
import {
  AddRoleMutationResponse,
  ADD_ROLE,
  DeleteRoleMutationResponse,
  DELETE_ROLE,
} from '../../graphql/mutations';
import { GetRolesQueryResponse, GET_ROLES } from '../../graphql/queries';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';

/**
 * This component is used to display the back-office roles tab
 * in the platform
 */
@Component({
  selector: 'shared-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent extends UnsubscribeComponent implements OnInit {
  // === INPUT DATA ===
  @Input() inApplication = false;

  // === DATA ===
  public loading = true;
  public roles: Array<any> = new Array<any>([]);
  public filteredRoles: Array<any> = new Array<any>([]);
  public displayedColumns = ['title', 'usersCount', 'actions'];

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
   * @param dialog This is the Angular Dialog service.
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
    public dialog: Dialog,
    private applicationService: ApplicationService,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.inApplication) {
      this.loading = false;
      this.applicationService.application$
        .pipe(takeUntil(this.destroy$))
        .subscribe((application: Application | null) => {
          if (application) {
            this.roles = application.roles || [];
          } else {
            this.roles = [];
          }
          this.filterPredicate();
        });
    } else {
      this.getRoles();
    }
  }

  /**
   * Filter roles and users.
   */
  private filterPredicate(): void {
    this.filteredRoles = this.roles.filter(
      (data: any) =>
        (this.searchText.trim().length === 0 ||
          (this.searchText.trim().length > 0 &&
            data.title.toLowerCase().includes(this.searchText.trim()))) &&
        (this.usersFilter.trim().length === 0 ||
          (this.usersFilter.trim().length > 0 &&
            data.usersCount.toString().includes(this.usersFilter.trim())))
    );
  }

  /**
   *  Load the roles.
   */
  private getRoles(): void {
    this.apollo
      .query<GetRolesQueryResponse>({
        query: GET_ROLES,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        this.roles = data.roles;
        this.loading = loading;
        this.filterPredicate();
      });
  }

  /**
   * Adds a role
   */
  async onAdd(): Promise<void> {
    const { AddRoleComponent } = await import('../add-role/add-role.component');
    const dialogRef = this.dialog.open(AddRoleComponent, {
      data: { title: 'components.role.add.title' },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: ({ errors }) => {
                if (errors) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectNotCreated',
                      {
                        type: this.translate
                          .instant('common.role.one')
                          .toLowerCase(),
                        error: errors ? errors[0].message : '',
                      }
                    ),
                    { error: true }
                  );
                } else {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectCreated',
                      {
                        type: this.translate.instant('common.role.one'),
                        value: value.title,
                      }
                    )
                  );
                  this.getRoles();
                }
              },
              error: (err) => {
                this.snackBar.openSnackBar(err.message, { error: true });
              },
            });
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
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: ({ errors }) => {
                if (errors) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectNotDeleted',
                      {
                        value: item.title,
                        error: errors ? errors[0].message : '',
                      }
                    ),
                    { error: true }
                  );
                } else {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectDeleted',
                      {
                        value: item.title,
                      }
                    )
                  );
                  this.getRoles();
                }
              },
              error: (err) => {
                this.snackBar.openSnackBar(err.message, { error: true });
              },
            });
        }
      }
    });
  }

  /**
   * Applies filters to the list of roles on event
   *
   * @param column Name of the column where the filtering happens
   * @param event The event
   */
  applyFilter(column: string, event: any): void {
    if (column === 'usersCount') {
      this.usersFilter = event.target
        ? event.target.value.trim().toLowerCase()
        : '';
    } else {
      this.searchText = event
        ? event.target.value.trim().toLowerCase()
        : this.searchText;
    }
    this.filterPredicate();
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
