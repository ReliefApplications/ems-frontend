import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
/*  Modal to add a role.
*/
export class AddRoleComponent implements OnInit {

  // === REACTIVE FORM ===
  roleForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddRoleComponent>
  ) { }

  /*  Build the form.
  */
  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  /*  Close the modal without sending data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
