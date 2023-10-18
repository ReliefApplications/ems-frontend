import { Component, Inject, OnInit } from '@angular/core';
import { Role, User, UsersQueryResponse } from '../../../../models/user.model';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { FormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GET_USERS } from '../../graphql/queries';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/** Model for the input  */
interface DialogData {
  roles: Role[];
  users: User[];
  positionAttributeCategories?: PositionAttributeCategory[];
}

/** Component for adding a user */
@Component({
  selector: 'shared-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent extends UnsubscribeComponent implements OnInit {
  form = this.fb.group({
    email: ['', Validators.minLength(1)],
    role: ['', Validators.required],
    ...(this.data.positionAttributeCategories && {
      positionAttributes: this.fb.array(
        this.data.positionAttributeCategories.map((x) =>
          this.fb.group({
            value: [''],
            category: [x.id, Validators.required],
          })
        )
      ),
    }),
  });
  public filteredUsers?: Observable<User[]>;
  private users: User[] = [];

  /** @returns The position attributes available */
  get positionAttributes(): UntypedFormArray | null {
    return this.form.get('positionAttributes')
      ? (this.form.get('positionAttributes') as UntypedFormArray)
      : null;
  }

  /**
   * Constructor for the component
   *
   * @param fb The form builder service
   * @param dialogRef The Dialog reference service
   * @param data The input data
   * @param apollo The apollo client
   * @param translate The translation service
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<AddUserComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    public translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.filteredUsers = this.form.controls.email.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((x) => this.filterUsers(x)),
      takeUntil(this.destroy$)
    );

    this.apollo
      .query<UsersQueryResponse>({
        query: GET_USERS,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        const flatInvitedUsers = this.data.users.map((x) => x.username);
        this.users = data.users.filter(
          (x) => !flatInvitedUsers.includes(x.username)
        );
      });
  }

  /**
   * Filter the users
   *
   * @param value The value to filter on
   * @returns The filtered list of users
   */
  private filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users
      .filter((x) => x.username?.toLowerCase().indexOf(filterValue) === 0)
      .slice(0, 25);
  }
}
