import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Application, Role } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../../../services/application.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public roles: Role[] = [];
  private applicationSubscription: Subscription;

  // === REACTIVE FORM ===
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      role: Role
    },
    private applicationService: ApplicationService
  ) { }

  /*  Load the roles and build the form.
  */
  ngOnInit(): void {
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.roles = application.roles;
      } else {
        this.roles = [];
      }
    });
    this.userForm = this.formBuilder.group({
      role: this.data.role.id
    });
  }

  ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
