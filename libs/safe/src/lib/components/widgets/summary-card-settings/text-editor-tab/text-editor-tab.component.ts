import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeEditorService } from '../../../../services/editor/editor.service';
import { WIDGET_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { getCalcKeys, getDataKeys } from '../../summary-card/parser/utils';

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
   */
  constructor(private editorService: SafeEditorService) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnChanges(): void {
    const dataKeys = getDataKeys(this.fields);
    const calcKeys = getCalcKeys();
    const keys = dataKeys.concat(calcKeys);
    // Setup editor auto complete
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
  }
}
