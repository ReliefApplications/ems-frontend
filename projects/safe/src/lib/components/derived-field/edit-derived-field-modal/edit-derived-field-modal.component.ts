import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Editor } from 'tinymce';
import {
  EDITOR_LANGUAGE_PAIRS,
  FIELD_EDITOR_CONFIG,
} from '../../../const/tinymce.const';
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
   * @param data This is the data that is passed to the modal when it is opened.
   * @param environment Environment specific data
   * @param translate Translate service
   */
  constructor(
    public dialogRef: MatDialogRef<SafeEditDerivedFieldModalComponent>,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject('environment') environment: any,
    private translate: TranslateService
  ) {
    // Set the editor base url based on the environment file
    let url: string;
    if (environment.module === 'backoffice') {
      url = new URL(environment.backOfficeUri).pathname;
    } else {
      url = new URL(environment.frontOfficeUri).pathname;
    }
    if (url !== '/') {
      this.editor.base_url = url.slice(0, -1) + '/tinymce';
    } else {
      this.editor.base_url = '/tinymce';
    }
    // Set the editor language
    const lang = this.translate.currentLang;
    const editorLang = EDITOR_LANGUAGE_PAIRS.find((x) => x.key === lang);
    if (editorLang) {
      this.editor.language = editorLang.tinymceKey;
    } else {
      this.editor.language = 'en';
    }
  }

  ngOnInit(): void {
    this.field = this.data.derivedField;
    this.resourceFields = this.data.resourceFields;
    this.form = this.formBuilder.group({
      name: [this.data.derivedField?.name, Validators.required],
      definition: [this.data.derivedField?.definition, Validators.required],
      // TODO: Add display options
    });

    this.form.get('definition')?.valueChanges.subscribe((value: string) => {
      console.log(value);
    });

    this.form.get('name')?.valueChanges.subscribe((value: string) => {
      console.log(value);
    });
  }

  /**
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form?.getRawValue());
  }
}
