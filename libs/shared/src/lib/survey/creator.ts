import { JsonMetadata, Serializer } from 'survey-core';
import { Question } from './types';

/**
 * Edits general settings of the survey builder.
 *
 */
export const initCreatorSettings = (): void => {
  const serializer: JsonMetadata = Serializer;

  serializer.findProperty('question', 'name').readOnly = true;
  serializer.findProperty('question', 'name').onGetValue = (obj: Question) =>
    obj.valueName ? obj.valueName : obj.name;
  serializer.findProperty('question', 'valueName').isRequired = true;
  serializer.findProperty('file', 'storeDataAsText').onGetValue = () => false;
  serializer.findProperty('file', 'storeDataAsText').readOnly = true;
  serializer.findProperty('file', 'storeDataAsText').visible = false;
  serializer.findProperty('file', 'maxSize').onGetValue = () => 7340032;
};
