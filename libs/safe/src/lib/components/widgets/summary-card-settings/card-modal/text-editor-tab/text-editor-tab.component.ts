import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeEditorService } from '../../../../../services/editor/editor.service';
import { WIDGET_EDITOR_CONFIG } from '../../../../../const/tinymce.const';
import { getCalcKeys, getDataKeys } from '../../../summary-card/parser/utils';

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
    // Setup editor auto completor
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
    this.allowScrolling();
  }

  /**
   * Allows scrolling within the TinyMCE autocompleter container, and prevents the autocompleter from closing when clicking on the scrollbar.
   *  This function sets a timeout to give TinyMCE some time to render its elements before trying to access them.
   */
  private allowScrolling() {
    setTimeout(function () {
      //not ideal but trying this for now, there is half a second of vulnerability
      const autoCompleterContainer = document.querySelector('.tox-tinymce-aux');
      if (!autoCompleterContainer) return;

      const hasClickedOnScrollbar = (
        mouseX: number,
        autoCompleterElement: HTMLElement
      ) => {
        if (!autoCompleterElement) return false;
        const scrollbarSize = 11; //size of the scrollbar, this is a bit squishy
        const autoCompleterWidth =
          autoCompleterElement.clientWidth - scrollbarSize;
        if (autoCompleterWidth <= mouseX) {
          return true;
        }
        return false;
      };

      autoCompleterContainer.addEventListener('mousedown', function (event) {
        const autoCompleterElement =
          document.querySelector('.tox-autocompleter');
        if (!autoCompleterElement) return;
        const autoCompleterOffset =
          autoCompleterElement.getBoundingClientRect();
        if (!autoCompleterOffset) return;
        const mouseX = (event as MouseEvent).pageX - autoCompleterOffset.left;

        if (
          hasClickedOnScrollbar(mouseX, autoCompleterElement as HTMLElement)
        ) {
          event.stopPropagation();
        }
      });
    }, 300);
  }
}
