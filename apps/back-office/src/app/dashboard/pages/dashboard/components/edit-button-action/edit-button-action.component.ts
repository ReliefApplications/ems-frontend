import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Category,
  DialogModule,
  Variant,
  variants as ButtonVariants,
  categories as ButtonCategories,
  FormWrapperModule,
  SelectMenuModule,
  ButtonModule,
  ToggleModule,
} from '@oort-front/ui';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { get } from 'lodash';

export type ButtonActionT = {
  text: string;
  href: string;
  variant: Variant;
  category: Category;
  openInNewTab: boolean;
};

/**
 * Create a form group for the button action
 *
 * @param data Data to initialize the form
 * @returns the form group
 */
const createButtonActionForm = (data?: ButtonActionT) => {
  return new FormGroup({
    text: new FormControl(get(data, 'text', ''), Validators.required),
    href: new FormControl(get(data, 'href', ''), Validators.required),
    variant: new FormControl(get(data, 'variant', 'primary')),
    category: new FormControl(get(data, 'category', 'secondary')),
    openInNewTab: new FormControl(get(data, 'openInNewTab', true)),
  });
};

/** Component for editing a dashboard button action */
@Component({
  selector: 'app-edit-button-action',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    SelectMenuModule,
    ButtonModule,
    ToggleModule,
  ],
  templateUrl: './edit-button-action.component.html',
  styleUrls: ['./edit-button-action.component.scss'],
})
export class EditButtonActionComponent {
  public form: ReturnType<typeof createButtonActionForm>;

  public variants = ButtonVariants;
  public categories = ButtonCategories;

  public isNew: boolean;

  /**
   * Component for editing a dashboard button action
   *
   * @param dialogRef dialog reference
   * @param data initial button action
   */
  constructor(
    public dialogRef: DialogRef<ButtonActionT>,
    @Inject(DIALOG_DATA) private data: ButtonActionT
  ) {
    this.form = createButtonActionForm(data);
    this.isNew = !data;
  }

  /** On click on the preview button open the href */
  public preview(): void {
    const href = this.form.get('href')?.value;
    if (href) {
      const isNewTab = this.form.get('openInNewTab')?.value ?? true;
      if (isNewTab) window.open(href, '_blank');
      else window.location.href = href;
    }
  }

  /** On click on the save button close the dialog with the form value */
  public onSubmit(): void {
    this.dialogRef.close(this.form.value as any);
  }
}
