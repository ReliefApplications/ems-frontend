import { Component, Inject, OnInit } from '@angular/core';
import { Role, User } from '../../../../models/user.model';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GET_USERS, GetUsersQueryResponse } from '../../graphql/queries';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';

/** Model for the input  */
interface DialogData {
  roles: Role[];
  users: User[];
  positionAttributeCategories?: PositionAttributeCategory[];
}

/** Component for adding a user */
@Component({
  selector: 'safe-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class SafeAddUserComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  public filteredUsers?: Observable<User[]>;
  private users: User[] = [];

  /** @returns The position attributes available */
  get positionAttributes(): FormArray | null {
    return this.form.get('positionAttributes')
      ? (this.form.get('positionAttributes') as FormArray)
      : null;
  }

  /**
   * Constructor for the component
   *
   * @param formBuilder The form builder service
   * @param dialogRef The material dialog reference service
   * @param data The input data
   * @param apollo The apollo client
   * @param translate The translation service
   */
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeAddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.minLength(1)],
      role: ['', Validators.required],
      ...(this.data.positionAttributeCategories && {
        positionAttributes: this.formBuilder.array(
          this.data.positionAttributeCategories.map((x) =>
            this.formBuilder.group({
              value: [''],
              category: [x.id, Validators.required],
            })
          )
        ),
      }),
    });
    this.filteredUsers = this.form.controls.email.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((x) => this.filterUsers(x))
    );

    this.apollo
      .watchQuery<GetUsersQueryResponse>({
        query: GET_USERS,
      })
      .valueChanges.subscribe((res) => {
        const flatInvitedUsers = this.data.users.map((x) => x.username);
        this.users = res.data.users.filter(
          (x) => !flatInvitedUsers.includes(x.username)
        );
        this.filteredUsers = this.form.controls.email.valueChanges.pipe(
          startWith(''),
          map((value) => (typeof value === 'string' ? value : '')),
          map((x) => this.filterUsers(x))
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
    return this.users.filter(
      (x) => x.username?.toLowerCase().indexOf(filterValue) === 0
    );
  }

  /**
   * Close the dialog
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
