import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { SafeEditorService } from '../../../../services/editor/editor.service';
import { EMAIL_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import get from 'lodash/get';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { ButtonModule, SelectMenuModule } from '@oort-front/ui';
import { DialogModule, FormWrapperModule } from '@oort-front/ui';

/** Model for the data input */
interface DialogData {
  name?: string;
  type?: string;
  content?: any;
}

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
    ButtonModule,
    SelectMenuModule,
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  selector: 'safe-edit-template',
  templateUrl: './edit-template-modal.component.html',
  styleUrls: ['./edit-template-modal.component.scss'],
})
export class EditTemplateModalComponent implements OnInit {
  // === REACTIVE FORM ===
  form: UntypedFormGroup = new UntypedFormGroup({});

  /** tinymce editor */
  public editor: any = EMAIL_EDITOR_CONFIG;

  /**
   * Component for editing a template
   *
   * @param formBuilder Angular form builder service
   * @param dialogRef Dialog ref of the component
   * @param data Data input of the modal
   * @param editorService Editor service used to get main URL and current language
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: DialogRef<EditTemplateModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private editorService: SafeEditorService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  /** Build the form. */
  ngOnInit(): void {
    // In the future, change this according to the type of template
    this.form = this.formBuilder.group({
      name: [get(this.data, 'name', null), Validators.required],
      type: [get(this.data, 'type', 'email'), Validators.required],
      subject: [get(this.data, 'content.subject', null), Validators.required],
      body: [get(this.data, 'content.body', ''), Validators.required],
    });
  }
}
