import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { DomService } from '../../services/dom/dom.service';
import { Question } from '../types';
import { QuestionDropdown } from 'survey-knockout';
import { isArray, isObject } from 'lodash';
import { debounceTime, map } from 'rxjs';

/**
 * Init dropdown widget
 *
 * @param Survey Survey instance
 * @param domService Shared dom service
 */
export const init = (Survey: any, domService: DomService): void => {
  let currentSearchValue = '';
  let filterChangeSubscription!: any;
  let dropdownButton!: any;
  let loadReferenceDataItems: () => void;
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
      dropdownButton =
        dropdownInstance.wrapper.nativeElement.querySelector('button');

      loadReferenceDataItems = () => {
        if (!dropdownInstance.isOpen) {
          question.currentSearchValue.next(currentSearchValue);
        }
      };

      // init the choices on caret arrow click if needed
      if (question.referenceData) {
        dropdownButton?.addEventListener('click', loadReferenceDataItems);
      }
      // We subscribe to whatever you write on the field so we can filter the data accordingly
      filterChangeSubscription = dropdownInstance.filterChange
        .pipe(
          debounceTime(500), // Debounce time to limit quantity of updates
          map((searchValue: string) => searchValue?.toLowerCase()) // Make the filter non-case sensitive
        )
        .subscribe((searchValue: string) => {
          currentSearchValue = searchValue;
          // TODO: remove filter on updatechoices and make it redo the query -> go to ../global-properties/reference-data.ts
          if (question.referenceData) {
            question.currentSearchValue.next(currentSearchValue);
          }
          updateChoices(searchValue);
        });

      const updateChoices = (searchValue?: string) => {
        if (!searchValue) {
          // Without search value shows the first 100 values
          dropdownInstance.data = question.visibleChoices
            .map((choice: any) =>
              typeof choice === 'string'
                ? {
                    text: choice,
                    value: choice,
                  }
                : {
                    text: choice.text,
                    value: choice.value,
                  }
            )
            .slice(0, 100);
        } else {
          // Filters the data to those that include the search value and sets the choices to the first 100
          if (
            question.visibleChoices &&
            Array.isArray(question.visibleChoices)
          ) {
            const filterData = question.visibleChoices.filter((choice: any) =>
              typeof choice === 'string'
                ? choice.toLowerCase().includes(searchValue)
                : choice.text.toLowerCase().includes(searchValue)
            );
            const dataToShow = filterData
              .map((choice: any) =>
                typeof choice === 'string'
                  ? {
                      text: choice,
                      value: choice,
                    }
                  : {
                      text: choice.text,
                      value: choice.value,
                    }
              )
              .slice(0, 100);
            dropdownInstance.data = dataToShow;
          }
        }
      };

      question._propertyValueChangedVirtual = () => {
        updateChoices(currentSearchValue);
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
      filterChangeSubscription?.unsubscribe();
      dropdownButton?.removeEventListener('click', loadReferenceDataItems);
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
    dropdownInstance.filterable = true;

    return dropdownInstance;
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(
    widget,
    'customwidget'
  );
};
