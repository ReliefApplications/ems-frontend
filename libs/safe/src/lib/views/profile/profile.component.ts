import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { EDIT_USER_PROFILE } from './graphql/mutations';
import { SafeAuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SafeUnsubscribeComponent } from '../../components/utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';
import { EditUserProfileMutationResponse } from '../../models/user.model';

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
  public userForm?: UntypedFormGroup;
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
   * @param formBuilder Angular form builder
   * @param translate Translation service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private authService: SafeAuthService,
    private formBuilder: UntypedFormBuilder,
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
        this.userForm = this.formBuilder.group({
          firstName: [user.firstName, Validators.required],
          lastName: [user.lastName, Validators.required],
          username: [{ value: user.username, disabled: true }],
        });
      }
    });
  }

  /**
   * Submits new profile.
   */
  onSubmit(): void {
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
          this.handleUserProfileMutationResponse({ data, errors }, 'name');
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
            this.handleUserProfileMutationResponse(
              { data, errors },
              'favoriteApp'
            );
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Handle user profile mutation response for the given property
   *
   * @param response user profile mutation response
   * @param response.data response data
   * @param response.errors response errors
   * @param profileProperty type of property to update from profile
   */
  private handleUserProfileMutationResponse(
    response: { data: any; errors: any },
    profileProperty: 'name' | 'favoriteApp'
  ) {
    const { errors, data } = response;
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
        this.user[profileProperty] = data.editUserProfile[profileProperty];
      }
    }
  }
}
