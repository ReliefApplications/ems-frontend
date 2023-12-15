import { RawEditorSettings } from 'tinymce';
import { createFontAwesomeIcon } from '../components/ui/map/utils/create-div-icon';

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
    'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview save | insertfile image media link avatar recordeditor',
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
  extended_valid_elements:
    'a[*],altGlyph[*],altGlyphDef[*],altGlyphItem[*],animate[*],animateMotion[*],animateTransform[*],circle[*],clipPath[*],color-profile[*],cursor[*],defs[*],desc[*],ellipse[*],feBlend[*],feColorMatrix[*],feComponentTransfer[*],feComposite[*],feConvolveMatrix[*],feDiffuseLighting[*],feDisplacementMap[*],feDistantLight[*],feFlood[*],feFuncA[*],feFuncB[*],feFuncG[*],feFuncR[*],feGaussianBlur[*],feImage[*],feMerge[*],feMergeNode[*],feMorphology[*],feOffset[*],fePointLight[*],feSpecularLighting[*],feSpotLight[*],feTile[*],feTurbulence[*],filter[*],font[*],font-face[*],font-face-format[*],font-face-name[*],font-face-src[*],font-face-uri[*],foreignObject[*],g[*],glyph[*],glyphRef[*],hkern[*],image[*],line[*],linearGradient[*],marker[*],mask[*],metadata[*],missing-glyph[*],mpath[*],path[*],pattern[*],polygon[*],polyline[*],radialGradient[*],rect[*],script[*],set[*],stop[*],style[*],svg[*],switch[*],symbol[*],text[*],textPath[*],title[*],tref[*],tspan[*],use[*],view[*],vkern[*],a[*],animate[*],animateMotion[*],animateTransform[*],circle[*],clipPath[*],defs[*],desc[*],discard[*],ellipse[*],feBlend[*],feColorMatrix[*],feComponentTransfer[*],feComposite[*],feConvolveMatrix[*],feDiffuseLighting[*],feDisplacementMap[*],feDistantLight[*],feDropShadow[*],feFlood[*],feFuncA[*],feFuncB[*],feFuncG[*],feFuncR[*],feGaussianBlur[*],feImage[*],feMerge[*],feMergeNode[*],feMorphology[*],feOffset[*],fePointLight[*],feSpecularLighting[*],feSpotLight[*],feTile[*],feTurbulence[*],filter[*],foreignObject[*],g[*],hatch[*],hatchpath[*],image[*],line[*],linearGradient[*],marker[*],mask[*],metadata[*],mpath[*],path[*],pattern[*],polygon[*],polyline[*],radialGradient[*],rect[*],script[*],set[*],stop[*],style[*],svg[*],switch[*],symbol[*],text[*],textPath[*],title[*],tspan[*],use[*],view[*],g[*],animate[*],animateColor[*],animateMotion[*],animateTransform[*],discard[*],mpath[*],set[*],circle[*],ellipse[*],line[*],polygon[*],polyline[*],rect[*],a[*],defs[*],g[*],marker[*],mask[*],missing-glyph[*],pattern[*],svg[*],switch[*],symbol[*],desc[*],metadata[*],title[*],feBlend[*],feColorMatrix[*],feComponentTransfer[*],feComposite[*],feConvolveMatrix[*],feDiffuseLighting[*],feDisplacementMap[*],feDropShadow[*],feFlood[*],feFuncA[*],feFuncB[*],feFuncG[*],feFuncR[*],feGaussianBlur[*],feImage[*],feMerge[*],feMergeNode[*],feMorphology[*],feOffset[*],feSpecularLighting[*],feTile[*],feTurbulence[*],font[*],font-face[*],font-face-format[*],font-face-name[*],font-face-src[*],font-face-uri[*],hkern[*],vkern[*],linearGradient[*],radialGradient[*],stop[*],circle[*],ellipse[*],image[*],line[*],path[*],polygon[*],polyline[*],rect[*],text[*],use[*],use[*],feDistantLight[*],fePointLight[*],feSpotLight[*],clipPath[*],defs[*],hatch[*],linearGradient[*],marker[*],mask[*],metadata[*],pattern[*],radialGradient[*],script[*],style[*],symbol[*],title[*],hatch[*],linearGradient[*],pattern[*],radialGradient[*],solidcolor[*],a[*],circle[*],ellipse[*],foreignObject[*],g[*],image[*],line[*],path[*],polygon[*],polyline[*],rect[*],svg[*],switch[*],symbol[*],text[*],textPath[*],tspan[*],use[*],g[*],circle[*],ellipse[*],line[*],path[*],polygon[*],polyline[*],rect[*],defs[*],g[*],svg[*],symbol[*],use[*],altGlyph[*],altGlyphDef[*],altGlyphItem[*],glyph[*],glyphRef[*],textPath[*],text[*],tref[*],tspan[*],altGlyph[*],textPath[*],tref[*],tspan[*],clipPath[*],cursor[*],filter[*],foreignObject[*],hatchpath[*],script[*],style[*],view[*],altGlyph[*],altGlyphDef[*],altGlyphItem[*],animateColor[*],cursor[*],font[*],font-face[*],font-face-format[*],font-face-name[*],font-face-src[*],font-face-uri[*],glyph[*],glyphRef[*],hkern[*],missing-glyph[*],tref[*],vkern[*]',
  convert_urls: false,
  setup: (editor) => {
    // Record edition
    const iconEdit = createFontAwesomeIcon(
      {
        icon: 'edit',
        color: 'none',
        opacity: 1,
        size: 21,
      },
      (editor.editorManager as any).DOM.doc
    );
    editor.ui.registry.addIcon('record-icon', iconEdit.innerHTML);
    editor.ui.registry.addButton('recordeditor', {
      icon: 'record-icon',
      tooltip: 'Edit record',
      onAction: async () => {
        const iconEdit = createFontAwesomeIcon(
          {
            icon: 'edit',
            color: '#000000',
            opacity: 1,
            size: 21,
          },
          (editor.editorManager as any).DOM.doc
        );
        const iconButton = (editor.editorManager as any).DOM.doc.createElement(
          'button'
        );
        iconButton.innerHTML = iconEdit?.innerHTML;
        iconButton.style.border = '0';
        iconButton.style.padding = '0';
        iconButton.classList.add('record-editor');
        const set = `${iconButton?.outerHTML}&nbsp;`;
        editor.insertContent(set);
      },
    });
    // Avatar
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
    // Context filter
    const iconFilter = createFontAwesomeIcon(
      {
        icon: 'filter',
        color: 'none',
        opacity: 1,
        size: 21,
      },
      (editor.editorManager as any).DOM.doc
    );

    editor.ui.registry.addIcon('filter-icon', iconFilter.innerHTML);
    editor.ui.registry.addButton('contextfilter', {
      icon: 'filter-icon',
      tooltip: 'Add context filter',
      onAction: async () => {
        editor.windowManager.open({
          title: 'Set context filter',
          body: {
            type: 'panel',
            items: [
              {
                type: 'input',
                name: 'filterField',
                label: 'Filter field',
              },
              {
                type: 'input',
                name: 'filterValue',
                label: 'Filter value',
                placeholder:
                  'Fixed value or {{data.}} syntax, e.g. {{data.name}}',
              },
            ],
          },
          initialData: {
            filterField: '',
            filterValue: editor.selection.getContent(),
          },
          onChange: (api) => {
            // validate the data type
            const data = api.getData();
            const submitDisabled = !(data.filterField.length > 0);
            if (submitDisabled) {
              api.disable('submit');
            } else {
              api.enable('submit');
            }
          },
          onSubmit: (api) => {
            const data = api.getData();
            const textElement = editor.selection.getNode();
            textElement.setAttribute('data-filter-field', data.filterField);
            textElement.setAttribute('data-filter-value', data.filterValue);
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
    editor.ui.registry.addContextToolbar('contextfilter', {
      predicate: () => editor.selection.getContent()?.length > 0,
      scope: 'node',
      position: 'selection',
      items: 'contextfilter',
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
