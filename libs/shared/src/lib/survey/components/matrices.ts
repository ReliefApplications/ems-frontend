/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  // JsonMetadata,
  QuestionFileModel,
  SurveyModel,
  PageModel,
  // Serializer,
} from 'survey-core';
import { Question } from '../types';
import { DomService } from '../../services/dom/dom.service';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

/**
 * Add support for custom properties to the survey
 *
 * @param domService Dom service
 */
export const init = (domService: DomService): void => {
  //todo
  // @TODO: Update this code to work with new version of SurveyJS
  // const serializer: JsonMetadata = Serializer;
  // // Adds a dropdown to the matrix section with all the questions in the form
  // serializer.addProperty('matrix', {
  //   name: 'copyToOthers',
  //   category: 'rows',
  //   type: 'copyToOthers',
  // });
  // serializer.addProperty('matrixdropdown', {
  //   name: 'copyToOthers',
  //   category: 'rows',
  //   type: 'copyToOthers',
  // });
  // const copyToOthers = {
  //   render: (editor: any, htmlElement: HTMLElement) => {
  //     const data = getMatrix(
  //       editor.object,
  //       editor.object.selectedElementInDesign
  //     );
  //     const tagbox = domService.appendComponentToBody(
  //       MultiSelectComponent,
  //       htmlElement
  //     );
  //     const instance: MultiSelectComponent = tagbox.instance;
  //     instance.value = editor.value;
  //     instance.data = data;
  //     instance.valueChange.subscribe((res) => editor.onChanged(res));
  //     const btn = document.createElement('input');
  //     btn.type = 'button';
  //     btn.value = 'Copy';
  //     btn.className = 'svd-items-control-footer btn sv-btn btn-primary';
  //     htmlElement.appendChild(btn);
  //     btn.onclick = () => {
  //       updateListMatrix(
  //         editor.object.selectedElementInDesign as Question,
  //         instance,
  //         editor.object
  //       );
  //     };
  //   },
  // };
  // SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
  //   'copyToOthers',
  //   copyToOthers
  // );
};

/**
 *  Get all the matrix questions in the form
 *
 * @param preForm  The form
 * @param selectedMatrix  The matrix selected
 * @returns An array of all the matrix questions in the form
 */
function getMatrix(preForm: SurveyModel, selectedMatrix: Question): string[] {
  let questions: string[] = [];
  if (preForm && preForm.survey) {
    const form = preForm.survey as SurveyModel;
    questions = form.pages
      .map((page: PageModel) => {
        return page.questions.filter(
          (question: Question) =>
            question.getType() === selectedMatrix.getType() &&
            question !== selectedMatrix
        );
      })
      .flat()
      .map((question: Question) => {
        return `${question.page.name} > ${question.name}`;
      });
  }
  return questions;
}

/**
 *  Update the rows of the selected matrix
 *
 * @param selectedMatrix  The matrix selected
 * @param instance  The instance of the multiselect
 * @param editor  The editor
 */
function updateListMatrix(
  selectedMatrix: Question,
  instance: MultiSelectComponent,
  editor: SurveyModel
) {
  const selectedMatrices = instance.value;

  if (!selectedMatrices || selectedMatrices.length === 0) {
    return;
  }

  const survey = editor.survey as SurveyModel;

  survey.pages.forEach((page: PageModel) => {
    page.questions.forEach((question) => {
      if (
        question.getType() === selectedMatrix.getType() &&
        selectedMatrices.includes(`${page.name} > ${question.name}`)
      ) {
        question.rows = selectedMatrix.rows;
      }
    });
  });
}
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
