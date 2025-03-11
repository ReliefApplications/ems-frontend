import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { EditorService } from '../../../../services/editor/editor.service';
import {
  DESCRIPTION_EDITOR_CONFIG,
  EMAIL_EDITOR_CONFIG,
  INLINE_EDITOR_CONFIG,
} from '../../../../const/tinymce.const';
import { get } from 'lodash';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorControlComponent } from '../../../controls/editor-control/editor-control.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import {
  ButtonModule,
  IconModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { DialogModule, FormWrapperModule } from '@oort-front/ui';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { RawEditorSettings } from 'tinymce';

/** Model for the data input */
interface DialogData {
  name?: string;
  type?: string;
  content?: any;
}

/** Available body editor keys for autocompletion */
const BODY_EDITOR_AUTOCOMPLETE_KEYS = [
  '{{now}}',
  '{{today}}',
  '{{dataset}}',
  '{{recordId}}',
];
/** Available subject editor keys for autocompletion */
const SUBJECT_EDITOR_AUTOCOMPLETE_KEYS = ['{{now}}', '{{today}}'];
/** Available body editor keys for autocompletion */
const DESCRIPTION_EDITOR_AUTOCOMPLETE_KEYS = [
  '{{now}}',
  '{{today}}',
  '{{recordId}}',
];

/** Component for editing a template */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormWrapperModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    EditorModule,
    EditorControlComponent,
    ButtonModule,
    SelectMenuModule,
    IconModule,
    TooltipModule,
  ],
  selector: 'shared-edit-template',
  templateUrl: './edit-template-modal.component.html',
  styleUrls: ['./edit-template-modal.component.scss'],
})
export class EditTemplateModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  // === REACTIVE FORM ===
  /** Reactive form for the template */
  public form = this.fb.group({
    name: [get(this.data, 'name', null), Validators.required],
    type: [get(this.data, 'type', 'email'), Validators.required],
    subject: [get(this.data, 'content.subject', null)],
    body: [get(this.data, 'content.body', '')],
    description: [get(this.data, 'content.description', '')],
    title: [get(this.data, 'content.title', null)],
  });

  /** tinymce body editor */
  public bodyEditor: RawEditorSettings = EMAIL_EDITOR_CONFIG;

  /** tinymce subject editor */
  public subjectEditor: RawEditorSettings = INLINE_EDITOR_CONFIG;

  /** tinymce description editor */
  public descriptionEditor: RawEditorSettings = DESCRIPTION_EDITOR_CONFIG;

  /**
   * Component for editing a template
   *
   * @param fb Angular form builder service
   * @param dialogRef Dialog ref of the component
   * @param data Data input of the modal
   * @param editorService Editor service used to get main URL and current language
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<EditTemplateModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private editorService: EditorService
  ) {
    super();
    // Set the editor base url based on the environment file
    this.bodyEditor.base_url = editorService.url;
    // Set the editor language
    this.bodyEditor.language = editorService.language;
    // Set the editor base url based on the environment file
    this.subjectEditor.base_url = editorService.url;
    // Set the editor language
    this.subjectEditor.language = editorService.language;
  }

  /** Build the form. */
  ngOnInit(): void {
    this.editorService.addCalcAndKeysAutoCompleter(
      this.bodyEditor,
      BODY_EDITOR_AUTOCOMPLETE_KEYS.map((key) => ({ value: key, text: key }))
    );
    this.editorService.addCalcAndKeysAutoCompleter(
      this.subjectEditor,
      SUBJECT_EDITOR_AUTOCOMPLETE_KEYS.map((key) => ({ value: key, text: key }))
    );

    this.editorService.addCalcAndKeysAutoCompleter(
      this.descriptionEditor,
      DESCRIPTION_EDITOR_AUTOCOMPLETE_KEYS.map((key) => ({
        value: key,
        text: key,
      }))
    );

    // Add required validation fields depending on type
    this.form
      .get('type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === 'email') {
          this.form.get('subject')?.addValidators(Validators.required);
          this.form.get('body')?.addValidators(Validators.required);

          this.form.get('title')?.removeValidators(Validators.required);
          this.form.get('description')?.removeValidators(Validators.required);
        } else {
          this.form.get('title')?.addValidators(Validators.required);
          this.form.get('description')?.addValidators(Validators.required);

          this.form.get('subject')?.removeValidators(Validators.required);
          this.form.get('body')?.removeValidators(Validators.required);
        }
      });
  }
}
