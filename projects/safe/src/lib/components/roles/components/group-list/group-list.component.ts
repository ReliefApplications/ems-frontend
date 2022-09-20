import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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
import { SafeSnackBarService } from '../../../../services/snackbar.service';
import { SafeConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { SafeAddRoleComponent } from '../add-role/add-role.component';
import { SafeSnackbarSpinnerComponent } from '../../../snackbar-spinner/snackbar-spinner.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import get from 'lodash/get';

/**
 * This component is used to display the groups tab in the platform
 */
@Component({
  selector: 'safe-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class SafeGroupListComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public loadingFetch = false;
  public groups: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public manualCreation = true;
  public displayedColumns = ['title', 'usersCount', 'actions'];

  public searchText = '';

  /** API url */
  public baseUrl: string;

  /**
   * This component is used to display the groups tab in the platform
   *
   * @param environment Current environment
   * @param apollo This is the Apollo client that will be used to make GraphQL
   * @param dialog This is the Angular Material Dialog service.
   * @param snackBar This is the service that will be used to display the snackbar.
   * @param translate This is the service that is used to
   * @param http Http client
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService,
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl + '/permissions/';
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
      .watchQuery<GetGroupsQueryResponse>({
        query: GET_GROUPS,
      })
      .valueChanges.subscribe((res) => {
        this.groups.data = res.data.groups;
        // this.manualCreation = res.data.groups.manualCreation;
        this.loading = res.loading;
      });
  }

  /**
   * Call permissions configuration endpoint to check how groups are created
   */
  private getPermissionsConfiguration(): void {
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.baseUrl}/configuration`;
    this.http.get(url, { headers }).subscribe((res) => {
      this.manualCreation = get(res, 'manualCreation', true);
    });
  }

  /**
   * Adds a role
   */
  onAdd(): void {
    const dialogRef = this.dialog.open(SafeAddRoleComponent, {
      data: { title: 'components.group.add.title' },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<AddGroupMutationResponse>({
            mutation: ADD_GROUP,
            variables: {
              title: value.title,
            },
          })
          .subscribe(
            () => {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectCreated', {
                  type: this.translate.instant('common.role.one').toLowerCase(),
                  value: value.title,
                })
              );
              this.getGroups();
            },
            (err) => {
              console.log(err);
            }
          );
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
      .subscribe(
        (res) => {
          if (res.data) this.groups.data = res.data.fetchGroups || [];
          this.loadingFetch = res.loading;
          snackBarRef.instance.data = {
            message: this.translate.instant(
              'common.notifications.groups.ready'
            ),
            loading: false,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
        },
        () => {
          snackBarRef.instance.data = {
            message: this.translate.instant(
              'common.notifications.groups.error'
            ),
            loading: false,
            error: true,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
        }
      );
  }

  /**
   * Display a modal to confirm the deletion of the group.
   * If confirmed, the group is removed from the system.
   *
   * @param item Group to delete
   */
  onDelete(item: any): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('components.group.delete.title'),
        content: this.translate.instant(
          'components.group.delete.confirmationMessage',
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
        this.apollo
          .mutate<DeleteGroupMutationResponse>({
            mutation: DELETE_GROUP,
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
            this.getGroups();
          });
      }
    });
  }
}
