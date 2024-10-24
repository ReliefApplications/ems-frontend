import { CustomWidgetCollection, SurveyModel } from 'survey-core';
import { Question, QuestionFile } from '../types';

export const init = (
  customWidgetCollectionInstance: CustomWidgetCollection
): void => {
  const widget = {
    name: 'file-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'file',
    isDefaultRender: true,
    afterRender: (question: QuestionFile): void => {
      console.log(question);
      (question.survey as SurveyModel)?.onValueChanged.add((sender) => {
        if (question.valueExpressionaetiologys) {
          const result = sender.runExpression(
            question.valueExpressionaetiologys
          );
          question.Aetiology = [result];
          console.log(question);
        }
      });
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
