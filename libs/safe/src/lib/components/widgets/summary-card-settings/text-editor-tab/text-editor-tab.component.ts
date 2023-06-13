import { Apollo } from 'apollo-angular';
import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeEditorService } from '../../../../services/editor/editor.service';
import { WIDGET_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { getCalcKeys, getDataKeys } from '../../summary-card/parser/utils';

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
   * @param apollo Apollo service used to query the data
   * @param editorService Editor service used to get main URL and current language
   */
  constructor(
    private apollo: Apollo,
    private editorService: SafeEditorService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;

    this.editor.setup = (editor) => {
      editor.ui.registry.addIcon(
        'avatar-icon',
        '<svg width="24" height="24"><ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" cx="12.051" cy="8.44" rx="4.407" ry="4.457"></ellipse><ellipse style="fill: none; stroke: rgb(0, 0, 0);" cx="12" cy="12" ry="11" rx="11"></ellipse><path style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" d="M 3.859 19.172 C 4.12 10.79 20.414 11.589 20.143 19.122 C 20.141 19.179 3.857 19.247 3.859 19.172 Z"></path></svg>'
      );
      editor.ui.registry.addButton('avatar', {
        icon: 'avatar-icon',
        tooltip: 'Avatar',
        onAction: () => {
          editor.windowManager.open({
            title: 'Avatars', //TODO: Translate
            body: {
              type: 'panel',
              items: [
                {
                  type: 'input',
                  name: 'avatarsSource',
                  label: 'Source', //TODO: Translate
                },
                {
                  type: 'input',
                  name: 'avatarsMaxItems',
                  label: 'Max items', //TODO: Translate
                },
                {
                  type: 'bar',
                  items: [
                    {
                      type: 'input',
                      name: 'avatarsWidth',
                      label: 'Width', //TODO: Translate
                    },
                    {
                      type: 'input',
                      name: 'avatarsHeight',
                      label: 'Height', //TODO: Translate
                    },
                  ],
                },
              ],
            },
            initialData: {
              avatarsSource: '',
              avatarsMaxItems: '3',
              avatarsWidth: '24',
              avatarsHeight: '24',
            },
            onChange: (api, details) => {
              // validate the data types
              const data = api.getData();
              const submitDisabled = !(
                !isNaN(Number(data.avatarsHeight)) &&
                Number(data.avatarsHeight) > 0 &&
                !isNaN(Number(data.avatarsWidth)) &&
                Number(data.avatarsWidth) > 0 &&
                !isNaN(Number(data.avatarsMaxItems)) &&
                Number(data.avatarsMaxItems) > 0 &&
                data.avatarsSource.length > 0
              );
              if (submitDisabled) api.disable('submit');
              else api.enable('submit');
            },
            onSubmit: (api) => {
              const data = api.getData();
              const html = `{{avatars.${data.avatarsSource} ${data.avatarsWidth} ${data.avatarsHeight} ${data.avatarsMaxItems}}}`;
              editor.insertContent(html);
              api.close();
            },
            buttons: [
              {
                text: 'Close', //TODO: Translate
                type: 'cancel',
              },
              {
                text: 'Insert', //TODO: Translate
                type: 'submit',
                name: 'submit',
                primary: true,
                disabled: true,
              },
            ],
          });
        },
      });
    };
  }

  ngOnChanges(): void {
    const dataKeys = getDataKeys(this.fields);
    const calcKeys = getCalcKeys();
    const keys = dataKeys.concat(calcKeys);
    // Setup editor auto complete
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
  }
}
