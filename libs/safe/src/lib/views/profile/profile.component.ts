import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import {
  EditUserProfileMutationResponse,
  EDIT_USER_PROFILE,
} from './graphql/mutations';
import { SafeAuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SafeUnsubscribeComponent } from '../../components/utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';
import { User } from '../../models/user.model';

/**
 * Shared profile page.
 * Displays information of the logged user.
 */
@Component({
  selector: 'safe-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class SafeProfileComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  /** Current user */
  public user: any;
  /** Form to edit the user */
  public userForm!: ReturnType<typeof this.createUserForm>;
  /** Displayed columns of table */
  public displayedColumnsApps = [
    'name',
    'role',
    'positionAttributes',
    'actions',
  ];

  /**
   * Shared profile page.
   * Displays information of the logged user.
   *
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param authService Shared authentication service
   * @param fb Angular form builder
   * @param translate Translation service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private authService: SafeAuthService,
    private fb: FormBuilder,
    public translate: TranslateService
  ) {
    super();
  }

  /**
   * Subscribes to authenticated user.
   * Creates user form.
   */
  ngOnInit(): void {
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = { ...user };
        this.userForm = this.createUserForm(user);
      }
    });
  }

  /**
   * Submits new profile.
   */
  onSubmit(): void {
    const roles: any[] = [];
    this.user?.roles?.forEach((e: any) => {
      roles.push(e.id);
    });
    this.apollo
      .mutate<EditUserProfileMutationResponse>({
        mutation: EDIT_USER_PROFILE,
        variables: {
          profile: {
            firstName: this.userForm?.value.firstName,
            lastName: this.userForm?.value.lastName,
          },
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('pages.profile.notifications.notUpdated'),
              { error: true }
            );
          } else {
            if (data) {
              this.snackBar.openSnackBar(
                this.translate.instant('pages.profile.notifications.updated')
              );
              this.user.name = data.editUserProfile.name;
            }
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Selects a new favorite application.
   *
   * @param application new favorite application
   */
  onSelectFavorite(application: any): void {
    if (application) {
      const roles: any[] = [];
      this.user?.roles?.forEach((e: any) => {
        roles.push(e.id);
      });
      this.apollo
        .mutate<EditUserProfileMutationResponse>({
          mutation: EDIT_USER_PROFILE,
          variables: {
            profile: {
              favoriteApp: application.id,
            },
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'pages.profile.notifications.notUpdated'
                ),
                { error: true }
              );
            } else {
              if (data) {
                this.snackBar.openSnackBar(
                  this.translate.instant('pages.profile.notifications.updated')
                );
                this.user.favoriteApp = data.editUserProfile.favoriteApp;
              }
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Create user form group
   *
   * @param user Current user
   * @returns form group
   */
  createUserForm(user: User) {
    return this.fb.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      username: [{ value: user.username, disabled: true }],
    });
  }
}
