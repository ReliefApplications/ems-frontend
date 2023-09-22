import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { DomService } from '../../services/dom/dom.service';
import { Question } from '../types';
import { QuestionDropdown } from 'survey-knockout';
import { isArray, isObject } from 'lodash';
import { debounceTime, map, tap } from 'rxjs';
import updateChoices from './utils/common-list-filters';

/**
 * Init dropdown widget
 *
 * @param Survey Survey instance
 * @param domService Shared dom service
 */
export const init = (Survey: any, domService: DomService): void => {
  let currentSearchValue = '';
  const widget = {
    name: 'dropdown-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'dropdown',
    isDefaultRender: true,
    afterRender: (question: QuestionDropdown, el: HTMLInputElement): void => {
      widget.willUnmount(question);
      // remove default render
      el.parentElement?.querySelector('.sv_select_wrapper')?.remove();
      let dropdownDiv: HTMLDivElement | null = null;
      dropdownDiv = document.createElement('div');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dropdownInstance = createDropdownInstance(dropdownDiv, question);
      if (!isObject(question.value) && !isArray(question.value)) {
        dropdownInstance.value = question.value;
      }
      dropdownInstance.placeholder = question.placeholder;
      dropdownInstance.readonly = question.isReadOnly;
      dropdownInstance.registerOnChange((value: any) => {
        if (question.isPrimitiveValue) {
          if (!isObject(value) && !isArray(value)) {
            question.value = value;
          }
        } else {
          question.value = value;
        }
      });

      // We subscribe to whatever you write on the field so we can filter the data accordingly
      dropdownInstance.filterChange
        .pipe(
          debounceTime(500), // Debounce time to limit quantity of updates
          tap(() => (dropdownInstance.loading = true)),
          map((searchValue: string) => searchValue?.toLowerCase()) // Make the filter non-case sensitive
        )
        .subscribe((searchValue: string) => {
          currentSearchValue = searchValue;
          updateChoices(dropdownInstance, question, searchValue);
        });

      question._propertyValueChangedVirtual = () => {
        updateChoices(dropdownInstance, question, currentSearchValue);
      };
      question.registerFunctionOnPropertyValueChanged(
        'visibleChoices',
        question._propertyValueChangedVirtual
      );
      question.registerFunctionOnPropertyValueChanged('value', () => {
        dropdownInstance.value = question.value;
      });
      question.registerFunctionOnPropertyValueChanged(
        'readOnly',
        (value: boolean) => {
          dropdownInstance.readonly = value;
          dropdownInstance.disabled = value;
        }
      );
      if (question.visibleChoices.length) {
        updateChoices(dropdownInstance, question, currentSearchValue);
      }
      el.parentElement?.appendChild(dropdownDiv);
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
   * Create dropdown instance
   *
   * @param element html element
   * @param question surveyjs question for the element
   * @returns combobox component
   */
  const createDropdownInstance = (
    element: any,
    question: QuestionDropdown
  ): ComboBoxComponent => {
    const dropdown = domService.appendComponentToBody(
      ComboBoxComponent,
      element
    );
    const dropdownInstance: ComboBoxComponent = dropdown.instance;
    dropdownInstance.virtual = {
      itemHeight: 28,
    };
    dropdownInstance.valuePrimitive = Boolean(question.isPrimitiveValue);
    dropdownInstance.filterable = true;
    dropdownInstance.loading = true;
    dropdownInstance.disabled = true;
    dropdownInstance.textField = 'text';
    dropdownInstance.valueField = 'value';
    dropdownInstance.popupSettings = { appendTo: 'component' };
    return dropdownInstance;
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(
    widget,
    'customwidget'
  );
};
