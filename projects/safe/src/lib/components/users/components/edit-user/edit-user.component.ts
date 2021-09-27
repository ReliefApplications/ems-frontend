import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { Role, User } from '../../../../models/user.model';

interface DialogData {
  user: User;
  availableRoles: Role[];
  multiple: boolean;
  positionAttributeCategories?: PositionAttributeCategory[];
}

@Component({
  selector: 'safe-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class SafeEditUserComponent implements OnInit {

  // === REACTIVE FORM ===
  userForm: FormGroup = new FormGroup({});

  get positionAttributes(): FormArray | null {
    return this.userForm.get('positionAttributes') ? this.userForm.get('positionAttributes') as FormArray : null;
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  /*  Load the roles and build the form.
  */
  ngOnInit(): void {
    const controls = {};
    Object.assign(controls,
      this.data.multiple && { roles: [this.data.user.roles ? this.data.user.roles.map(x => x.id) : null] },
      !this.data.multiple && { role: this.data.user?.roles ? this.data.user.roles[0].id : '' },
      this.data.positionAttributeCategories &&
      {
        positionAttributes: this.formBuilder.array(this.data.positionAttributeCategories.map(x => {
          const attributeValue = this.data?.user?.positionAttributes?.find(element => {
            return x.id === (Object(element.category).id);
          });
          return this.formBuilder.group({
            value: [attributeValue ? attributeValue.value : ''],
            category: [x.id, Validators.required]
          });
        }))
      }
    );
    this.userForm = this.formBuilder.group(controls);
  }

  public categoryTitle(id: number): string {
    const out: PositionAttributeCategory | undefined = this.data?.positionAttributeCategories && this.data?.positionAttributeCategories[id];
    if (out) {
      return out.title ? out.title : '';
    } else {
      return '';
    }
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
