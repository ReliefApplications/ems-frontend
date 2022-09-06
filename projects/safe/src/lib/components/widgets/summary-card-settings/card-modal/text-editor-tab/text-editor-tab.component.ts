import { Component, Inject, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Editor } from 'tinymce';
import {
  EDITOR_LANGUAGE_PAIRS,
  WIDGET_EDITOR_CONFIG,
} from '../../../../../const/tinymce.const';
import { Layout } from '../../../../../models/layout.model';
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
  @Input() form!: FormGroup;
  @Input() layout!: Layout;

  /** tinymce editor */
  public editor = WIDGET_EDITOR_CONFIG;

  /**
   * SafeTextEditorTabComponent constructor.
   *
   * @param environment Gets the environment to set the correct editor base_url.
   * @param translate Service used for translation.
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService
  ) {
    // Set the editor base url based on the environment file
    let url: string;
    if (environment.module === 'backoffice') {
      url = new URL(environment.backOfficeUri).pathname;
    } else {
      url = new URL(environment.frontOfficeUri).pathname;
    }
    if (url !== '/') {
      this.editor.base_url = url.slice(0, -1) + '/tinymce';
    } else {
      this.editor.base_url = '/tinymce';
    }
    // Set the editor language
    const lang = this.translate.currentLang;
    const editorLang = EDITOR_LANGUAGE_PAIRS.find((x) => x.key === lang);
    if (editorLang) {
      this.editor.language = editorLang.tinymceKey;
    } else {
      this.editor.language = 'en';
    }
  }

  ngOnChanges(): void {
    const dataKeys = getDataKeys(this.layout);
    const calcKeys = getCalcKeys();
    const keys = dataKeys.concat(calcKeys);

    /**
     * Setup tinymce editor
     *
     * @param editor tinymce editor
     */
    this.editor.setup = (editor: Editor) => {
      // autocompleter with @ for data and calc keys
      editor.ui.registry.addAutocompleter('keys_data_and_calc', {
        ch: '@',
        onAction: (autocompleteApi, rng, value) => {
          editor.selection.setRng(rng);
          editor.insertContent(value);
          autocompleteApi.hide();
        },
        fetch: async (pattern: string) =>
          keys
            .filter((key) => key.includes(pattern))
            .map((key) => ({ value: key, text: key })),
      });

      // autocompleter with = for calc keys
      // editor.ui.registry.addAutocompleter('keys_calc', {
      //   ch: '=',
      //   onAction: (autocompleteApi, rng, value) => {
      //     editor.selection.setRng(rng);
      //     editor.insertContent(value);
      //     autocompleteApi.hide();
      //   },
      //   fetch: async (pattern: string) =>
      //     calcKeys
      //       .filter((key) => key.includes(pattern))
      //       .map((key) => ({ value: key, text: key })),
      // });
    };
  }
}
