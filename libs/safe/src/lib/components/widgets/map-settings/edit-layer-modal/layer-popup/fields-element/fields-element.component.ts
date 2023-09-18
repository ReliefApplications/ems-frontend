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
import { SafeEditorControlComponent } from '../../../../../editor-control/editor-control.component';
import { INLINE_EDITOR_CONFIG } from '../../../../../../const/tinymce.const';
import { SafeEditorService } from '../../../../../../services/editor/editor.service';
import { SafeUnsubscribeComponent } from '../../../../../utils/unsubscribe/unsubscribe.component';
import {
  ListBoxModule,
  ListBoxToolbarConfig,
} from '@progress/kendo-angular-listbox';
import {
  ButtonModule,
  DividerModule,
  FormWrapperModule,
  IconModule,
  TooltipModule,
} from '@oort-front/ui';
/**
 * Popup fields element component.
 */
@Component({
  selector: 'safe-fields-element',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    DividerModule,
    ButtonModule,
    SafeEditorControlComponent,
    IconModule,
    TooltipModule,
    ListBoxModule,
  ],
  templateUrl: './fields-element.component.html',
  styleUrls: ['./fields-element.component.scss'],
})
export class FieldsElementComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() fields$!: Observable<Fields[]>;
  @Input() formGroup!: FormGroup;

  public editorConfig = INLINE_EDITOR_CONFIG;

  public availableFields: string[] = [];
  public selectedFields: string[] = [];
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
      this.editorService.addCalcAndKeysAutoCompleter(
        this.editorConfig,
        this.availableFields.map((field) => ({
          text: `{{${field}}}`,
          value: `{{${field}}}`,
        }))
      );
    });

    // Get initial selected fields
    this.selectedFields = this.formGroup.get('fields')?.value ?? [];
    this.selectedFields.forEach((field: string) => {
      const index = this.availableFields.indexOf(field);
      if (index > -1) this.availableFields.splice(index, 1);
    });
  }

  /**
   * Creates an instance of FieldsElementComponent.
   *
   * @param editorService Shared tinymce editor service.
   */
  constructor(private editorService: SafeEditorService) {
    super();
  }

  /** Updates the element selected fields form value */
  public handleActionClick() {
    this.formGroup.setControl(
      'fields',
      new FormArray(this.selectedFields.map((x) => new FormControl(x)))
    );
  }
}
