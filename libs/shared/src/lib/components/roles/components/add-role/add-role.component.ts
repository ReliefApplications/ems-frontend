import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

/**
 * This component allows the user to add a role to the platform or to an application.
 */
@Component({
  selector: 'shared-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent {
  title: string;

  // === REACTIVE FORM ===
  roleForm = this.fb.group({
    title: ['', Validators.required],
  });

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param fb This is the service used to build forms
   * @param dialogRef This is the reference of the dialog modal that will be opened
   * @param data Injected dialog data
   * @param data.title Title of the dialog modal
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<AddRoleComponent>,
    @Inject(DIALOG_DATA)
    public data: {
      title: string;
    }
  ) {
    this.title = data.title;
  }
}
