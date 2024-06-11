import { ComponentCollection, SvgRegistry } from 'survey-core';
import { Question } from '../types';
import { DomService } from '../../services/dom/dom.service';
import { EditorQuestionComponent } from '../../components/editor-question/editor-question.component';
import { isNil } from 'lodash';
import { HtmlWidgetContentComponent } from '../../components/widgets/common/html-widget-content/html-widget-content.component';

/**
 * Inits the editor component.
 *
 * @param domService DOM service.
 * @param componentCollectionInstance ComponentCollection
 */
export const init = (
  domService: DomService,
  componentCollectionInstance: ComponentCollection
): void => {
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
      return;
    },
    onAfterRender: (question: Question, el: HTMLElement): void => {
      // hides the input element
      const element = el.getElementsByTagName('input')[0].parentElement;
      if (element) element.style.display = 'none';

      if (question.survey.isDisplayMode) {
        const editor = domService.appendComponentToBody(
          HtmlWidgetContentComponent,
          el
        );
        const instance: HtmlWidgetContentComponent = editor.instance;
        instance.html = question.value;
        return;
      }
      const editor = domService.appendComponentToBody(
        EditorQuestionComponent,
        el
      );
      const instance: EditorQuestionComponent = editor.instance;

      instance.editorLoaded.subscribe((value) => {
        if (!value) {
          return;
        }
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
      });
    },
  };
  componentCollectionInstance.add(component);
};
