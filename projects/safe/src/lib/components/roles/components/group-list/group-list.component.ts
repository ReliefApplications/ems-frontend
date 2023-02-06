import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
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
import { SafeSnackBarService } from '../../../../services/snackbar/snackbar.service';
import { SafeConfirmService } from '../../../../services/confirm/confirm.service';
import { SafeAddRoleComponent } from '../add-role/add-role.component';
import { SafeSnackbarSpinnerComponent } from '../../../snackbar-spinner/snackbar-spinner.component';
import get from 'lodash/get';
import { SafeRestService } from '../../../../services/rest/rest.service';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

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
  public groups: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public manualCreation = true;
  public displayedColumns = ['title', 'usersCount', 'actions'];

  public searchText = '';

  /**
   * This component is used to display the groups tab in the platform
   *
   * @param apollo This is the Apollo client that will be used to make GraphQL
   * @param dialog This is the Angular Material Dialog service.
   * @param snackBar This is the service that will be used to display the snackbar.
   * @param confirmService This is the service that will be used to display the confirm window.
   * @param translate This is the service that is used to
   * @param restService This is the service that will be used to make http requests.
   */
  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
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
    this.groups.filterPredicate = (data: any) =>
      this.searchText.trim().length === 0 ||
      (this.searchText.trim().length > 0 &&
        data.title
          .toLowerCase()
          .includes(this.searchText.trim().toLowerCase()));
  }

  /**
   * Applies filters to the list of roles on event
   *
   * @param event The event
   */
  applyFilter(event: any): void {
    this.searchText = !!event
      ? event.target.value.trim().toLowerCase()
      : this.searchText;
    this.groups.filter = '##';
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
        this.groups.data = data.groups;
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
  onAdd(): void {
    const dialogRef = this.dialog.open(SafeAddRoleComponent, {
      data: { title: 'components.group.add.title' },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
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
              next: () => {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectCreated', {
                    type: this.translate
                      .instant('common.role.one')
                      .toLowerCase(),
                    value: value.title,
                  })
                );
                this.getGroups();
              },
              error: (err) => {
                console.log(err);
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
          if (data) this.groups.data = data.fetchGroups || [];
          this.loadingFetch = loading;
          snackBarRef.instance.data = {
            message: this.translate.instant(
              'common.notifications.groups.ready'
            ),
            loading: false,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
        },
        error: () => {
          snackBarRef.instance.data = {
            message: this.translate.instant(
              'common.notifications.groups.error'
            ),
            loading: false,
            error: true,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
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
      confirmColor: 'warn',
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<DeleteGroupMutationResponse>({
            mutation: DELETE_GROUP,
            variables: {
              id: item.id,
            },
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectDeleted', {
                value: item.title,
              })
            );
            this.getGroups();
          });
      }
    });
  }
}
