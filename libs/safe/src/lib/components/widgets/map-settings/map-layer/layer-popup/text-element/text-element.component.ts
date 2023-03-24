import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeEditorService } from '../../../../../../services/editor/editor.service';
import { POPUP_EDITOR_CONFIG } from '../../../../../../const/tinymce.const';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'safe-text-element',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditorModule],
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss'],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class TextElementComponent {
  @Input() formGroup!: FormGroup;

  /** tinymce editor */
  public editor: any = POPUP_EDITOR_CONFIG;

  constructor(private editorService: SafeEditorService) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }
}
