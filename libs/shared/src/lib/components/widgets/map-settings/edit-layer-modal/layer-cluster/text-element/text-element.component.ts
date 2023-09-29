import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorService } from '../../../../../../services/editor/editor.service';
import { POPUP_EDITOR_CONFIG } from '../../../../../../const/tinymce.const';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MapLayersService } from '../../../../../../services/map/map-layers.service';
import { UnsubscribeComponent } from '../../../../../utils/unsubscribe/unsubscribe.component';

/**
 * Popup text element component.
 */
@Component({
  selector: 'shared-text-element',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditorModule],
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss'],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class TextElementComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;

  /** tinymce editor */
  public editor: any = POPUP_EDITOR_CONFIG;

  /**
   * Popup text element component.
   *
   * @param editorService Shared tinymce editor service
   * @param mapLayersService Shared map layer Service
   */
  constructor(
    private editorService: EditorService,
    private mapLayersService: MapLayersService
  ) {
    super();
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, [
      {
        value: `{cluster_count}`,
        text: `{cluster_count}`,
      },
    ]);
  }
}
