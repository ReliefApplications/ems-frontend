import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Application, Role, User } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { ApplicationService } from '../../../../../services/application.service';
import { GetUsersQueryResponse, GET_USERS } from '../../../../../graphql/queries';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit, OnDestroy {

  // === REACTIVE FORM ===
  inviteForm: FormGroup;

  // === DATA ===
  public roles: Role[] = [];
  private users: User[] = [];
  public filteredUsers: Observable<User[]>;
  private applicationSubscription: Subscription;

  get user(): string {
    return this.inviteForm.value.user;
  }

  set user(value: string) {
    this.inviteForm.controls.user.setValue(value);
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InviteUserComponent>,
    private applicationService: ApplicationService,
    private apollo: Apollo
  ) { }

  /*  Build the form.
  */
  ngOnInit(): void {
    this.inviteForm = this.formBuilder.group({
      user: ['', Validators.required],
      role: ['', Validators.required]
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.roles = application.roles;
      } else {
        this.roles = [];
      }
    });
    this.apollo.watchQuery<GetUsersQueryResponse>({
      query: GET_USERS
    }).valueChanges.subscribe(res => {
      this.users = res.data.users;
    });
    this.filteredUsers = this.inviteForm.controls.user.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.username),
      map(x => this.filter(x))
    );
  }

  private filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(x => x.username.toLowerCase().indexOf(filterValue) === 0);
  }

  /* Display the name of the user
  */
  displayUser(user: User): string {
    return user && user.name ? user.name : '';
  }

  ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
  }

  /*  Close the modal without sending data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
