import { Component, Inject } from '@angular/core';
import { Role } from '../../../models/user.model';
import { PositionAttributeCategory } from '../../../models/position-attribute-category.model';
import { FormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

/** Model for the input  */
interface DialogData {
  roles: Role[];
  positionAttributeCategories?: PositionAttributeCategory[];
}

/** Component for adding a user */
@Component({
  selector: 'shared-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent extends UnsubscribeComponent {
  /** Form for the add user modal */
  form = this.fb.group({
    email: ['', Validators.minLength(1)],
    role: ['', Validators.required],
    ...(this.data.positionAttributeCategories && {
      positionAttributes: this.fb.array(
        this.data.positionAttributeCategories.map((x) =>
          this.fb.group({
            value: [''],
            category: [x.id, Validators.required],
          })
        )
      ),
    }),
  });

  /** @returns The position attributes available */
  get positionAttributes(): UntypedFormArray | null {
    return this.form.get('positionAttributes')
      ? (this.form.get('positionAttributes') as UntypedFormArray)
      : null;
  }

  /**
   * Constructor for the add user component
   *
   * @param fb The form builder service
   * @param dialogRef The Dialog reference service
   * @param data The input data
   * @param translate The translation service
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<AddUserComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    public translate: TranslateService
  ) {
    super();
  }
}
