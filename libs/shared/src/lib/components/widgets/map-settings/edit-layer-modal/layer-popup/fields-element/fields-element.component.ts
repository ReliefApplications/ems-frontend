import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Fields } from '../../../../../../models/layer.model';
import { Observable, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../../../utils/unsubscribe/unsubscribe.component';
import {
  ListBoxModule,
  ListBoxToolbarConfig,
} from '@progress/kendo-angular-listbox';
import { ButtonModule, DividerModule, FormWrapperModule } from '@oort-front/ui';
import { LocalizedInputComponent } from '../../../../../controls/public-api';
/**
 * Popup fields element component.
 */
@Component({
  selector: 'shared-fields-element',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    DividerModule,
    ButtonModule,
    LocalizedInputComponent,
    ListBoxModule,
  ],
  templateUrl: './fields-element.component.html',
  styleUrls: ['./fields-element.component.scss'],
})
export class FieldsElementComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** Available fields as array */
  public availableFields: string[] = [];
  /** Selected fields */
  public selectedFields: string[] = [];
  /** Listbox toolbar settings */
  public toolbarSettings: ListBoxToolbarConfig = {
    position: 'right',
    tools: [
      'moveUp',
      'moveDown',
      'transferFrom',
      'transferTo',
      'transferAllFrom',
      'transferAllTo',
    ],
  };

  ngOnInit(): void {
    // Listen to fields changes
    this.fields$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.availableFields = value.map((field) => field.name);
    });

    // Get initial selected fields
    this.selectedFields = this.formGroup.get('fields')?.value ?? [];
    this.selectedFields.forEach((field: string) => {
      const index = this.availableFields.indexOf(field);
      if (index > -1) this.availableFields.splice(index, 1);
    });
  }

  /** Updates the element selected fields form value */
  public handleActionClick() {
    this.formGroup.setControl(
      'fields',
      new FormArray(this.selectedFields.map((x) => new FormControl(x)))
    );
  }
}
