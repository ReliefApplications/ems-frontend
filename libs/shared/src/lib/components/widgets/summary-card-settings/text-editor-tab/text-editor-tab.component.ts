import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { EditorService } from '../../../../services/editor/editor.service';
import { WIDGET_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { DataTemplateService } from '../../../../services/data-template/data-template.service';

/**
 * Edition of card template.
 */
@Component({
  selector: 'shared-text-editor-tab',
  templateUrl: './text-editor-tab.component.html',
  styleUrls: ['./text-editor-tab.component.scss'],
})
export class TextEditorTabComponent implements OnChanges {
  /** Form group */
  @Input() form!: UntypedFormGroup;
  /** Available fields */
  @Input() fields: any[] = [];
  /** Tinymce editor configuration */
  public editor = WIDGET_EDITOR_CONFIG;
  /** editor loading */
  public editorLoading = true;

  /**
   * Edition of card template.
   *
   * @param editorService Shared editor service
   * @param dataTemplateService Shared data template service
   */
  constructor(
    private editorService: EditorService,
    private dataTemplateService: DataTemplateService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
    this.dataTemplateService.setEditorLinkList(this.editor);
  }

  ngOnChanges(): void {
    // Setup editor auto complete
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, [
      ...this.dataTemplateService.getAutoCompleterKeys(this.fields),
      ...this.dataTemplateService.getAutoCompleterPageKeys(),
    ]);
  }
}
