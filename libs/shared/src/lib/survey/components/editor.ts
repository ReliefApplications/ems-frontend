import { ComponentCollection, Serializer, SvgRegistry } from 'survey-core';
import { Question } from '../types';
import { DomService } from '../../services/dom/dom.service';
import { EditorQuestionComponent } from '../../components/editor-question/editor-question.component';
import { isNil } from 'lodash';
import { Injector, NgZone } from '@angular/core';
import { AZURE_SUPPORTED_LANGUAGES } from '../constants/azure-languages.const';
import { TRANSLATE_SOURCE_QUESTION_TYPE } from '../property-editors/translate-source-question.editor';

/**
 * Inits the editor component.
 *
 * @param injector Parent instance angular injector containing all needed services and directives
 * @param componentCollectionInstance ComponentCollection
 */
export const init = (
  injector: Injector,
  componentCollectionInstance: ComponentCollection
): void => {
  // get services
  const domService = injector.get(DomService);
  const ngZone = injector.get(NgZone);

  // Register icon
  SvgRegistry.registerIconFromSvg(
    'editor',
    '<svg viewBox="0 -960 960 960"><path d="M200-120q-33 0-56.500-23.500T120-200v-560q0-33 23.500-56.500T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.500 56.500T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.500 6t26.500 18l56 57q11 12 17 26.500t6 29.500q0 15-5.500 29.500T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg>'
  );
  const component = {
    name: 'editor',
    title: 'Editor',
    iconName: 'icon-editor',
    questionJSON: {
      name: 'editor',
      type: 'text',
    },
    category: 'Custom Questions',
    onInit: (): void => {
      return;
    },
    onAfterRender: (question: Question, el: HTMLElement): void => {
      // hides the input element
      const element = el.getElementsByTagName('input')[0].parentElement;
      if (element) element.style.display = 'none';

      // if (question.survey.isDisplayMode) {
      //   const editor = domService.appendComponentToBody(
      //     HtmlWidgetContentComponent,
      //     el
      //   );
      //   const instance: HtmlWidgetContentComponent = editor.instance;
      //   instance.html = dataTemplateService.renderHtml(question.value);
      //   return;
      // }
      const editor = domService.appendComponentToBody(
        EditorQuestionComponent,
        el
      );
      const instance: EditorQuestionComponent = editor.instance;

      // Set readonly mode of instance based on readonly & survey mode
      instance.readonly =
        question.isReadOnly ||
        question.survey.isDesignMode ||
        question.survey.isDisplayMode;

      instance.displayMode = question.survey.isDisplayMode;

      instance.editorLoaded.subscribe((value) => {
        if (!value) {
          return;
        }
        // todo: check
        if (!question.value && question.defaultValueExpression) {
          question.value = question.defaultValueExpression;
        }
        if (question.value) {
          instance.editor.editor.writeValue(question.value);
        }

        instance.html.subscribe((html) => {
          if (isNil(html)) {
            return;
          }
          if (question.survey?.isDesignMode) {
            question.defaultValueExpression = html;
          } else {
            question.value = html;
          }
        });

        // Sync value updates from the survey model back into the editor (e.g.
        // values written by auto-translation). Without this, a translated
        // value set via survey.setValue() never reaches the TinyMCE instance.
        question.registerFunctionOnPropertyValueChanged(
          'value',
          (newValue: any) => {
            ngZone.run(() => {
              const tinyEditor = instance.editor?.editor?.editor;
              if (!tinyEditor) {
                return;
              }
              // If the editor has focus the user is typing, so do not
              // overwrite content to avoid cursor jumps.
              if (tinyEditor.hasFocus()) {
                return;
              }
              const currentEditorHtml = tinyEditor.getContent() || '';
              const targetValue = newValue || '';
              if (currentEditorHtml !== targetValue) {
                instance.editor.editor.writeValue(targetValue);
              }
            });
          },
          question.name + '_value_sync'
        );
      });

      // Only activate listener on readonly if outside of form builder
      if (!question.survey.isDesignMode) {
        question.registerFunctionOnPropertyValueChanged(
          'readOnly',
          (value: boolean) => {
            instance.readonly = value;
          }
        );
      }
    },
  };
  componentCollectionInstance.add(component);

  // Register translation properties for custom editor component
  Serializer.addProperty('editor', {
    name: 'translateField',
    type: TRANSLATE_SOURCE_QUESTION_TYPE,
    category: 'translation',
    visibleIndex: 1,
    displayName: 'Translate from question',
  });
  Serializer.addProperty('editor', {
    name: 'translateTo',
    type: 'string',
    category: 'translation',
    visibleIndex: 2,
    displayName: 'Language to translate to',
    visibleIf: (obj: any) => !!obj?.getPropertyValue('translateField'),
    choices: AZURE_SUPPORTED_LANGUAGES,
  });
  Serializer.addProperty('editor', {
    name: 'translateIf:condition',
    category: 'logic',
    visibleIndex: 10,
    displayName: 'Translate if',
    visibleIf: (obj: any) =>
      !!obj?.getPropertyValue('translateField') &&
      !!obj?.getPropertyValue('translateTo'),
  });
};
