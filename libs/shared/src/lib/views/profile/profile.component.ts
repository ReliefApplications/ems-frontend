import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { EDIT_USER_PROFILE } from './graphql/mutations';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeComponent } from '../../components/utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';
import { EditUserProfileMutationResponse, User } from '../../models/user.model';
import { errorMessageFormatter } from '../../utils/graphql/error-handler';

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
    private authService: AuthService,
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
        next: ({ data }) => {
          this.handleUserProfileMutationResponse({ data, errors: [] }, 'name');
        },
        error: (errors) => {
          this.snackBar.openSnackBar(errorMessageFormatter(errors), {
            error: true,
          });
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
          next: ({ data }) => {
            this.handleUserProfileMutationResponse(
              { data, errors: [] },
              'favoriteApp'
            );
          },
          error: (errors) => {
            this.snackBar.openSnackBar(errorMessageFormatter(errors), {
              error: true,
            });
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
    if (errors?.length) {
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
