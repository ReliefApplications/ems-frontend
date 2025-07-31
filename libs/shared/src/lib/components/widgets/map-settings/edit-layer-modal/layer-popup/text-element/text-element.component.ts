import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorService } from '../../../../../../services/editor/editor.service';
import { POPUP_EDITOR_CONFIG } from '../../../../../../const/tinymce.const';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { Fields } from '../../../../../../models/layer.model';
import { Observable } from 'rxjs';
import { SpinnerModule } from '@oort-front/ui';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Popup text element component.
 */
@Component({
  selector: 'shared-text-element',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    SpinnerModule,
  ],
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss'],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class TextElementComponent implements OnInit {
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** Tinymce editor configuration */
  public editor: any = POPUP_EDITOR_CONFIG;
  /** Is editor loading */
  public editorLoading = true;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Popup text element component.
   *
   * @param editorService Shared tinymce editor service
   */
  constructor(private editorService: EditorService) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    // Listen to fields changes
    this.fields$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const keys = value.map((field) => ({
          value: `{{${field.name}}}`,
          text: `{{${field.name}}}`,
        }));
        this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
      });
  }
}
