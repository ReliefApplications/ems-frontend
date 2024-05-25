/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  JsonMetadata,
  QuestionFileModel,
  SurveyModel,
  PageModel,
  Serializer,
  ItemValue,
  surveyLocalization,
  QuestionMatrixDropdownModel,
} from 'survey-core';
import { SurveyQuestionEditorDefinition } from 'survey-creator-core';
import {
  CustomMatrixDropdownColumn,
  Question,
  QuestionSelectBase,
} from '../types';
import { DomService } from '../../services/dom/dom.service';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { CustomPropertyGridComponentTypes } from './utils/components.enum';
import { ReferenceDataService } from '../../services/reference-data/reference-data.service';
import { isSelectQuestion } from '../global-properties/reference-data';

/**
 * Add support for custom properties to the survey
 *
 * @param domService Dom service
 * @param referenceDataService Reference data service
 */
export const init = (
  domService: DomService,
  referenceDataService: ReferenceDataService
): void => {
  // @TODO: Update this code to work with new version of SurveyJS
  const serializer: JsonMetadata = Serializer;
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

  // Custom property to columns edition: reference data
  serializer.addProperty('matrixdropdowncolumn', {
    name: 'referenceData',
    showMode: 'form',
    category: 'Choices from Reference data',
    type: CustomPropertyGridComponentTypes.referenceDataDropdown,
    visibleIndex: 1,
    onSetValue: (obj: CustomMatrixDropdownColumn, value: string) => {
      obj.setPropertyValue('referenceData', value);
    },
  });

  serializer.addProperty('matrixdropdowncolumn', {
    displayName: 'Display field',
    showMode: 'form',
    name: 'referenceDataDisplayField',
    category: 'Choices from Reference data',
    isRequired: true,
    dependsOn: 'referenceData',
    visibleIf: (obj: null | CustomMatrixDropdownColumn): boolean =>
      Boolean(obj?.referenceData),
    visibleIndex: 2,
    choices: (
      obj: null | CustomMatrixDropdownColumn,
      choicesCallback: (choices: any[]) => void
    ) => {
      if (obj?.referenceData) {
        referenceDataService
          .loadReferenceData(obj.referenceData)
          .then((referenceData) =>
            choicesCallback(
              referenceData.fields?.map((x) => x?.name ?? x) || []
            )
          );
      }
    },
  });

  serializer.addProperty('matrixdropdowncolumn', {
    displayName: 'Is primitive value',
    showMode: 'form',
    name: 'isPrimitiveValue',
    type: 'boolean',
    category: 'Choices from Reference data',
    dependsOn: 'referenceData',
    visibleIf: (obj: null | CustomMatrixDropdownColumn): boolean =>
      Boolean(obj?.referenceData),
    visibleIndex: 3,
    default: true,
  });

  serializer.addProperty('matrixdropdowncolumn', {
    displayName: 'Filter from question',
    showMode: 'form',
    name: 'referenceDataFilterFilterFromQuestion',
    type: 'dropdown',
    category: 'Choices from Reference data',
    dependsOn: 'referenceData',
    visibleIf: (obj: null | CustomMatrixDropdownColumn): boolean =>
      Boolean(obj?.referenceData),
    visibleIndex: 3,
    choices: (
      obj: null | QuestionMatrixDropdownModel,
      choicesCallback: (choices: any[]) => void
    ) => {
      const defaultOption = new ItemValue(
        '',
        surveyLocalization.getString('pe.conditionSelectQuestion')
      );
      const survey = obj?.survey as SurveyModel;
      if (!survey) return choicesCallback([defaultOption]);
      const questions = survey
        .getAllQuestions()
        .filter((question) => isSelectQuestion(question) && question !== obj)
        .map((question) => question as QuestionSelectBase)
        .filter((question) => question.referenceData);
      const qItems = questions.map((q) => {
        const text = q.locTitle.renderedHtml || q.name;
        return new ItemValue(q.name, text);
      });
      qItems.sort((el1, el2) => el1.text.localeCompare(el2.text));
      qItems.unshift(defaultOption);
      choicesCallback(qItems);
    },
  });

  serializer.addProperty('matrixdropdowncolumn', {
    displayName: 'Foreign field',
    showMode: 'form',
    name: 'referenceDataFilterForeignField',
    category: 'Choices from Reference data',
    isRequired: true,
    dependsOn: 'referenceDataFilterFilterFromQuestion',
    visibleIf: (obj: null | CustomMatrixDropdownColumn): boolean =>
      Boolean(obj?.referenceDataFilterFilterFromQuestion),
    visibleIndex: 4,
    choices: (
      obj: null | Question,
      choicesCallback: (choices: any[]) => void
    ) => {
      if (obj?.referenceDataFilterFilterFromQuestion) {
        const foreignQuestion = (obj.survey as SurveyModel)
          .getAllQuestions()
          .find((q) => q.name === obj.referenceDataFilterFilterFromQuestion) as
          | QuestionSelectBase
          | undefined;
        if (foreignQuestion?.referenceData) {
          referenceDataService
            .loadReferenceData(foreignQuestion.referenceData)
            .then((referenceData) =>
              choicesCallback(
                referenceData.fields?.map((x) => x?.name ?? x) || []
              )
            );
        }
      }
    },
  });

  serializer.addProperty('matrixdropdowncolumn', {
    displayName: 'Filter condition',
    showMode: 'form',
    name: 'referenceDataFilterFilterCondition',
    category: 'Choices from Reference data',
    isRequired: true,
    dependsOn: 'referenceDataFilterFilterFromQuestion',
    visibleIf: (obj: null | CustomMatrixDropdownColumn): boolean =>
      Boolean(obj?.referenceDataFilterFilterFromQuestion),
    visibleIndex: 5,
    choices: [
      { value: 'eq', text: '==' },
      { value: 'neq', text: '!=' },
      { value: 'gte', text: '>=' },
      { value: 'gt', text: '>' },
      { value: 'lte', text: '<=' },
      { value: 'lt', text: '<' },
      { value: 'contains', text: 'contains' },
      { value: 'doesnotcontain', text: 'does not contain' },
      { value: 'iscontained', text: 'is contained in' },
      { value: 'isnotcontained', text: 'is not contained in' },
    ],
  });

  serializer.addProperty('matrixdropdowncolumn', {
    displayName: 'Local field',
    showMode: 'form',
    name: 'referenceDataFilterLocalField',
    category: 'Choices from Reference data',
    isRequired: true,
    dependsOn: 'referenceDataFilterFilterFromQuestion',
    visibleIf: (obj: null | CustomMatrixDropdownColumn): boolean =>
      Boolean(obj?.referenceDataFilterFilterFromQuestion),
    visibleIndex: 6,
    choices: (
      obj: null | CustomMatrixDropdownColumn,
      choicesCallback: (choices: any[]) => void
    ) => {
      if (obj?.referenceData) {
        referenceDataService
          .loadReferenceData(obj.referenceData)
          .then((referenceData) =>
            choicesCallback(
              referenceData.fields?.map((x) => x?.name ?? x) || []
            )
          );
      }
    },
  });

  SurveyQuestionEditorDefinition.definition[
    'matrixdropdowncolumn'
  ].properties?.push('referenceData');
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
