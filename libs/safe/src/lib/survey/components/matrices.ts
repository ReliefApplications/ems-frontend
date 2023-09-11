import { JsonMetadata, QuestionFileModel, SurveyModel } from 'survey-angular';
import { Question } from '../types';
import * as Survey from 'survey-angular';
import * as SurveyCreator from 'survey-creator';
import { DomService } from '../../services/dom/dom.service';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

/**
 * Add support for custom properties to the survey
 *
 * @param Survey Survey library
 * @param domService
 */
export const init = (Survey: any, domService: DomService): void => {
  const serializer: JsonMetadata = Survey.Serializer;

  // Adds a dropdowm to the matrix section with all the questions in the form
  serializer.addProperty('matrix', {
    name: 'copyToOthers',
    category: 'rows',
    type: 'copyToOthers',
    // choices: ['test1', 'test2'],
    choices: (preForm: Survey.Model, choicesCallback: any) => {
      const form = preForm?.survey as SurveyModel;
      //return the page and question if type is matrix
      const questions = form.pages
        .map((page: Survey.PageModel) => {
          return page.questions.filter(
            (question: Survey.Question) => question.getType() === 'matrix'
          );
        })
        .flat()
        .map((question: Survey.Question) => {
          return `${question.page.name} > ${question.name}`;
        });
      choicesCallback(questions);
    },
  });

  const copyToOthers = {
    render: (editor: any, htmlElement: HTMLElement) => {
      const data = [
        'page1 > question1',
        'page1 > question2',
        'page2 > question1',
      ];
      const tagbox = domService.appendComponentToBody(
        MultiSelectComponent,
        htmlElement
      );
      const instance: MultiSelectComponent = tagbox.instance;
      instance.data = data;
      instance.value = editor.value;
      instance.valueChange.subscribe((res) => editor.onChanged(res));

      const btn = document.createElement('input');
      btn.type = 'button';
      btn.value = 'Copy';
      btn.className = 'svd-items-control-footer btn sv-btn btn-primary';
      htmlElement.appendChild(btn);
      btn.onclick = () => {
        // print the selected values
        console.log(instance.value);
      };
    },
  };

  SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
    'copyToOthers',
    copyToOthers
  );
};

/**
 * Render the other global properties
 *
 * @param question The question object
 */
export const render = (question: Question): void => {
  // define the max size for files
  if (question.getType() === 'file') {
    (question as QuestionFileModel).maxSize = 7340032;
  }
};
