import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { EditorService } from '../../../../services/editor/editor.service';
import { DataTemplateService } from '../../../../services/data-template/data-template.service';
import { RawEditorSettings } from 'tinymce';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

/**
 * Component used in the card-modal-settings for editing the content of the card.
 */
@Component({
  selector: 'shared-text-editor-tab',
  templateUrl: './text-editor-tab.component.html',
  styleUrls: ['./text-editor-tab.component.scss'],
})
export class TextEditorTabComponent
  extends UnsubscribeComponent
  implements OnChanges
{
  @Input() form!: UntypedFormGroup;
  @Input() fields: any[] = [];

  /** tinymce editor */
  public editor!: RawEditorSettings;
  private resourceForm?: Form;
  public resources: Resource[] = [];

  /**
   * TextEditorTabComponent constructor.
   *
   * @param editorService Editor service used to get main URL and current language
   * @param dataTemplateService Shared data template service
   * @param dialog Shared dialog service
   */
  constructor(
    private editorService: EditorService,
    private dataTemplateService: DataTemplateService,
    private dialog: Dialog
  ) {
    super();
    this.configEditor();
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url || '';
    // Set the editor language
    this.editor.language = editorService.language;
    this.dataTemplateService.setEditorLinkList(this.editor);
  }

  ngOnChanges(): void {
    // Setup editor auto complete
    console.log(this.fields);
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, [
      ...this.dataTemplateService.getAutoCompleterKeys(this.fields),
      ...this.dataTemplateService.getAutoCompleterPageKeys(),
    ]);
  }

  configEditor(): void {
    this.editor = {
      suffix: '.min',
      plugins:
        'preview paste importcss searchreplace autolink code visualblocks visualchars fullscreen image link media table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern help charmap quickbars emoticons',
      imagetools_cors_hosts: ['picsum.photos'],
      menubar: 'edit view insert format tools table help',
      toolbar:
        'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview save | insertfile image media link avatar aggregation',
      toolbar_sticky: true,
      image_advtab: true,
      importcss_append: true,
      height: 600,
      image_caption: true,
      quickbars_selection_toolbar:
        'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
      toolbar_mode: 'sliding',
      contextmenu: 'link image imagetools table',
      content_style:
        'body { font-family: Roboto, "Helvetica Neue", sans-serif; }',
      help_tabs: [
        'shortcuts', // the default shortcuts tab
        'keyboardnav', // the default keyboard navigation tab
      ],
      convert_urls: false,
      setup: (editor) => {
        editor.ui.registry.addIcon(
          'avatar-icon',
          '<svg width="24" height="24"><ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" cx="12.051" cy="8.44" rx="4.407" ry="4.457"></ellipse><ellipse style="fill: none; stroke: rgb(0, 0, 0);" cx="12" cy="12" ry="11" rx="11"></ellipse><path style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" d="M 3.859 19.172 C 4.12 10.79 20.414 11.589 20.143 19.122 C 20.141 19.179 3.857 19.247 3.859 19.172 Z"></path></svg>'
        );
        editor.ui.registry.addButton('avatar', {
          icon: 'avatar-icon',
          tooltip: 'Avatar',
          onAction: () => {
            editor.windowManager.open({
              title: 'Avatars',
              body: {
                type: 'panel',
                items: [
                  {
                    type: 'input',
                    name: 'avatarsSource',
                    label: 'Source',
                  },
                  {
                    type: 'input',
                    name: 'avatarsMaxItems',
                    label: 'Max items',
                  },
                  {
                    type: 'listbox',
                    name: 'shape',
                    label: 'Shape',
                    items: [
                      { text: 'Circle', value: 'circle' },
                      { text: 'Square', value: 'square' },
                    ],
                  },
                  {
                    type: 'bar',
                    items: [
                      {
                        type: 'input',
                        name: 'avatarsWidth',
                        label: 'Width',
                      },
                      {
                        type: 'input',
                        name: 'avatarsHeight',
                        label: 'Height',
                      },
                    ],
                  },
                ],
              },
              initialData: {
                avatarsSource: '',
                avatarsMaxItems: '3',
                shape: 'circle',
                avatarsWidth: '48',
                avatarsHeight: '48',
              },
              onChange: (api) => {
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
                const html = `{{avatars.${data.avatarsSource} ${data.shape} ${data.avatarsWidth} ${data.avatarsHeight} ${data.avatarsMaxItems}}}`;
                editor.insertContent(html);
                api.close();
              },
              buttons: [
                {
                  text: 'Close',
                  type: 'cancel',
                },
                {
                  text: 'Insert',
                  type: 'submit',
                  name: 'submit',
                  primary: true,
                  disabled: true,
                },
              ],
            });
          },
        });
        editor.ui.registry.addIcon(
          'aggregation-icon',
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>'
        );
        editor.ui.registry.addButton('aggregation', {
          icon: 'aggregation-icon',
          tooltip: 'Aggregation',
          onAction: async () => {
            const { AggregationSelectionModalComponent } = await import(
              '../../editor-settings/aggregation-selection-modal/aggregation-selection-modal.component'
            );
            const dialogRef = this.dialog.open(
              AggregationSelectionModalComponent
            );
            dialogRef.closed
              .pipe(takeUntil(this.destroy$))
              .subscribe((data: any) => {
                console.log(data);
                this.editorService.addCalcAndKeysAutoCompleter(this.editor, [
                  ...this.dataTemplateService.getAutoCompleterKeys(this.fields),
                  ...this.dataTemplateService.getAutoCompleterPageKeys(),
                  ...this.dataTemplateService.getAutoCompleteAggregation(
                    data.aggregation
                  ),
                ]);
              });
          },
        });
      },
    };
  }
}
