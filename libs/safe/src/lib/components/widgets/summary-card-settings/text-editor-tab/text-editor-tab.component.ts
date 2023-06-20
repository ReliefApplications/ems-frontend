import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeEditorService } from '../../../../services/editor/editor.service';
import { WIDGET_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { getCalcKeys, getDataKeys } from '../../summary-card/parser/utils';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { EditorComponent } from '@tinymce/tinymce-angular';

/**
 * Component used in the card-modal-settings for editing the content of the card.
 */
@Component({
  selector: 'safe-text-editor-tab',
  templateUrl: './text-editor-tab.component.html',
  styleUrls: ['./text-editor-tab.component.scss'],
})
export class SafeTextEditorTabComponent
  extends SafeUnsubscribeComponent
  implements OnChanges, AfterViewInit
{
  @Input() form!: UntypedFormGroup;
  @Input() fields: any[] = [];

  /** tinymce editor */
  public editor = WIDGET_EDITOR_CONFIG;
  @ViewChild(EditorComponent) editorComponent!: EditorComponent;

  /**
   * SafeTextEditorTabComponent constructor.
   *
   * @param editorService Editor service used to get main URL and current language
   */
  constructor(private editorService: SafeEditorService) {
    super();
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngAfterViewInit(): void {
    this.editorComponent?.onKeyDown
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        if (e.event.code === 'ArrowDown' || e.event.code === 'ArrowUp') {
          const collectionGroup = document.querySelector(
            '.tox-collection__group'
          );
          // If autocomplete list in the DOM, trigger scrolling events
          if (collectionGroup) {
            if (!this.editorService.activeItemScrollListener) {
              // Initialize listener
              this.editorService.initScrollActive(
                collectionGroup,
                e.editor.getElement()
              );
              // Execute directly first keydown event when no listener is ready
              this.editorService.handleKeyDownEvent(
                e.event,
                collectionGroup,
                e.editor.getElement()
              );
            }
          }
        }
      });
  }

  ngOnChanges(): void {
    const dataKeys = getDataKeys(this.fields);
    const calcKeys = getCalcKeys();
    const keys = dataKeys.concat(calcKeys);
    // Setup editor auto complete
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
  }
}
