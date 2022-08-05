import {
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  EDITOR_LANGUAGE_PAIRS,
  WIDGET_EDITOR_CONFIG,
} from '../../../../../const/tinymce.const';

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

  @Input() record: any;

  /** tinymce editor */
  public editor: any = WIDGET_EDITOR_CONFIG;

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

  ngOnChanges(changes: SimpleChanges): void {
    const keys = this.getDataKeys(this.record);

    /**
     *
     * @param editor
     */
    this.editor.setup = (editor: any) => {
      /**
       *
       * @param autocompleteApi
       * @param rng
       * @param value
       */
      const onAction = (autocompleteApi: any, rng: any, value: any) => {
        editor.selection.setRng(rng);
        editor.insertContent(value);
        autocompleteApi.hide();
      };

      /**
       *
       * @param pattern
       */
      const getMatchedKeys = (pattern: any) =>
        keys.filter((key: any) => key.indexOf(pattern) !== -1);

      editor.ui.registry.addAutocompleter('specialchars_cardmenuitems', {
        ch: '@',
        minChars: 1,
        columns: 1,
        highlightOn: ['char_name'],
        onAction,
        fetch: (pattern: any) =>
          new Promise((resolve: any) => {
            const results = getMatchedKeys(pattern).map((key) => ({
              type: 'cardmenuitem',
              value: key,
              label: key,
              items: [
                {
                  type: 'cardcontainer',
                  direction: 'vertical',
                  items: [
                    {
                      type: 'cardtext',
                      text: key,
                      name: 'char_name',
                    },
                  ],
                },
              ],
            }));
            resolve(results);
          }),
      });
    };
  }

  /**
   * Returns an array with the record data keys.
   *
   * @param record Record object.
   */
  private getDataKeys(record: any): string[] {
    const fields: string[] = [];
    for (const [key, value] of Object.entries(record)) {
      if (!key.startsWith('__') && key !== 'form') {
        if (value instanceof Object) {
          for (const [key2] of Object.entries(value)) {
            if (!key2.startsWith('__')) {
              fields.push('@data.' + (key === 'data' ? '' : key + '.') + key2);
            }
          }
        } else {
          fields.push('@data.' + key);
        }
      }
    }
    return fields;
  }
}
