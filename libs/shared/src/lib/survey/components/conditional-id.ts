import { ComponentCollection, JsonMetadata, Serializer } from 'survey-core';
import { Question } from '../types';
import { CONDITIONAL_ID_SOURCE_FIELD_TYPE } from '../property-editors/conditional-id-source-field.editor';

/**
 * Inits the conditionalId component: a system-generated, non-editable id field
 * whose value depends on a sibling boolean field (e.g. cecis_number driven by
 * cecis_case, or a MedEvac case id driven by a civilian/military field).
 * The actual id generation happens server-side (see getNextConditionalId /
 * applyConditionalIds in ems-backend) - this widget only renders the value and
 * exposes the admin configuration (source field, prefixes, digit counts).
 *
 * @param componentCollectionInstance ComponentCollection
 */
export const init = (
  componentCollectionInstance: ComponentCollection
): void => {
  const component = {
    name: 'conditionalid',
    title: 'Conditional ID',
    iconName: 'icon-default',
    questionJSON: {
      name: 'conditionalid',
      type: 'text',
      readOnly: true,
    },
    category: 'Custom Questions',
    onInit: (): void => {
      const serializer: JsonMetadata = Serializer;
      serializer.addProperty('conditionalid', {
        name: 'sourceField',
        category: 'Conditional ID',
        type: CONDITIONAL_ID_SOURCE_FIELD_TYPE,
        visibleIndex: 1,
        displayName: 'Source boolean field',
        required: true,
      });
      serializer.addProperty('conditionalid', {
        name: 'truePrefix',
        category: 'Conditional ID',
        type: 'string',
        visibleIndex: 2,
        displayName: 'Prefix when source field is true',
        required: true,
      });
      serializer.addProperty('conditionalid', {
        name: 'trueDigits:number',
        category: 'Conditional ID',
        visibleIndex: 3,
        displayName: 'Digits when source field is true',
        default: 4,
        required: true,
      });
      serializer.addProperty('conditionalid', {
        name: 'falsePrefix',
        category: 'Conditional ID',
        type: 'string',
        visibleIndex: 4,
        displayName: 'Prefix when source field is false',
        required: true,
      });
      serializer.addProperty('conditionalid', {
        name: 'falseDigits:number',
        category: 'Conditional ID',
        visibleIndex: 5,
        displayName: 'Digits when source field is false',
        default: 4,
        required: true,
      });
    },
    onAfterRender: (question: Question, el: HTMLElement): void => {
      // This field is always system-generated: force it non-editable regardless
      // of survey mode, or of any readOnly/enableIf toggling on the question.
      question.readOnly = true;
      const input = el.getElementsByTagName('input')[0];
      if (input) {
        input.readOnly = true;
        input.tabIndex = -1;
      }
    },
  };
  componentCollectionInstance.add(component);
};
