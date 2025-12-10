import { ComponentCollection, Serializer, SvgRegistry } from 'survey-core';
import { DomService } from '../../services/dom/dom.service';
import { Question } from '../types';
import {
  PeopleDropdownComponent,
  PeopleFieldValue,
} from './people-dropdown/people-dropdown.component';
import { PeopleTagboxComponent } from './people-tagbox/people-tagbox.component';

/** People icon SVG */
const PEOPLE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.96 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>';

/**
 * Adds common people properties to a question type.
 *
 * @param questionType Question type name
 */
const addPeopleProperties = (questionType: string): void => {
  Serializer.addProperty(questionType, {
    name: 'placeholder',
    category: 'People Settings',
    visibleIndex: 3,
  });
  Serializer.addProperty(questionType, {
    name: 'minSearchCharactersLength:number',
    category: 'People Settings',
    visibleIndex: 4,
  });
};

/**
 * Inits the people-dropdown component (single select).
 *
 * @param componentCollectionInstance ComponentCollection
 * @param domService DOM service.
 */
export const initPeopleDropdown = (
  componentCollectionInstance: ComponentCollection,
  domService: DomService
): void => {
  // Register icon
  SvgRegistry.registerIconFromSvg('people-dropdown', PEOPLE_ICON);

  const component = {
    name: 'people-dropdown',
    title: 'People (Single)',
    iconName: 'icon-people-dropdown',
    category: 'Custom Questions',
    questionJSON: {
      name: 'people-dropdown',
      type: 'text',
      placeholder: 'Begin typing and select',
    },
    onInit: (): void => {
      addPeopleProperties('people-dropdown');
    },
    onAfterRender: (question: Question, el: HTMLElement) => {
      const defaultInput = el.querySelector('.sd-input');
      if (defaultInput) {
        (defaultInput as HTMLElement).style.display = 'none';
      }

      const peopleDropdown = domService.appendComponentToBody(
        PeopleDropdownComponent,
        el
      );
      const instance: PeopleDropdownComponent = peopleDropdown.instance;

      instance.placeholder =
        (question as any).placeholder || 'Begin typing and select';
      instance.searchDebounce = (question as any).searchDebounce || 500;
      instance.minSearchLength =
        (question as any).minSearchCharactersLength || 2;

      if (question.value) {
        instance.initialSelection = question.value as any;
      }

      question.registerFunctionOnPropertyValueChanged(
        'value',
        (newValue: PeopleFieldValue | null) => {
          if (newValue && !instance.selectedPerson) {
            instance.initialSelection = newValue as any;
          }
        }
      );

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

/**
 * Inits the people-tagbox component (multi-select).
 *
 * @param componentCollectionInstance ComponentCollection
 * @param domService DOM service.
 */
export const initPeopleTagbox = (
  componentCollectionInstance: ComponentCollection,
  domService: DomService
): void => {
  // Register icon
  SvgRegistry.registerIconFromSvg('people-tagbox', PEOPLE_ICON);

  const component = {
    name: 'people-tagbox',
    title: 'People (Multiple)',
    iconName: 'icon-people-tagbox',
    category: 'Custom Questions',
    questionJSON: {
      name: 'people-tagbox',
      type: 'text',
      placeholder: 'Begin typing and select',
    },
    onInit: (): void => {
      addPeopleProperties('people-tagbox');
    },
    onAfterRender: (question: Question, el: HTMLElement) => {
      const defaultInput = el.querySelector('.sd-input');
      if (defaultInput) {
        (defaultInput as HTMLElement).style.display = 'none';
      }

      const peopleTagbox = domService.appendComponentToBody(
        PeopleTagboxComponent,
        el
      );
      const instance: PeopleTagboxComponent = peopleTagbox.instance;

      instance.placeholder =
        (question as any).placeholder || 'Begin typing and select';
      instance.searchDebounce = (question as any).searchDebounce || 500;
      instance.minSearchLength =
        (question as any).minSearchCharactersLength || 2;

      // Pass initial value (array of PeopleFieldValue or userids)
      if (question.value && Array.isArray(question.value)) {
        instance.initialSelection = question.value;
      }

      question.registerFunctionOnPropertyValueChanged(
        'value',
        (newValue: PeopleFieldValue[] | null) => {
          if (
            newValue &&
            Array.isArray(newValue) &&
            instance.selectedPeople.length === 0
          ) {
            instance.initialSelection = newValue;
          }
        }
      );

      // Store full person data array including metadata for grid/export
      instance.selectionChange.subscribe((peopleData: PeopleFieldValue[]) => {
        (question as any).value = peopleData.length > 0 ? peopleData : null;
      });

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

/**
 * Inits both people components.
 *
 * @param componentCollectionInstance ComponentCollection
 * @param domService DOM service.
 */
export const init = (
  componentCollectionInstance: ComponentCollection,
  domService: DomService
): void => {
  initPeopleDropdown(componentCollectionInstance, domService);
  initPeopleTagbox(componentCollectionInstance, domService);
};
