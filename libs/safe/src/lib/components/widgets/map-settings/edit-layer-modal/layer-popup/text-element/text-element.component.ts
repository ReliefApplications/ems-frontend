import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeEditorService } from '../../../../../../services/editor/editor.service';
import { POPUP_EDITOR_CONFIG } from '../../../../../../const/tinymce.const';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { Fields } from '../../../../../../models/layer.model';
import { SafeMapLayersService } from '../../../../../../services/map/map-layers.service';
import { Observable, takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../../../utils/unsubscribe/unsubscribe.component';

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
export class TextElementComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() formGroup!: FormGroup;
  @Input() fields$!: Observable<Fields[]>;

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
    super();
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    // Listen to fields changes
    this.fields$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      const keys = value.map((field) => ({
        value: `{{${field.name}}}`,
        text: `{{${field.name}}}`,
      }));
      this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
    });
  }
}
