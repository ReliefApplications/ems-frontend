import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Editor } from 'tinymce';
import { FIELD_EDITOR_CONFIG } from '../../../const/tinymce.const';
import { SafeEditorService } from '../../../services/editor/editor.service';
import { getCalcKeys, getDataKeys } from './utils/keys';
/**
 * Interface describing the structure of the data displayed in the dialog
 */
interface DialogData {
  derivedField?: any;
  resourceFields: any[];
}

/**
 * Modal to edit aggregation.
 */
@Component({
  selector: 'safe-edit-derived-field-modal',
  templateUrl: './edit-derived-field-modal.component.html',
  styleUrls: ['./edit-derived-field-modal.component.scss'],
})
export class SafeEditDerivedFieldModalComponent implements OnInit {
  public form!: FormGroup;
  public field!: any;

  public resourceFields: any[] = [];

  /** tinymce editor */
  public editor: any = FIELD_EDITOR_CONFIG;

  /**
   * Modal to edit derived field.
   *
   * @param dialogRef This is the reference of the dialog that will be opened.
   * @param formBuilder This is the service used to build forms.
   * @param editorService Editor service used to get main URL and current language
   * @param data This is the data that is passed to the modal when it is opened.
   * @param environment Environment specific data
   * @param translate Translate service
   */
  constructor(
    public dialogRef: MatDialogRef<SafeEditDerivedFieldModalComponent>,
    public formBuilder: FormBuilder,
    private editorService: SafeEditorService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject('environment') environment: any,
    private translate: TranslateService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    this.field = this.data.derivedField;
    this.resourceFields = this.data.resourceFields;
    this.form = this.formBuilder.group({
      name: [
        this.data.derivedField?.name,
        [Validators.required, Validators.pattern(/^[a-z]+[a-z0-9_]+$/)],
      ],
      definition: [this.data.derivedField?.definition, Validators.required],
      // TODO: Add display options
    });
    const keys = [...getCalcKeys(), ...getDataKeys(this.resourceFields)];
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
  }

  /**
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form?.getRawValue());
  }
}
