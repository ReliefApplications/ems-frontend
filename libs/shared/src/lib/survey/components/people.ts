import { ComponentCollection, Serializer, SvgRegistry } from 'survey-core';
import { DomService } from '../../services/dom/dom.service';
import { Question } from '../types';
import {
  PeopleDropdownComponent,
  PeopleFieldValue,
} from './people-dropdown/people-dropdown.component';

/**
 * Inits the people component.
 *
 * @param componentCollectionInstance ComponentCollection
 * @param domService DOM service.
 */
export const init = (
  componentCollectionInstance: ComponentCollection,
  domService: DomService
): void => {
  // Registers icon-people in the SurveyJS library
  SvgRegistry.registerIconFromSvg(
    'people',
    '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.96 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>'
  );

  const component = {
    name: 'people',
    title: 'People',
    iconName: 'icon-people',
    category: 'Custom Questions',
    questionJSON: {
      name: 'people',
      type: 'dropdown',
      placeholder: 'Begin typing and select',
      optionsCaption: 'Begin typing and select',
      choices: [] as any[],
    },
    onInit: (): void => {
      Serializer.addProperty('people', {
        name: 'placeholder',
        category: 'People Settings',
        visibleIndex: 3,
      });
      Serializer.addProperty('people', {
        name: 'minSearchCharactersLength:number',
        category: 'People Settings',
        visibleIndex: 4,
      });
      Serializer.addProperty('people', {
        name: 'pageSize:number',
        category: 'People Settings',
        visibleIndex: 5,
      });
    },
    onAfterRender: (question: Question, el: HTMLElement) => {
      const defaultDropdown = el.querySelector('kendo-combobox')?.parentElement;
      if (defaultDropdown) {
        defaultDropdown.style.display = 'none';
      }

      const peopleDropdown = domService.appendComponentToBody(
        PeopleDropdownComponent,
        el
      );
      const instance: PeopleDropdownComponent = peopleDropdown.instance;

      instance.placeholder =
        (question as any).placeholder || 'Begin typing and select';
      instance.searchDebounce = (question as any).searchDebounce || 500;
      instance.minSearchLength = (question as any).minSearchLength || 2;
      if (
        typeof (question as any).pageSize === 'number' &&
        (question as any).pageSize > 0
      ) {
        instance.pageSize = (question as any).pageSize;
      }
      // Pass initial value (could be a string userid or full PeopleFieldValue)
      if (question.value) instance.initialSelectionID = question.value as any;

      // Store full person data including metadata for grid/export
      instance.selectionChange.subscribe(
        (personData: PeopleFieldValue | null) => {
          (question as any).value = personData ?? null;
        }
      );

      if ((question as any).isReadOnly) {
        instance.control.disable();
      }

      question.registerFunctionOnPropertyValueChanged(
        'readOnly',
        (value: boolean) => {
          if (value) instance.control.disable();
          else instance.control.enable();
        }
      );
    },
  };

  componentCollectionInstance.add(component);
};
