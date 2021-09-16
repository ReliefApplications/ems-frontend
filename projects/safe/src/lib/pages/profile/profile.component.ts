import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { NOTIFICATIONS } from '../../const/notifications';
import { EditUserProfileMutationResponse, EDIT_USER_PROFILE } from '../../graphql/mutations';
import { User } from '../../models/user.model';
import { SafeAuthService } from '../../services/auth.service';
import { SafeSnackBarService } from '../../services/snackbar.service';


@Component({
  selector: 'safe-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class SafeProfileComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<User>();

  private authSubscription?: Subscription;
  public user: any;
  public userForm?: FormGroup;
  public displayedColumnsApps = ['name', 'role', 'positionAttributes', 'actions'];

  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = { ...user};
        this.userForm = this.formBuilder.group(
          {
            name: user.name,
            username: [{ value: user.username, disabled: true }],
          }
        );
      }
    });
  }

  onSubmit(): void {
    const roles: any[] = [];
    this.user?.roles?.forEach((e: any) => {
        roles.push(e.id);
      });
    this.apollo.mutate<EditUserProfileMutationResponse>({
      mutation: EDIT_USER_PROFILE,
      variables: {
        profile: {
          name: this.userForm?.value.name
        }
      }
    }).subscribe(res => {
      if (res.data) {
        this.snackBar.openSnackBar(NOTIFICATIONS.profileSaved, { expires: true, duration: 5000 });
        this.user.name = res.data.editUserProfile.name;
      }
    });
  }

  onSelectFavorite(element: any): void {
    if (element) {
      const roles: any[] = [];
      this.user?.roles?.forEach((e: any) => {
        roles.push(e.id);
      });
      this.apollo.mutate<EditUserProfileMutationResponse>({
        mutation: EDIT_USER_PROFILE,
        variables: {
          profile: {
            favoriteApp: element.id
          }
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.profileSaved, { expires: true, duration: 5000 });
          this.user.favoriteApp = res.data.editUserProfile.favoriteApp;
          }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
