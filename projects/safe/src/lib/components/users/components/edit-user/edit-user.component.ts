import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { Role, User } from '../../../../models/user.model';

/** Model for the data input */
interface DialogData {
  user: User;
  availableRoles: Role[];
  positionAttributeCategories?: PositionAttributeCategory[];
}

/** Component for editing a user */
@Component({
  selector: 'safe-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class SafeEditUserComponent implements OnInit {
  // === REACTIVE FORM ===
  userForm: FormGroup = new FormGroup({});

  /** @returns The position attributes available */
  get positionAttributes(): FormArray | null {
    return this.userForm.get('positionAttributes')
      ? (this.userForm.get('positionAttributes') as FormArray)
      : null;
  }

  public positionAttributeCategories?: PositionAttributeCategory[];

  /**
   * Constructor of the component
   *
   * @param formBuilder The form builder service
   * @param dialogRef The material dialog reference service
   * @param data The input data of the component
   */
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  /** Load the roles and build the form. */
  ngOnInit(): void {
    if (this.data.positionAttributeCategories) {
      this.positionAttributeCategories = this.data.positionAttributeCategories;
    }
    this.userForm = this.formBuilder.group({
      roles: [
        this.data.user.roles ? this.data.user.roles.map((x) => x.id) : null,
      ],
      ...(this.data.positionAttributeCategories && {
        positionAttributes: this.formBuilder.array(
          this.data.positionAttributeCategories.map((x) =>
            this.formBuilder.group({
              value: [
                this.data.user.positionAttributes?.find(
                  (y) => y.category?.id === x.id
                )?.value || '',
              ],
              category: [x.id, Validators.required],
            })
          )
        ),
      }),
    });
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
