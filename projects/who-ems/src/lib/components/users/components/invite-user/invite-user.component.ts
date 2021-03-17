import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { Role, User } from '../../../../models/user.model';
import { GetUsersQueryResponse, GET_USERS } from '../../../../graphql/queries';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';

@Component({
  selector: 'who-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class WhoInviteUserComponent implements OnInit {

  // === REACTIVE FORM ===
  inviteForm: FormGroup;

  // === DATA ===
  private users: User[];
  public filteredUsers: Observable<User[]>;

  get email(): string {
    return this.inviteForm.value.email;
  }

  set email(value: string) {
    this.inviteForm.controls.email.setValue(value);
  }

  get positionAttributes(): FormArray {
    return this.inviteForm.get('positionAttributes') ? this.inviteForm.get('positionAttributes') as FormArray : null;
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<WhoInviteUserComponent>,
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA) public data: {
      roles: Role[];
      positionAttributeCategories?: PositionAttributeCategory[]
    }
  ) { }

  /*  Build the form.
  */
  ngOnInit(): void {
    this.inviteForm = this.formBuilder.group({
      email: ['', Validators.required],
      role: ['', Validators.required],
      ...this.data.positionAttributeCategories &&
      {
        positionAttributes: this.formBuilder.array(this.data.positionAttributeCategories.map(x => {
          return this.formBuilder.group({
            value: [''],
            category: [x.id, Validators.required]
          });
        }))
      }
    });
    this.apollo.watchQuery<GetUsersQueryResponse>({
      query: GET_USERS
    }).valueChanges.subscribe(res => {
      this.users = res.data.users;
    });
    this.filteredUsers = this.inviteForm.controls.email.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.username),
      map(x => this.filter(x))
    );
  }

  private filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users ? this.users.filter(x => x.username.toLowerCase().indexOf(filterValue) === 0) : this.users;
  }

  /*  Close the modal without sending data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
