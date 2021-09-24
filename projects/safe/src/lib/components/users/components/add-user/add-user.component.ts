import { Component, Inject, OnInit } from '@angular/core';
import { Role, User } from '../../../../models/user.model';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {GetUsersQueryResponse} from '../../../../graphql/queries';
import {GET_USERS} from '../../../../graphql/queries';
import {Apollo} from 'apollo-angular';

interface DialogData {
  roles: Role[];
  users: User[];
  positionAttributeCategories?: PositionAttributeCategory[];
}

@Component({
  selector: 'safe-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class SafeAddUserComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  public filteredUsers?: Observable<User[]>;
  private allAppUsers: any = [];
  private notInvitedUsers: any = [];

  get positionAttributes(): FormArray | null {
    return this.form.get('positionAttributes') ? this.form.get('positionAttributes') as FormArray : null;
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeAddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.minLength(1)],
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
    this.filteredUsers = this.form.controls.email.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(x => this.filterUsers(x))
    );

    // this.filteredUsers.forEach((u: any) => u.forEach( (u2: any) => console.log(u2)));


    // console.log('gm');
    // this.apollo.watchQuery<GetUsersQueryResponse>({
    //   query: GET_USERS
    // }).valueChanges.subscribe(res => {
    //   this.allAppUsers = res;
    //   console.log(this.allAppUsers.data.users);
    //   if (this.filteredUsers && this.allAppUsers){
    //     console.log('in');
    //     if (this.filteredUsers[0] === 0){
    //
    //     }
    //     this.filteredUsers.forEach((userList) => {
    //       console.log(userList);
    //       userList.forEach((u) => {
    //         console.log('loop2');
    //         console.log(u);
    //         if (!this.allAppUsers.data.users.some((aau: any) => aau.id === u.id)){
    //           console.log(u);
    //           console.log('in 2');
    //           this.notInvitedUsers.push(u);
    //         }
    //         else{
    //           console.log('nope');
    //         }
    //       });
    //       console.log('out');
    //     });
    //   }
    //   console.log(this.notInvitedUsers);
    // }, error => console.log(error));
    // console.log('gm ser');

    console.log('gm');
    this.apollo.watchQuery<GetUsersQueryResponse>({
      query: GET_USERS
    }).valueChanges.subscribe(res => {
      this.allAppUsers = res;
      console.log(this.allAppUsers.data.users);
      if (this.filteredUsers && this.allAppUsers){
        console.log('in');
        this.allAppUsers.data.users.forEach((aU: any) => {
          this.filteredUsers?.forEach((userList) => {
            if (!userList.some((u) => u.id === aU.id)) {
              this.notInvitedUsers.push(aU);
            }
          });
        });
      }
      console.log(this.notInvitedUsers);
    }, error => console.log(error));
    console.log('gm ser');
  }

  private filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.data.users.filter(x => x.username?.toLowerCase().indexOf(filterValue) === 0);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
