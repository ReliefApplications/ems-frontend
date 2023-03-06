import { JsonMetadata, Question } from 'survey-angular';

/**
 * Edits general settings of the survey builder.
 *
 * @param Survey Survey library
 */
export const initCreatorSettings = (Survey: any): void => {
  const serializer: JsonMetadata = Survey.Serializer;

  serializer.findProperty('question', 'name').readOnly = true;
  serializer.findProperty('question', 'name').onGetValue = (obj: Question) =>
    obj.valueName ? obj.valueName : obj.name;
  serializer.findProperty('question', 'valueName').isRequired = true;
  serializer.findProperty('file', 'storeDataAsText').onGetValue = () => false;
  serializer.findProperty('file', 'storeDataAsText').readOnly = true;
  serializer.findProperty('file', 'storeDataAsText').visible = false;
  serializer.findProperty('file', 'maxSize').onGetValue = () => 7340032;
};
