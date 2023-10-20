import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { DomService } from '../../services/dom/dom.service';
import { Question } from '../types';
import {
  CustomWidgetCollection,
  Serializer,
  SvgRegistry,
  DropdownMultiSelectListModel,
} from 'survey-core';
import { debounceTime, map, tap } from 'rxjs';
import updateChoices from './utils/common-list-filters';

/**
 * Init tagbox question
 *
 * @param domService Shared dom service
 * @param customWidgetCollectionInstance CustomWidgetCollection
 * @param document Document
 */
export const init = (
  domService: DomService,
  customWidgetCollectionInstance: CustomWidgetCollection,
  document: Document
): void => {
  const iconId = 'icon-tagbox';

  // registers icon-resources in the SurveyJS library
  SvgRegistry.registerIconFromSvg(
    'tagbox',
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g><path d="M15,11H0V5h15V11z M1,10h13V6H1V10z"/></g><rect x="2" y="7" width="4" height="2"/><rect x="7" y="7" width="4" height="2"/></svg>'
  );
  let currentSearchValue = '';
  const componentName = 'tagbox';
  const widget = {
    name: 'tagbox',
    title: 'Tagbox',
    iconName: iconId,
    category: 'Custom Questions',
    defaultJSON: {
      choices: ['Item 1', 'Item 2', 'Item 3'],
    },
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => {
      return question.getType() === componentName;
    },
    init: () => {
      if (Serializer.findClass(componentName)) return;
      Serializer.addClass(
        componentName,
        [
          { name: 'hasOther:boolean', visible: false },
          { name: 'hasSelectAll:boolean', visible: false },
          { name: 'hasNone:boolean', visible: false },
          { name: 'otherText', visible: false },
          { name: 'selectAllText', visible: false },
          { name: 'noneText', visible: false },
        ],
        () => null,
        'checkbox'
      );
      Serializer.addProperty(componentName, {
        name: 'placeholder',
        category: 'general',
        default: '',
      });
      Serializer.addProperty(componentName, {
        name: 'allowAddNewTag:boolean',
        category: 'general',
        default: false,
      });
    },
    isDefaultRender: false,
    afterRender: (question: any, el: HTMLElement): void => {
      const defaultTagbox = el.querySelector('sv-ng-tagbox-question');
      if (defaultTagbox) {
        el.removeChild(defaultTagbox);
      }
      const parentQuestion = question.parentQuestion;
      if (
        parentQuestion &&
        (parentQuestion.getType() === 'matrixdynamic' ||
          parentQuestion.getType() === 'matrixdropdown')
      ) {
        question.choices = parentQuestion.choices;
      }
      widget.willUnmount(question);
      let tagboxDiv: HTMLDivElement | null = null;
      tagboxDiv = document.createElement('div');
      tagboxDiv.classList.add('flex', 'min-h-[36px]');
      tagboxDiv.id = 'tagbox';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tagboxInstance = createTagboxInstance(tagboxDiv, question);
      tagboxInstance.value = question.value;
      tagboxInstance.placeholder = question.placeholder;
      tagboxInstance.readonly = question.isReadOnly;
      tagboxInstance.registerOnChange((value: any) => {
        question.value = value;
      });

      // We subscribe to whatever you write on the field so we can filter the data accordingly
      tagboxInstance.filterChange
        .pipe(
          debounceTime(500), // Debounce time to limit quantity of updates
          tap(() => (tagboxInstance.loading = true)),
          map((searchValue: string) => searchValue?.toLowerCase()) // Make the filter non-case sensitive
        )
        .subscribe((searchValue: string) => {
          currentSearchValue = searchValue;
          updateChoices(tagboxInstance, question, searchValue);
        });

      question._propertyValueChangedVirtual = () => {
        updateChoices(tagboxInstance, question, currentSearchValue);
      };
      question.registerFunctionOnPropertyValueChanged(
        'visibleChoices',
        question._propertyValueChangedVirtual
      );
      question.registerFunctionOnPropertyValueChanged(
        'readOnly',
        (value: boolean) => {
          tagboxInstance.readonly = value;
          tagboxInstance.disabled = value;
        }
      );
      if (question.visibleChoices.length) {
        updateChoices(tagboxInstance, question, currentSearchValue);
      }
      el.parentElement?.appendChild(tagboxDiv);
    },
    willUnmount: (question: any): void => {
      if (!question._propertyValueChangedVirtual) return;
      question.readOnlyChangedCallback = null;
      question.valueChangedCallback = null;
      question.unRegisterFunctionOnPropertyValueChanged(
        'visibleChoices',
        question._propertyValueChangedVirtual
      );
      question._propertyValueChangedVirtual = undefined;
    },
  };

  /**
   * Create the tagbox instance
   *
   * @param element html element
   * @param question surveyjs question for the element
   * @returns multi select component
   */
  const createTagboxInstance = (
    element: any,
    question: Question
  ): MultiSelectComponent => {
    const tagbox = domService.appendComponentToBody(
      MultiSelectComponent,
      element
    );
    const tagboxInstance: MultiSelectComponent = tagbox.instance;
    tagboxInstance.virtual = {
      itemHeight: 28,
    };
    tagboxInstance.valuePrimitive = Boolean(question.isPrimitiveValue);
    tagboxInstance.filterable = true;
    tagboxInstance.loading = true;
    tagboxInstance.disabled = true;
    tagboxInstance.textField = 'text';
    tagboxInstance.valueField = 'value';
    tagboxInstance.popupSettings = { appendTo: 'component' };
    tagboxInstance.fillMode = 'none';
    return tagboxInstance;
  };
  // ⚠ danger ⚠
  /**
   * Solution to prevent tagbox to freeze if too many items. We are overriding the surveyjs logic, in order to prevent some built-in methods to be called.
   * Whenever we update surveyjs, we need to check that the logic hasn't changed on their side.
   */
  (DropdownMultiSelectListModel.prototype as any).syncFilterStringPlaceholder =
    function () {
      this.filterStringPlaceholder = this.question.placeholder;
    };
  // there, we define that we want, with 'customtype', that the widget also appears in the list of questions
  customWidgetCollectionInstance.add(widget, 'customtype');
};
