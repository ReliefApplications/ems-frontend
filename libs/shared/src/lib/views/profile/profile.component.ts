import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { EDIT_USER_PROFILE } from './graphql/mutations';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeComponent } from '../../components/utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';
import { EditUserProfileMutationResponse, User } from '../../models/user.model';

/**
 * Shared profile page.
 * Displays information of the logged user.
 */
@Component({
  selector: 'shared-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends UnsubscribeComponent implements OnInit {
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
  /** URL for updating user password */
  public updatePasswordUrl: string;

  /**
   * Shared profile page.
   * Displays information of the logged user.
   *
   * @param environment Environment configuration
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param authService Shared authentication service
   * @param fb Angular form builder
   * @param translate Translation service
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private authService: AuthService,
    private fb: FormBuilder,
    public translate: TranslateService
  ) {
    super();

    // Set update password URL
    const { issuer, clientId } = environment.authConfig ?? {};
    const currentUrl = window.location.href;
    this.updatePasswordUrl = `${issuer}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${currentUrl}&response_type=code&scope=openid&kc_action=UPDATE_PASSWORD`;
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

  /** Initiate update user password sequence. */
  public updatePassword(): void {
    // Redirect to update password URL
    window.location.href = this.updatePasswordUrl;
  }
}
