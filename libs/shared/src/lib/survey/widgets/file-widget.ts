import { isNil } from 'lodash';
import { CustomWidgetCollection, SurveyModel } from 'survey-core';
import { CS_DOCUMENTS_PROPERTIES } from '../../services/document-management/document-management.service';
import { Question, QuestionFile } from '../types';

/**
 * Update file widget in order to be able to update properties with value expressions
 *
 * @param customWidgetCollectionInstance CustomWidgetCollection
 */
export const init = (
  customWidgetCollectionInstance: CustomWidgetCollection
): void => {
  const widget = {
    name: 'file-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'file',
    isDefaultRender: true,
    afterRender: (question: QuestionFile): void => {
      (question.survey as SurveyModel)?.onValueChanged.add((sender) => {
        CS_DOCUMENTS_PROPERTIES.filter(
          (prop) =>
            prop.bodyKey &&
            !!question[`valueExpression${prop.bodyKey as string}`]
        ).forEach((cs) => {
          const result = sender.runExpression(
            question[`valueExpression${cs.bodyKey}`]
          );
          question[cs.bodyKey as string] = !isNil(result)
            ? Array.isArray(result)
              ? result
              : [result]
            : result;
        });
        // Specific for occurrence, we don't need to build an array
        if (question['valueExpressionOccurrence']) {
          const result = sender.runExpression(
            question['valueExpressionOccurrence']
          );
          question['Occurrence'] = result;
        }
      });
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};