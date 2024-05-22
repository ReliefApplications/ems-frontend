import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';
import { WIDGET_EDITOR_CONFIG } from 'libs/shared/src/lib/const/tinymce.const';
import { RawEditorSettings } from 'tinymce';
import { EditorService } from 'libs/shared/src/lib/services/editor/editor.service';

/**
 * Main tab of widget grid configuration modal.
 */
@Component({
  selector: 'shared-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent {
  /** Widget form group */
  @Input() formGroup!: UntypedFormGroup;
  /** Selected resource */
  @Input() resource: Resource | null = null;
  /** Available resource templates */
  @Input() templates: Form[] = [];
  /** Loading status */
  @Input() loading = false;
  /** tinymce editor configuration */
  public editor: RawEditorSettings = {
    ...WIDGET_EDITOR_CONFIG,
    height: 200,
  };
  /** Is editor loading */
  public editorLoading = true;

  /**
   * Main tab of chart settings modal.
   *
   * @param editorService Editor service
   */
  constructor(private editorService: EditorService) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  /**
   * Reset given form field value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param formField Current form field
   * @param event click event
   */
  clearFormField(formField: string, event: Event) {
    if (this.formGroup.get(formField)?.value) {
      this.formGroup.get(formField)?.setValue(null);
    }
    event.stopPropagation();
  }
}
