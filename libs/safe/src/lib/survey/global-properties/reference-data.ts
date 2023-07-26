import * as SurveyCreator from 'survey-creator';
import {
  JsonMetadata,
  SurveyModel,
  Serializer,
  ItemValue,
} from 'survey-angular';
import { DomService } from '../../services/dom/dom.service';
import { SafeReferenceDataService } from '../../services/reference-data/reference-data.service';
import { SafeReferenceDataDropdownComponent } from '../../components/reference-data-dropdown/reference-data-dropdown.component';
import { Question, QuestionSelectBase } from '../types';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

/**
 * Check if a question is of select type
 *
 * @param question The question to check
 * @returns A boolean indicating if the question is a select type
 */
const isSelectQuestion = (question: Question): boolean =>
  Serializer.isDescendantOf(question.getType(), 'selectbase');

/**
 * Add support for custom properties to the survey
 *
 * @param Survey Survey library
 * @param domService Dom service.
 * @param referenceDataService Reference data service
 */
export const init = (
  Survey: any,
  domService: DomService,
  referenceDataService: SafeReferenceDataService
): void => {
  // declare the serializer
  const serializer: JsonMetadata = Survey.Serializer;

  for (const type of ['tagbox', 'dropdown']) {
    // add properties
    serializer.addProperty(type, {
      name: 'referenceData',
      category: 'Choices from Reference data',
      type: 'referenceDataDropdown',
      visibleIndex: 1,
    });

    serializer.addProperty(type, {
      displayName: 'Display field',
      name: 'referenceDataDisplayField',
      category: 'Choices from Reference data',
      required: true,
      dependsOn: 'referenceData',
      visibleIf: (obj: null | QuestionSelectBase): boolean =>
        Boolean(obj?.referenceData),
      visibleIndex: 2,
      choices: (
        obj: null | QuestionSelectBase,
        choicesCallback: (choices: any[]) => void
      ) => {
        if (obj?.referenceData) {
          referenceDataService
            .loadReferenceData(obj.referenceData)
            .then((referenceData) =>
              choicesCallback(referenceData.fields?.map((x) => x.name) || [])
            );
        }
      },
    });

    serializer.addProperty(type, {
      displayName: 'Filter from question',
      name: 'referenceDataFilterFilterFromQuestion',
      type: 'dropdown',
      category: 'Choices from Reference data',
      dependsOn: 'referenceData',
      visibleIf: (obj: null | QuestionSelectBase): boolean =>
        Boolean(obj?.referenceData),
      visibleIndex: 3,
      choices: (
        obj: null | QuestionSelectBase,
        choicesCallback: (choices: any[]) => void
      ) => {
        const defaultOption = new Survey.ItemValue(
          '',
          SurveyCreator.localization.getString('pe.conditionSelectQuestion')
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
          return new Survey.ItemValue(q.name, text);
        });
        qItems.sort((el1, el2) => el1.text.localeCompare(el2.text));
        qItems.unshift(defaultOption);
        choicesCallback(qItems);
      },
    });

    serializer.addProperty(type, {
      displayName: 'Foreign field',
      name: 'referenceDataFilterForeignField',
      category: 'Choices from Reference data',
      required: true,
      dependsOn: 'referenceDataFilterFilterFromQuestion',
      visibleIf: (obj: null | QuestionSelectBase): boolean =>
        Boolean(obj?.referenceDataFilterFilterFromQuestion),
      visibleIndex: 4,
      choices: (
        obj: null | QuestionSelectBase,
        choicesCallback: (choices: any[]) => void
      ) => {
        if (obj?.referenceDataFilterFilterFromQuestion) {
          const foreignQuestion = (obj.survey as SurveyModel)
            .getAllQuestions()
            .find(
              (q) => q.name === obj.referenceDataFilterFilterFromQuestion
            ) as QuestionSelectBase | undefined;
          if (foreignQuestion?.referenceData) {
            referenceDataService
              .loadReferenceData(foreignQuestion.referenceData)
              .then((referenceData) =>
                choicesCallback((referenceData.fields || []).map((x) => x.name))
              );
          }
        }
      },
    });

    serializer.addProperty(type, {
      displayName: 'Filter condition',
      name: 'referenceDataFilterFilterCondition',
      category: 'Choices from Reference data',
      required: true,
      dependsOn: 'referenceDataFilterFilterFromQuestion',
      visibleIf: (obj: null | QuestionSelectBase): boolean =>
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

    serializer.addProperty(type, {
      displayName: 'Local field',
      name: 'referenceDataFilterLocalField',
      category: 'Choices from Reference data',
      required: true,
      dependsOn: 'referenceDataFilterFilterFromQuestion',
      visibleIf: (obj: null | QuestionSelectBase): boolean =>
        Boolean(obj?.referenceDataFilterFilterFromQuestion),
      visibleIndex: 6,
      choices: (
        obj: null | QuestionSelectBase,
        choicesCallback: (choices: any[]) => void
      ) => {
        if (obj?.referenceData) {
          referenceDataService
            .loadReferenceData(obj.referenceData)
            .then((referenceData) =>
              choicesCallback((referenceData.fields || []).map((x) => x.name))
            );
        }
      },
    });
  }

  // custom editor for the reference data dropdown
  const referenceDataEditor = {
    render: (editor: any, htmlElement: HTMLElement) => {
      const question = editor.object as QuestionSelectBase;
      const dropdown = domService.appendComponentToBody(
        SafeReferenceDataDropdownComponent,
        htmlElement
      );
      const instance: SafeReferenceDataDropdownComponent = dropdown.instance;
      instance.referenceData = question.referenceData || '';
      instance.choice.subscribe((res) => editor.onChanged(res));
    },
  };
  SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
    'referenceDataDropdown',
    referenceDataEditor
  );
};

