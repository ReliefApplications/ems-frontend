import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule, FormWrapperModule, TextareaModule } from '@oort-front/ui';
import { EditorControlComponent } from '../../../controls/editor-control/editor-control.component';
import { RawEditorSettings } from 'tinymce';
import { INLINE_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { EditorService } from '../../../../services/editor/editor.service';
import { getDataKeys } from '../../../edit-calculated-field-modal/utils/keys';
import { FileExplorerRequestPermissionsRecipientsComponent } from '../file-explorer-request-permissions-recipients/file-explorer-request-permissions-recipients.component';

/** Available fields for the email template */
const AVAILABLE_FIELDS = [
  'user', // Current user name
  'form', // Current form name
];

/**
 * File explorer request permissions template editor component.
 */
@Component({
  selector: 'shared-file-explorer-request-permissions-template',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    EditorControlComponent,
    FormWrapperModule,
    AlertModule,
    TextareaModule,
    FileExplorerRequestPermissionsRecipientsComponent,
  ],
  templateUrl: './file-explorer-request-permissions-template.component.html',
  styleUrls: ['./file-explorer-request-permissions-template.component.scss'],
})
export class FileExplorerRequestPermissionsTemplateComponent implements OnInit {
  /** Request access form group */
  @Input() formGroup!: FormGroup;
  /** Subject tinymce editor */
  public subjectEditor: RawEditorSettings = INLINE_EDITOR_CONFIG;
  /** Body tinymce editor */
  public bodyEditor: RawEditorSettings = {
    ...INLINE_EDITOR_CONFIG,
    setup: (editor) => {
      editor.on('init', () => {
        const text: string = this.formGroup.get('body')?.value || '';
        console.log(this.formGroup.get('body')?.value);
        const lines = text.split('\n');
        console.log(lines.map((line) => `<p>${line}</p>`).join(''));
        editor.setContent(lines.map((line) => `<p>${line}</p>`).join(''));
      });
      editor.on('change keyup', () => {
        console.log(editor.getContent());
      });
    },
    inline: false,
    height: 300,
  };

  /**
   * File explorer request permissions template editor component.
   *
   * @param editorService Shared editor service
   */
  constructor(private editorService: EditorService) {
    // Set the editor base url based on the environment file
    this.subjectEditor.base_url = editorService.url;
    // Set the editor language
    this.subjectEditor.language = editorService.language;
    // Set the editor base url based on the environment file
    this.bodyEditor.base_url = editorService.url;
    // Set the editor language
    this.bodyEditor.language = editorService.language;
  }

  ngOnInit() {
    const keys = getDataKeys(
      AVAILABLE_FIELDS.map((field) => ({ name: field }))
    );
    this.editorService.addCalcAndKeysAutoCompleter(
      this.subjectEditor,
      keys.map((key) => ({ value: key, text: key }))
    );
    this.editorService.addCalcAndKeysAutoCompleter(
      this.bodyEditor,
      keys.map((key) => ({ value: key, text: key }))
    );
    // Ensure that the text displays on multiple lines in the editor
    const text: string = this.formGroup.get('body')?.value || '';
    const lines = text.split('\n');
    this.formGroup
      .get('body')
      ?.setValue(lines.map((line) => `<p>${line}</p>`).join(''));
  }
}
