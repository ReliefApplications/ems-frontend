import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import {
  AddGroupMutationResponse,
  ADD_GROUP,
  DeleteGroupMutationResponse,
  DELETE_GROUP,
  FetchGroupsMutationResponse,
  FETCH_GROUPS,
} from '../../graphql/mutations';
import { GetGroupsQueryResponse, GET_GROUPS } from '../../graphql/queries';
import { SafeConfirmService } from '../../../../services/confirm/confirm.service';
import { SafeSnackbarSpinnerComponent } from '../../../snackbar-spinner/snackbar-spinner.component';
import get from 'lodash/get';
import { SafeRestService } from '../../../../services/rest/rest.service';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';

/**
 * This component is used to display the groups tab in the platform
 */
@Component({
  selector: 'safe-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class SafeGroupListComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  public loadingFetch = false;
  public groups: Array<any> = new Array<any>();
  public filteredGroups: Array<any> = new Array<any>();
  public manualCreation = true;
  public displayedColumns = ['title', 'usersCount', 'actions'];

  public searchText = '';

  /**
   * This component is used to display the groups tab in the platform
   *
   * @param apollo This is the Apollo client that will be used to make GraphQL
   * @param dialog This is the Angular Dialog service.
   * @param snackBar This is the service that will be used to display the snackbar.
   * @param confirmService This is the service that will be used to display the confirm window.
   * @param translate This is the service that is used to
   * @param restService This is the service that will be used to make http requests.
   */
  constructor(
    private apollo: Apollo,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private restService: SafeRestService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getGroups();
    this.getPermissionsConfiguration();

    // sets up filtering on table
    this.filterPredicate();
  }

  /**
   * Filter groups by search
   */
  private filterPredicate() {
    this.filteredGroups = this.groups.filter(
      (data: any) =>
        this.searchText.trim().length === 0 ||
        (this.searchText.trim().length > 0 &&
          data.title
            .toLowerCase()
            .includes(this.searchText.trim().toLowerCase()))
    );
  }

  /**
   * Applies filters to the list of roles on event
   *
   * @param event The event
   */
  applyFilter(event: any): void {
    this.searchText = event
      ? event.target.value.trim().toLowerCase()
      : this.searchText;
    this.filterPredicate();
  }

  /**
   *  Load the groups.
   */
  private getGroups(): void {
    this.apollo
      .query<GetGroupsQueryResponse>({
        query: GET_GROUPS,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        this.groups = data.groups;
        this.filteredGroups = this.groups;
        // this.manualCreation = data.groups.manualCreation;
        this.loading = loading;
      });
  }

  /**
   * Call permissions configuration endpoint to check how groups are created
   */
  private getPermissionsConfiguration(): void {
    const url = '/permissions/configuration';
    this.restService
      .get(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.manualCreation = get(res, 'groups.local', true);
      });
  }

  /**
   * Adds a role
   */
  async onAdd(): Promise<void> {
    const { SafeAddRoleComponent } = await import(
      '../add-role/add-role.component'
    );
    const dialogRef = this.dialog.open(SafeAddRoleComponent, {
      data: { title: 'components.group.add.title' },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.apollo
          .mutate<AddGroupMutationResponse>({
            mutation: ADD_GROUP,
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
                  this.translate.instant('common.notifications.objectCreated', {
                    type: this.translate.instant('common.role.one'),
                    value: value.title,
                  })
                );
                this.getGroups();
              }
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }

  /** Fetches groups from service */
  onFetchFromService() {
    this.loadingFetch = true;
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SafeSnackbarSpinnerComponent,
      {
        duration: 0,
        data: {
          message: this.translate.instant(
            'common.notifications.groups.processing'
          ),
          loading: true,
        },
      }
    );
    this.apollo
      .mutate<FetchGroupsMutationResponse>({ mutation: FETCH_GROUPS })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data, loading }) => {
          if (data) this.groups = data.fetchGroups || [];
          this.filteredGroups = this.groups;
          this.loadingFetch = loading;
          snackBarRef.instance.message = this.translate.instant(
            'common.notifications.groups.ready'
          );
          snackBarRef.instance.loading = false;

          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
        error: () => {
          snackBarRef.instance.message = this.translate.instant(
            'common.notifications.groups.error'
          );
          snackBarRef.instance.loading = false;
          snackBarRef.instance.error = true;

          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
      });
  }

  /**
   * Display a modal to confirm the deletion of the group.
   * If confirmed, the group is removed from the system.
   *
   * @param item Group to delete
   */
  onDelete(item: any): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('components.group.delete.title'),
      content: this.translate.instant(
        'components.group.delete.confirmationMessage',
        {
          name: item.title,
        }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.apollo
          .mutate<DeleteGroupMutationResponse>({
            mutation: DELETE_GROUP,
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
                  this.translate.instant('common.notifications.objectDeleted', {
                    value: item.title,
                  })
                );
              }
              this.getGroups();
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }
}
