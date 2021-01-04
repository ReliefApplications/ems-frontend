import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'who-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class WhoAddRoleComponent implements OnInit {

  // === REACTIVE FORM ===
  roleForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<WhoAddRoleComponent>
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

