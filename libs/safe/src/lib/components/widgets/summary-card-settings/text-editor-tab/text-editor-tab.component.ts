import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeEditorService } from '../../../../services/editor/editor.service';
import { WIDGET_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { DataTemplateService } from '../../../../services/data-template/data-template.service';

/**
 * Component used in the card-modal-settings for editing the content of the card.
 */
@Component({
  selector: 'safe-text-editor-tab',
  templateUrl: './text-editor-tab.component.html',
  styleUrls: ['./text-editor-tab.component.scss'],
})
export class SafeTextEditorTabComponent implements OnChanges {
  @Input() form!: UntypedFormGroup;
  @Input() fields: any[] = [];

  /** tinymce editor */
  public editor = WIDGET_EDITOR_CONFIG;

  /**
   * SafeTextEditorTabComponent constructor.
   *
   * @param editorService Editor service used to get main URL and current language
   * @param dataTemplateService Shared data template service
   */
  constructor(
    private editorService: SafeEditorService,
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