/**
 * Render the custom properties
 *
 * @param questionElement The question element
 * @param referenceDataService The reference data service
 */
export const render = (
  questionElement: Question,
  referenceDataService: SafeReferenceDataService
): void => {
  if (isSelectQuestion(questionElement)) {
    const question = questionElement as QuestionSelectBase;

    const updateChoices = () => {
      if (question.referenceData && question.referenceDataDisplayField) {
        let filter;
        // create a filter object if all required properties for filtering are set
        if (
          question.referenceDataFilterFilterFromQuestion &&
          question.referenceDataFilterForeignField &&
          question.referenceDataFilterFilterCondition &&
          question.referenceDataFilterLocalField
        ) {
          const foreign = (question.survey as SurveyModel)
            .getAllQuestions()
            .find(
              (x: any) =>
                x.name === question.referenceDataFilterFilterFromQuestion
            ) as QuestionSelectBase;
          if (foreign.referenceData && !!foreign.value) {
            filter = {
              foreignReferenceData: foreign.referenceData,
              foreignField: question.referenceDataFilterForeignField,
              foreignValue: foreign.value,
              localField: question.referenceDataFilterLocalField,
              operator: question.referenceDataFilterFilterCondition,
            };
          }
        }
        referenceDataService
          .getChoices(
            question.referenceData,
            question.referenceDataDisplayField,
            filter
          )
          .then((choices) => {
            question.choices = [];
            // this is to avoid that the choices appear on the 'choices' tab
            question.setPropertyValue(
              'visibleChoices',
              choices.map((choice) => new ItemValue(choice))
            );
          });
      } else {
        question.choices = [];
      }
    };

    // Adds a behaviour subject and subscribes to it so we can redo the query when we get a new searchValue
    question.currentSearchValue = new BehaviorSubject<string>('');
    question.currentSearchValue
      .pipe(distinctUntilChanged())
      .subscribe((searchValue: string) => {
        if (searchValue !== undefined && searchValue !== null) {
          if (question.referenceData) {
            // TODO: make referenceDataService.cacheItems work with searchValue as a query filter
            //
            // referenceDataService
            //   .cacheItems(question.referenceData, searchValue)
            //   .then(() => {
            //     updateChoices();
            //   });
          }
        }
      });

    if (question.referenceData) {
      if (question.value) {
        switch (question.getType()) {
          case 'dropdown':
            question.setPropertyValue('visibleChoices', [
              new ItemValue(
                question.value,
                'Value selected, click the box to load it'
              ),
            ]);
            break;
          case 'tagbox':
            // TODO: Not working?
            const valueLength = question.value.length;
            if (valueLength > 0) {
              question.setPropertyValue('visibleChoices', [
                new ItemValue(
                  question.value[0],
                  valueLength +
                    (valueLength === 1 ? ' value' : ' values') +
                    ' selected, click the box to load ' +
                    (valueLength === 1 ? 'it' : 'them')
                ),
              ]);
            }
            break;

          default:
            break;
        }
      }
    }

    // Prevent selected choices to be removed when sending the value
    question.clearIncorrectValuesCallback = () => {
      // console.log(question.visibleChoices);
      // console.log(question.value);
    };
    // look on changes
    question.registerFunctionOnPropertyValueChanged(
      'referenceData',
      (value: string) => {
        question.referenceDataDisplayField = undefined;
        if (!value) {
          question.referenceDataDisplayField = undefined;
          question.referenceDataFilterFilterFromQuestion = undefined;
          question.referenceDataFilterForeignField = undefined;
          question.referenceDataFilterFilterCondition = undefined;
          question.referenceDataFilterLocalField = undefined;
        }
      }
    );
    question.registerFunctionOnPropertyValueChanged(
      'referenceDataDisplayField',
      updateChoices
    );

    // Look for foreign question changes if needed for filter
    const foreignQuestion = (question.survey as SurveyModel)
      .getAllQuestions()
      .find(
        (x: any) => x.name === question.referenceDataFilterFilterFromQuestion
      ) as QuestionSelectBase | undefined;
    foreignQuestion?.registerFunctionOnPropertyValueChanged(
      'value',
      updateChoices
    );
  }
};
