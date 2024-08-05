import { Question } from '../types';
import {
  CustomWidgetCollection,
  JsonMetadata,
  QuestionFileModel,
  Serializer,
} from 'survey-core';

/**
 * Update the loaded file from the URL.
 *
 * @param question QuestionFileModel
 */
const updateLoadedFile = (question: QuestionFileModel) => {
  if (
    !question.downloadFileFrom ||
    !question.fileName ||
    question.loadingFileFromUrl
  ) {
    return;
  }

  const {
    downloadFileFrom: url,
    fileName,
    fileType,
    includeOortToken,
  } = question;

  setTimeout(() => {
    question.value = [
      {
        name: `${fileName}`,
        type: fileType,
        content: `custom:${url}`,
        includeOortToken,
      },
    ];
  }, 500);
};

/**
 * Custom definition for overriding the text question. Allowed support for dates.
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
    init: (): void => {
      const serializer: JsonMetadata = Serializer;

      serializer.addProperty('file', {
        name: 'downloadFileFrom',
        category: 'Download from URL',
        visible: false,
      });
      serializer.addProperty('file', {
        name: 'downloadFileFromExp:expression',
        displayName: 'URL',
        category: 'Download from URL',
        visibleIndex: 1,
        onExecuteExpression: (obj: QuestionFileModel, res: string) => {
          obj.setPropertyValue('downloadFileFrom', res);
          if (res !== obj.downloadFileFrom || !obj.value) {
            updateLoadedFile(obj);
          }
        },
      });

      serializer.addProperty('file', {
        name: 'fileName',
        category: 'Download from URL',
        visible: false,
      });
      serializer.addProperty('file', {
        name: 'fileNameExp:expression',
        displayName: 'File name',
        category: 'Download from URL',
        visibleIndex: 2,
        onExecuteExpression: (obj: QuestionFileModel, res: string) => {
          obj.setPropertyValue('fileName', res);
          if (res !== obj.fileName || !obj.value) {
            updateLoadedFile(obj);
          }
        },
      });

      serializer.addProperty('file', {
        // dropdown
        name: 'fileType:dropdown',
        category: 'Download from URL',
        default: 'application/pdf',
        choices: ['application/pdf'],
        visibleIndex: 3,
      });

      serializer.addProperty('file', {
        name: 'includeOortToken:boolean',
        category: 'Download from URL',
        default: false,
        visibleIndex: 4,
      });
    },
    isDefaultRender: true,
    afterRender: (question: QuestionFileModel): void => {
      if (question.downloadFileFromExp) {
        question.readOnly = true;
      }
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
