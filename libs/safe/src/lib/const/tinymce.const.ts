import { RawEditorSettings } from 'tinymce';

/** Language tinymce keys paired with the default ones */
export const EDITOR_LANGUAGE_PAIRS: { key: string; tinymceKey: string }[] = [
  {
    key: 'fr',
    tinymceKey: 'fr_FR',
  },
];

/** Widget Editor tinymce configuration. */
export const WIDGET_EDITOR_CONFIG: RawEditorSettings = {
  suffix: '.min',
  plugins:
    'preview paste importcss searchreplace autolink code visualblocks visualchars fullscreen image link media table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern help charmap quickbars emoticons',
  imagetools_cors_hosts: ['picsum.photos'],
  menubar: 'edit view insert format tools table help',
  toolbar:
    'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview save | insertfile image media link avatar',
  toolbar_sticky: true,
  image_advtab: true,
  importcss_append: true,
  height: 600,
  image_caption: true,
  quickbars_selection_toolbar:
    'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  toolbar_mode: 'sliding',
  contextmenu: 'link image imagetools table',
  content_style: 'body { font-family: Roboto, "Helvetica Neue", sans-serif; }',
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
  },
};

/** Email Editor tinymce configuration. */
export const EMAIL_EDITOR_CONFIG: RawEditorSettings = {
  suffix: '.min',
  plugins:
    'preview paste importcss searchreplace autolink code visualblocks visualchars fullscreen image link media table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern help charmap quickbars emoticons',
  // imagetools_cors_hosts: ['picsum.photos'],
  menubar: 'edit view insert format tools table help',
  toolbar:
    'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview save | insertfile image media link',
  toolbar_sticky: true,
  image_advtab: true,
  importcss_append: true,
  height: 600,
  image_caption: true,
  quickbars_insert_toolbar: 'image quicktable',
  quickbars_selection_toolbar:
    'bold italic | quicklink h2 h3 blockquote quicktable',
  toolbar_mode: 'sliding',
  contextmenu: 'link image imagetools table',
  content_style: 'body { font-family: Roboto, "Helvetica Neue", sans-serif; }',
  file_browser_callback: false, // removes possibility to upload files
  help_tabs: [
    'shortcuts', // the default shortcuts tab
    'keyboardnav', // the default keyboard navigation tab
  ],
  convert_urls: false,
};

/** Field Editor tinymce configuration. */
export const FIELD_EDITOR_CONFIG: RawEditorSettings = {
  suffix: '.min',
  plugins: '',
  imagetools_cors_hosts: ['picsum.photos'],
  menubar: false,
  toolbar: false,
  importcss_append: true,
  height: 90,
  quickbars_selection_toolbar: '',
  content_style: 'body { font-family: Roboto, "Helvetica Neue", sans-serif; }',
  help_tabs: [
    'shortcuts', // the default shortcuts tab
    'keyboardnav', // the default keyboard navigation tab
  ],
};

/** Popup Editor tinymce configuration. */
export const POPUP_EDITOR_CONFIG: RawEditorSettings = {
  suffix: '.min',
  plugins:
    'preview paste importcss searchreplace autolink code visualblocks visualchars fullscreen image link media table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern help charmap quickbars emoticons',
  // imagetools_cors_hosts: ['picsum.photos'],
  menubar: 'edit view insert format tools table help',
  toolbar:
    'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview save | insertfile image media link',
  toolbar_sticky: true,
  image_advtab: true,
  importcss_append: true,
  height: 600,
  image_caption: true,
  quickbars_insert_toolbar: 'image quicktable',
  quickbars_selection_toolbar:
    'bold italic | quicklink h2 h3 blockquote quicktable',
  toolbar_mode: 'sliding',
  contextmenu: 'link image imagetools table',
  content_style: 'body { font-family: Roboto, "Helvetica Neue", sans-serif; }',
  file_browser_callback: false, // removes possibility to upload files
  help_tabs: [
    'shortcuts', // the default shortcuts tab
    'keyboardnav', // the default keyboard navigation tab
  ],
};

/** Inline Editor tinymce configuration. */
export const INLINE_EDITOR_CONFIG: RawEditorSettings = {
  menubar: false,
  inline: true,
  toolbar: '',
  plugins: '',
  height: 50,
  content_style: 'p { margin: 0 !important; }',
};
