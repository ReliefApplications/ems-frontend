import { ComponentCollection, Serializer, SvgRegistry } from 'survey-core';
import { Question } from '../types';
import { DomService } from '../../services/dom/dom.service';
import { EditorQuestionComponent } from '../../components/editor-question/editor-question.component';
import { cloneDeep, isNil } from 'lodash';
import { Injector } from '@angular/core';
import { FIELD_EDITOR_CONFIG } from '../../const/tinymce.const';
import { EditorService } from '../../services/editor/editor.service';
import { CustomPropertyGridComponentTypes } from './utils/components.enum';

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
  const editorService = injector.get(EditorService);

  // Register icon
  SvgRegistry.registerIconFromSvg(
    'editor',
    '<svg class="feather feather-edit" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" height="18px" viewBox="0 0 24 24" width="18px" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
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
      Serializer.addProperty('editor', {
        name: 'tinymceConfig',
        type: CustomPropertyGridComponentTypes.jsonEditor,
        category: 'Editor configuration',
        visibleIndex: 1,
        default: JSON.stringify(cloneDeep(FIELD_EDITOR_CONFIG)),
      });
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
      instance.config = {
        ...JSON.parse(question.tinymceConfig),
        base_url: editorService.url,
        language: editorService.language,
        ...(question.survey.isDisplayMode && {
          toolbar: false,
          menubar: false,
        }),
      };
      instance.cdr.detectChanges();

      // Set readonly mode of instance based on readonly & survey mode
      instance.readonly =
        question.isReadOnly ||
        question.survey.isDesignMode ||
        question.survey.isDisplayMode;

      instance.editorLoaded.subscribe((value) => {
        if (!value) {
          return;
        }
        if (!question.value && question.defaultValue) {
          question.value = question.defaultValue;
        }
        if (question.value) {
          instance.editor.editor.writeValue(question.value);
        }

        instance.html.subscribe((html) => {
          if (isNil(html)) {
            return;
          }
          if (question.survey?.isDesignMode) {
            question.defaultValue = html;
          } else {
            question.value = html;
          }
        });
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
};
