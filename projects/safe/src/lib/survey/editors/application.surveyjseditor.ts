import { isNil } from 'lodash';
import {
  JsonObjectProperty,
  Question,
  Serializer,
  CustomWidgetCollection,
} from 'survey-core';
import { PropertyGridEditorCollection } from 'survey-creator-core';
import { SafeApplicationDropdownComponent } from '../../components/application-dropdown/application-dropdown.component';
import { DomService } from '../../services/dom/dom.service';

/**
 * Inits the application dropdown widget
 *
 * @param domService - The dom service
 */
export const init = (domService: DomService): void => {
  const widget = {
    name: 'application-dropdown',
    title: 'Resource Dropdown',
    isFit: (question: Question) =>
      question.getType() === 'application-dropdown',
    init: () => {
      // Register application-dropdown type using the empty question as the base.
      Serializer.addClass('application-dropdown', [], undefined, 'empty');

      // Hide the application-dropdown type from the toolbox.
      CustomWidgetCollection.Instance.getCustomWidgetByName(
        'application-dropdown'
      ).showInToolbox = false;
    },
    afterRender: (question: Question, htmlElement: HTMLElement): void => {
      const dropdown = domService.appendComponentToBody(
        SafeApplicationDropdownComponent,
        htmlElement
      );
      const instance: SafeApplicationDropdownComponent = dropdown.instance;
      instance.value = question.applications;
      instance.choice.subscribe((res) => {
        if (!isNil(res)) question.value = res;
      });

      // inits previously selected value
      if (question.value) {
        instance.value = question.value;
      }
    },
  };

  // registers custom widget as type
  CustomWidgetCollection.Instance.add(widget, 'customtype');

  // registers custom property editor
  PropertyGridEditorCollection.register({
    fit: (prop: JsonObjectProperty) => prop.type === 'application-dropdown',
    getJSON: () => ({
      type: 'application-dropdown',
    }),
  });
};
