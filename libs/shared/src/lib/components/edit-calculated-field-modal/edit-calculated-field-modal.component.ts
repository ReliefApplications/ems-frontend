import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { INLINE_EDITOR_CONFIG } from '../../const/tinymce.const';
import { EditorService } from '../../services/editor/editor.service';
import { getCalcKeys, getDataKeys, getInfoKeys } from './utils/keys';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorControlComponent } from '../editor-control/editor-control.component';
import {
  DialogModule,
  ButtonModule,
  TooltipModule,
  FormWrapperModule,
  IconModule,
} from '@oort-front/ui';
import { RawEditorSettings } from 'tinymce';
/**
 * Interface describing the structure of the data displayed in the dialog
 */
interface DialogData {
  /** TODO: Add type to fields */
  calculatedField?: any;
  resourceFields: any[];
}

/**
 * Modal to edit aggregation.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    EditorControlComponent,
    FormWrapperModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
  ],
  selector: 'shared-edit-calculated-field-modal',
  templateUrl: './edit-calculated-field-modal.component.html',
  styleUrls: ['./edit-calculated-field-modal.component.scss'],
})
export class EditCalculatedFieldModalComponent implements OnInit {
  public form = this.fb.group({
    name: [
      this.data.calculatedField?.name,
      [Validators.required, Validators.pattern(/^[a-z]+[a-z0-9_]+$/)],
    ],
    expression: [this.data.calculatedField?.expression, Validators.required],
    // TODO: Add display options
  });
  public field!: any;

  public resourceFields: any[] = [];

  /** tinymce editor */
  public editor: RawEditorSettings = INLINE_EDITOR_CONFIG;

  /**
   * Modal to edit Calculated field.
   *
   * @param dialogRef This is the reference of the dialog that will be opened.
   * @param fb This is the service used to build forms.
   * @param editorService Editor service used to get main URL and current language
   * @param data This is the data that is passed to the modal when it is opened.
   */
  constructor(
    public dialogRef: DialogRef,
    public fb: FormBuilder,
    private editorService: EditorService,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    this.field = this.data.calculatedField;
    this.resourceFields = this.data.resourceFields;
    const keys = [
      ...getCalcKeys(),
      ...getInfoKeys(),
      ...getDataKeys(this.resourceFields),
    ];
    this.editorService.addCalcAndKeysAutoCompleter(
      this.editor,
      keys.map((key) => ({ value: key, text: key }))
    );
  }

  /**
   * Closes the modal sending form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form?.getRawValue());
  }
}
