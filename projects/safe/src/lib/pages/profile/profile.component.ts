import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { NOTIFICATIONS } from '../../const/notifications';
import { EditUserMutationResponse, EDIT_USER } from '../../graphql/mutations';
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
            username: user.username,
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
    this.apollo.mutate<EditUserMutationResponse>({
      mutation: EDIT_USER,
      variables: {
        id: this.user?.id,
        roles,
        data: {
          username: this.userForm?.value.username,
          name: this.userForm?.value.name
        }
      }
    }).subscribe(res => {
      if (res.data) {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('settings', this.user?.name));
        this.user.name = res.data.editUser.name;
        this.user.username = res.data.editUser.username;
        }
    });
  }

  onFavorite(element: any): void {
    if (element) {
      const roles: any[] = [];
      this.user?.roles?.forEach((e: any) => {
        roles.push(e.id);
      });
      this.apollo.mutate<EditUserMutationResponse>({
        mutation: EDIT_USER,
        variables: {
          id: this.user?.id,
          roles,
          data: {
            favoriteApp: element.id
          }
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('favorite app', this.user?.name));
          this.user.favoriteApp = res.data.editUser.favoriteApp;
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
