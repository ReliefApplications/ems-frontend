import * as SurveyCore from 'survey-core';
import { JsonObjectProperty, Question } from 'survey-core';
import { PropertyGridEditorCollection } from 'survey-creator-core';
import { DomService } from '../../services/dom/dom.service';
import { SafeResourceDropdownComponent } from '../../components/resource-dropdown/resource-dropdown.component';

/**
 * Inits the resource dropdown widget
 *
 * @param domService - The dom service
 */
export const init = (domService: DomService): void => {
  const widget = {
    name: 'resource-dropdown',
    title: 'Resource Dropdown',
    isFit: (question: Question) => question.getType() === 'resource-dropdown',
    init: () => {
      // Register resource-dropdown type using the empty question as the base.
      SurveyCore.Serializer.addClass(
        'resource-dropdown',
        [],
        undefined,
        'empty'
      );

      // Hide the resource-dropdown type from the toolbox.
      SurveyCore.CustomWidgetCollection.Instance.getCustomWidgetByName(
        'resource-dropdown'
      ).showInToolbox = false;
    },
    afterRender: (question: Question, htmlElement: HTMLElement): void => {
      const dropdown = domService.appendComponentToBody(
        SafeResourceDropdownComponent,
        htmlElement
      );
      const instance: SafeResourceDropdownComponent = dropdown.instance;
      instance.resource = question.resource;
      instance.choice.subscribe((res) => {
        if (typeof res === 'string') question.value = res;
      });

      // inits previously selected value
      if (question.value) {
        instance.resource = question.value;
      }
    },
  };

  // registers custom widget as type
  SurveyCore.CustomWidgetCollection.Instance.add(widget, 'customtype');

  // registers custom property editor
  PropertyGridEditorCollection.register({
    fit: (prop: JsonObjectProperty) => prop.type === 'resource-dropdown',
    getJSON: () => ({
      type: 'resource-dropdown',
    }),
  });
};
