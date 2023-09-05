import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

/**
 * This component allows the user to add a role to the platform or to an application.
 */
@Component({
  selector: 'safe-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class SafeAddRoleComponent implements OnInit {
  title: string;

  // === REACTIVE FORM ===
  roleForm: UntypedFormGroup = new UntypedFormGroup({});

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param formBuilder This is the service used to build forms
   * @param dialogRef This is the reference of the dialog modal that will be opened
   * @param data Injected dialog data
   * @param data.title Title of the dialog modal
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: DialogRef<SafeAddRoleComponent>,
    @Inject(DIALOG_DATA)
    public data: {
      title: string;
    }
  ) {
    this.title = data.title;
  }

  /**
   * Build the form.
   */
  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  /**
   * Close the modal without sending data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
