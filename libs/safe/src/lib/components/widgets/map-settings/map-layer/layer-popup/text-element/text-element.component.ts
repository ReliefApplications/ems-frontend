import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeEditorService } from '../../../../../../services/editor/editor.service';
import { POPUP_EDITOR_CONFIG } from '../../../../../../const/tinymce.const';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { Fields } from '../../layer-fields/layer-fields.component';
import { getDataKeys } from './utils/keys';
import { SafeMapLayersService } from '../../../../../../services/map/map-layers.service';

/**
 * Popup text element component.
 */
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
export class TextElementComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  public fields!: Fields[];

  /** tinymce editor */
  public editor: any = POPUP_EDITOR_CONFIG;

  /**
   * Popup text element component.
   *
   * @param editorService Shared tinymce editor service
   * @param mapLayersService Shared map layer Service
   */
  constructor(
    private editorService: SafeEditorService,
    private mapLayersService: SafeMapLayersService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    // Listen to fields changes
    this.mapLayersService.fields$.subscribe((value) => {
      this.fields = value;
      const keys = [...getDataKeys(this.fields)];
      this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
    });
  }
}
