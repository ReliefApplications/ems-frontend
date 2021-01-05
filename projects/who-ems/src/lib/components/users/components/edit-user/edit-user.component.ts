import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '../../../../models/user.model';

@Component({
  selector: 'who-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class WhoEditUserComponent implements OnInit {

  // === REACTIVE FORM ===
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<WhoEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      userRoles: Role[],
      availableRoles: Role[],
      multiple: boolean
    },
  ) { }

  /*  Load the roles and build the form.
  */
  ngOnInit(): void {
    if (this.data.multiple) {
      this.userForm = this.formBuilder.group({
        roles: [this.data.userRoles ? this.data.userRoles.map(x => x.id) : null]
      });
    } else {
      this.userForm = this.formBuilder.group({
        role: this.data.userRoles[0].id
      });
    }
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
