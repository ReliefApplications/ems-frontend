import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { PositionAttributeCategory } from '../../models/position-attribute-category.model';
import { AddUsersMutationResponse, Role } from '../../models/user.model';
import { ApplicationService } from '../../services/application/application.service';
import { UserListComponent } from './components/user-list/user-list.component';
import { ADD_USERS } from './graphql/mutations';
import { SnackbarService } from '@oort-front/ui';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Application users component.
 */
@Component({
  selector: 'shared-application-users',
  templateUrl: './application-users.component.html',
  styleUrls: ['./application-users.component.scss'],
})
export class ApplicationUsersComponent implements OnInit {
  /** Loading status */
  public loading = true;
  /** Roles */
  public roles: Role[] = [];
  /** Position attribute categories */
  public positionAttributeCategories: PositionAttributeCategory[] = [];
  /** Prefetch subject */
  refetch$: Subject<boolean> = new Subject<boolean>();
  /** User list component */
  @ViewChild(UserListComponent) userList?: UserListComponent;
  /** Filter to apply on the users query */
  public filters: CompositeFilterDescriptor | null = null;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Application users component.
   *
   * @param dialog Dialog
   * @param applicationService Shared application service
   * @param apollo Apollo service
   * @param translate Translate service
   * @param snackBar Shared snackbar service
   */
  constructor(
    private dialog: Dialog,
    private applicationService: ApplicationService,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((application) => {
        if (application) {
          this.roles = application.roles || [];
          this.positionAttributeCategories =
            application.positionAttributeCategories || [];
        }
      });
  }

  /**
   * Show a dialog for inviting someone
   */
  async onInvite(): Promise<void> {
    const { InviteUsersModalComponent } = await import(
      '../../components/users/invite-users-modal/invite-users-modal.component'
    );
    const dialogRef = this.dialog.open(InviteUsersModalComponent, {
      data: {
        roles: this.roles,
        downloadPath: this.applicationService
          ? this.applicationService.usersDownloadPath
          : 'download/invite',
        uploadPath: this.applicationService
          ? this.applicationService.usersUploadPath
          : 'upload/invite',
        ...(this.positionAttributeCategories && {
          positionAttributeCategories: this.positionAttributeCategories,
        }),
      },
    });
    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        if (value) {
          this.apollo
            .mutate<AddUsersMutationResponse>({
              mutation: ADD_USERS,
              variables: {
                users: value,
                application: this.roles[0].application?.id,
              },
            })
            .subscribe(({ errors, data }) => {
              if (!errors) {
                if (data?.addUsers.length) {
                  this.snackBar.openSnackBar(
                    this.translate.instant('components.users.onInvite.plural')
                  );
                } else {
                  this.snackBar.openSnackBar(
                    this.translate.instant('components.users.onInvite.singular')
                  );
                }
                this.userList?.fetchUsers(true);
              } else {
                if (data?.addUsers?.length) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'components.users.onNotInvite.plural',
                      { error: errors[0].message }
                    ),
                    { error: true }
                  );
                } else {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'components.users.onNotInvite.singular',
                      { error: errors[0].message }
                    ),
                    { error: true }
                  );
                }
              }
            });
        }
      });
  }

  /**
   * Export the list of users
   *
   * @param type The type of file we want ('csv' or 'xlsx')
   */
  onExport(type: 'csv' | 'xlsx'): void {
    this.applicationService.downloadUsers(
      type,
      this.userList?.selection.selected
        .map((x) => x.id || '')
        .filter((x) => x !== '') || []
    );
  }
}
