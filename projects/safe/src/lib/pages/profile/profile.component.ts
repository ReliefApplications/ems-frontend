import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import {
  EditUserProfileMutationResponse,
  EDIT_USER_PROFILE,
} from '../../graphql/mutations';
import { User } from '../../models/user.model';
import { SafeAuthService } from '../../services/auth.service';
import { SafeSnackBarService } from '../../services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Shared profile page.
 * Displays information of the logged user.
 */
@Component({
  selector: 'safe-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class SafeProfileComponent implements OnInit, OnDestroy {
  /** Table data */
  dataSource = new MatTableDataSource<User>();
  /** Subscription to authentication service */
  private authSubscription?: Subscription;
  /** Current user */
  public user: any;
  /** Form to edit the user */
  public userForm?: FormGroup;
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
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private formBuilder: FormBuilder,
    public translate: TranslateService
  ) {}

  /**
   * Subscribes to authenticated user.
   * Creates user form.
   */
  ngOnInit(): void {
    this.authSubscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = { ...user };
        this.userForm = this.formBuilder.group({
          name: user.name,
          username: [{ value: user.username, disabled: true }],
        });
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
            name: this.userForm?.value.name,
          },
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.snackBar.openSnackBar(
            this.translate.instant('pages.profile.notifications.updated')
          );
          this.user.name = res.data.editUserProfile.name;
        }
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
        .subscribe((res) => {
          if (res.data) {
            this.snackBar.openSnackBar(
              this.translate.instant('pages.profile.notifications.updated')
            );
            this.user.favoriteApp = res.data.editUserProfile.favoriteApp;
          }
        });
    }
  }

  /**
   * Removes all subscriptions of the component.
   */
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
