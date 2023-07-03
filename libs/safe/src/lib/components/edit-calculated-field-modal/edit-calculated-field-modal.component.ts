import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FIELD_EDITOR_CONFIG } from '../../const/tinymce.const';
import { SafeEditorService } from '../../services/editor/editor.service';
import { getCalcKeys, getDataKeys, getInfoKeys } from './utils/keys';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import {
  DialogModule,
  ButtonModule,
  TooltipModule,
  FormWrapperModule,
} from '@oort-front/ui';
/**
 * Interface describing the structure of the data displayed in the dialog
 */
interface DialogData {
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
    FormWrapperModule,
    DialogModule,
    EditorModule,
    ButtonModule,
    TooltipModule,
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  selector: 'safe-edit-calculated-field-modal',
  templateUrl: './edit-calculated-field-modal.component.html',
  styleUrls: ['./edit-calculated-field-modal.component.scss'],
})
export class SafeEditCalculatedFieldModalComponent implements OnInit {
  public form!: UntypedFormGroup;
  public field!: any;

  public resourceFields: any[] = [];

  /** tinymce editor */
  public editor: any = FIELD_EDITOR_CONFIG;

  /**
   * Modal to edit Calculated field.
   *
   * @param dialogRef This is the reference of the dialog that will be opened.
   * @param formBuilder This is the service used to build forms.
   * @param editorService Editor service used to get main URL and current language
   * @param data This is the data that is passed to the modal when it is opened.
   * @param environment Environment specific data
   * @param translate Translate service
   */
  constructor(
    public dialogRef: DialogRef<SafeEditCalculatedFieldModalComponent>,
    public formBuilder: UntypedFormBuilder,
    private editorService: SafeEditorService,
    @Inject(DIALOG_DATA) public data: DialogData,
    @Inject('environment') environment: any,
    private translate: TranslateService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    this.field = this.data.calculatedField;
    this.resourceFields = this.data.resourceFields;
    this.form = this.formBuilder.group({
      name: [
        this.data.calculatedField?.name,
        [Validators.required, Validators.pattern(/^[a-z]+[a-z0-9_]+$/)],
      ],
      expression: [this.data.calculatedField?.expression, Validators.required],
      // TODO: Add display options
    });
    const keys = [
      ...getCalcKeys(),
      ...getInfoKeys(),
      ...getDataKeys(this.resourceFields),
    ];
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
  }

  /**
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form?.getRawValue());
  }
}
