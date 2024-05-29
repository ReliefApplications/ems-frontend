import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { DomService } from '../../services/dom/dom.service';
import { Question } from '../types';
import { CustomWidgetCollection, QuestionDropdownModel } from 'survey-core';
import { has, isArray, isEqual, isObject } from 'lodash';
import { debounceTime, map, tap } from 'rxjs';
import updateChoices from './utils/common-list-filters';

/**
 * Init dropdown widget
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
  const widget = {
    name: 'dropdown-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'dropdown',
    isDefaultRender: true,
    afterRender: (
      question: QuestionDropdownModel,
      el: HTMLInputElement
    ): void => {
      let currentSearchValue = '';
      const defaultDropdown = el.querySelector('sv-ng-dropdown');
      // Remove previous input if already rendered
      el.parentElement?.querySelector('.k-input')?.parentElement?.remove();
      widget.willUnmount(question);
      // remove default render
      el.parentElement?.querySelector('.sv_select_wrapper')?.remove();
      let dropdownDiv: HTMLDivElement | null = null;
      dropdownDiv = document.createElement('div');
      dropdownDiv.classList.add('flex', 'min-h-[36px]');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dropdownInstance = createDropdownInstance(dropdownDiv, question);
      // Make sure the value is valid
      if (!isObject(question.value) && !isArray(question.value)) {
        dropdownInstance.value = question.value;
      }
      dropdownInstance.placeholder = question.placeholder;
      dropdownInstance.readonly = question.isReadOnly;
      dropdownInstance.registerOnChange((value: any) => {
        // Make sure the value is valid
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
      question.registerFunctionOnPropertyValueChanged(
        'isPrimitiveValue',
        (newValue: boolean) => {
          dropdownInstance.clearValue();
          dropdownInstance.valuePrimitive = newValue;
          question.value = null;
          question.defaultValue = null;
        }
      );
      question.registerFunctionOnPropertyValueChanged('value', () => {
        // We need this line for resource select
        if (question.isPrimitiveValue) {
          dropdownInstance.value = question.value;
        } else {
          if (question.visibleChoices.length > 0) {
            if (has(question.value, 'text') && has(question.value, 'value')) {
              dropdownInstance.value = question.visibleChoices.find((choice) =>
                isEqual(choice.value, question.value.value)
              );
            } else {
              dropdownInstance.value = question.visibleChoices.find((choice) =>
                isEqual(choice.value, question.value)
              );
            }
          }
        }
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
      question._instance = dropdownInstance;
      defaultDropdown?.replaceWith(dropdownDiv);
    },
    willUnmount: (question: any): void => {
      if (!question._propertyValueChangedVirtual) return;
      question.readOnlyChangedCallback = null;
      question.valueChangedCallback = null;
      question.unRegisterFunctionOnPropertyValueChanged(
        'visibleChoices',
        question._propertyValueChangedVirtual
      );
      question._instance = undefined;
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
    question: QuestionDropdownModel
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
    dropdownInstance.popupSettings = {
      appendTo: 'component',
      width: question.popupWidth,
    };
    dropdownInstance.fillMode = 'none';
    return dropdownInstance;
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
