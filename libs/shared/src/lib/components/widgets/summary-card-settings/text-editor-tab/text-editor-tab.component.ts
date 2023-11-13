import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { EditorService } from '../../../../services/editor/editor.service';
import { DataTemplateService } from '../../../../services/data-template/data-template.service';
import { WIDGET_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { Aggregation } from '../../../../models/aggregation.model';

/**
 * Component used in the card-modal-settings for editing the content of the card.
 */
@Component({
  selector: 'shared-text-editor-tab',
  templateUrl: './text-editor-tab.component.html',
  styleUrls: ['./text-editor-tab.component.scss'],
})
export class TextEditorTabComponent implements OnChanges {
  @Input() form!: UntypedFormGroup;
  @Input() fields: any[] = [];

  /** tinymce editor */
  public editor = WIDGET_EDITOR_CONFIG;

  /**
   * TextEditorTabComponent constructor.
   *
   * @param editorService Editor service used to get main URL and current language
   * @param dataTemplateService Shared data template service
   */
  constructor(
    private editorService: EditorService,
    private dataTemplateService: DataTemplateService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url || '';
    // Set the editor language
    this.editor.language = editorService.language;
    this.dataTemplateService.setEditorLinkList(this.editor);
  }

  ngOnChanges(): void {
    // verify if we have aggregation selected to inject in html
    const aggregation = this.form.get('aggregation')?.value;
    const aggregationObj: Aggregation[] = [];
    if (aggregation.id) {
      aggregationObj.push({
        id: aggregation?.id,
        name: aggregation.name,
      });
    }
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, [
      ...this.dataTemplateService.getAutoCompleterKeys(this.fields),
      ...this.dataTemplateService.getAutoCompleterPageKeys(),
      ...this.dataTemplateService.getAutoCompleteAggregation(aggregationObj),
    ]);
  }
}
