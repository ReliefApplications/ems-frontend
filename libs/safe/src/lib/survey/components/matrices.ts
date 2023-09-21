import {
  JsonMetadata,
  QuestionFileModel,
  SurveyModel,
  PageModel,
} from 'survey-angular';
import { Question } from '../types';
import * as SurveyCreator from 'survey-creator';
import { DomService } from '../../services/dom/dom.service';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

/**
 * Add support for custom properties to the survey
 *
 * @param Survey Survey library
 * @param domService Dom service
 */
export const init = (Survey: any, domService: DomService): void => {
  const serializer: JsonMetadata = Survey.Serializer;
  // Adds a dropdown to the matrix section with all the questions in the form
  serializer.addProperty('matrix', {
    name: 'copyToOthers:dropdown',
    category: 'rows',
    choices: (preForm: SurveyModel, choicesCallback: any) => {
      if (preForm && preForm.survey) {
        const form = preForm.survey as SurveyModel;
        const questions = form.pages
          .map((page: PageModel) => {
            return page.questions.filter(
              (question: Question) => question.getType() === 'matrix'
            );
          })
          .flat()
          .map((question: Question) => {
            return `${question.page.name} > ${question.name}`;
          });
        choicesCallback(questions);
      }
    },
  });
  const copyToOthers = {
    render: async (editor: any, htmlElement: HTMLElement) => {
      // Aqui estamos chamando a função choices e usando o retorno para preencher o vetor data
      const data = await serializer.getProperty('matrix', 'copyToOthers')
        .choices;
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
