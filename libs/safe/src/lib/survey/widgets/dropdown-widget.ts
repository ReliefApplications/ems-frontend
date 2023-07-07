import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { DomService } from '../../services/dom/dom.service';
import { Question } from '../types';
import { QuestionDropdown } from 'survey-knockout';
import { isArray, isObject } from 'lodash';

/**
 * Init dropdown widget
 *
 * @param Survey Survey instance
 * @param domService Shared dom service
 */
export const init = (Survey: any, domService: DomService): void => {
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
      const dropdownInstance = createDropdownInstance(dropdownDiv);
      if (!isObject(question.value) && !isArray(question.value)) {
        dropdownInstance.value = question.value;
      }
      dropdownInstance.placeholder = question.placeholder;
      dropdownInstance.readonly = question.isReadOnly;
      dropdownInstance.disabled = question.isReadOnly;
      dropdownInstance.registerOnChange((value: any) => {
        if (!isObject(value) && !isArray(value)) {
          question.value = value;
        }
      });
      const updateChoices = () => {
        if (question.visibleChoices && Array.isArray(question.visibleChoices)) {
          dropdownInstance.data = question.visibleChoices.map((choice: any) =>
            typeof choice === 'string'
              ? {
                  text: choice,
                  value: choice,
                }
              : {
                  text: choice.text,
                  value: choice.value,
                }
          );
        }
      };
      question._propertyValueChangedVirtual = () => {
        updateChoices();
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
      updateChoices();
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
   * @returns combobox component
   */
  const createDropdownInstance = (element: any): ComboBoxComponent => {
    const dropdown = domService.appendComponentToBody(
      ComboBoxComponent,
      element
    );
    const dropdownInstance: ComboBoxComponent = dropdown.instance;
    dropdownInstance.virtual = {
      itemHeight: 28,
    };
    dropdownInstance.valuePrimitive = true;
    dropdownInstance.textField = 'text';
    dropdownInstance.valueField = 'value';
    return dropdownInstance;
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(
    widget,
    'customwidget'
  );
};
