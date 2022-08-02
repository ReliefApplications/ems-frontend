import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import {
  AddGroupMutationResponse,
  ADD_GROUP,
  DeleteGroupMutationResponse,
  DELETE_GROUP,
} from '../../../graphql/mutations';
import { GetGroupsQueryResponse, GET_GROUPS } from '../../../graphql/queries';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import { SafeConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { SafeAddRoleComponent } from '../components/add-role/add-role.component';

/**
 * This component is used to display the groups tab in the platform
 */
@Component({
  selector: 'safe-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class SafeGroupsComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public groups: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public displayedColumns = ['title', 'usersCount', 'actions'];

  public searchText = '';

  /**
   * This component is used to display the groups tab in the platform
   *
   * @param apollo This is the Apollo client that will be used to make GraphQL
   * @param dialog This is the Angular Material Dialog service.
   * @param snackBar This is the service that will be used to display the snackbar.
   * @param translate This is the service that is used to
   */
  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getGroups();

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
        this.loading = res.loading;
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
