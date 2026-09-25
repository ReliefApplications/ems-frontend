import { Question as SurveyQuestion, SurveyModel } from 'survey-core';
import { AZURE_SUPPORTED_LANGUAGES } from '../../constants/azure-languages.const';

/** SurveyJS question type name of a native file upload question. */
export const FILE_QUESTION_TYPE = 'file';

/** Generic dropdown choice. */
export interface WidgetChoice {
  value: string;
  text: string;
}

/**
 * A survey model extended with the (not-yet-standard) `languages` property.
 *
 * This is expected to be populated by the app from a future backend
 * `form.languages: string[]` field when the survey model is built. Until that
 * wiring lands, the property is simply absent and every helper below falls
 * back to {@link AZURE_SUPPORTED_LANGUAGES}, so the Upload / Management
 * widgets keep working standalone.
 */
export interface SurveyWithLanguages extends SurveyModel {
  languages?: string[];
}

/** A file object as stored in a file question's value, tagged with the language it was uploaded for. */
export interface LanguageTaggedFile {
  name: string;
  type?: string;
  content?: unknown;
  language?: string;
  [key: string]: unknown;
}

/**
 * Returns every file-type question of the survey, in survey order.
 *
 * @param survey Survey to inspect
 * @returns File questions found in the survey (empty array if none / no survey)
 */
export const getFileQuestions = (
  survey: SurveyModel | undefined
): SurveyQuestion[] =>
  (survey?.getAllQuestions() ?? []).filter(
    (candidate) => candidate.getType() === FILE_QUESTION_TYPE
  );

/**
 * Builds the dropdown choices used to pick a target file field.
 *
 * @param survey Survey to inspect
 * @returns Choices, one per file-type question
 */
export const getFileQuestionChoices = (
  survey: SurveyModel | undefined
): WidgetChoice[] =>
  getFileQuestions(survey).map((question) => ({
    value: question.name,
    text: question.title || question.valueName || question.name,
  }));

/**
 * Builds the language choices for the Upload / Management widgets.
 *
 * Reads `survey.languages` (a plain string array the app is expected to
 * inject onto the survey model from the backend's `form.languages` field).
 * Falls back to {@link AZURE_SUPPORTED_LANGUAGES} when absent or empty, so the
 * widgets remain usable before that wiring exists.
 *
 * @param survey Survey to inspect
 * @returns Language choices
 */
export const getLanguageChoices = (
  survey: SurveyModel | undefined
): WidgetChoice[] => {
  const languages = (survey as SurveyWithLanguages | undefined)?.languages;
  if (Array.isArray(languages) && languages.length > 0) {
    return languages
      .filter((code): code is string => typeof code === 'string' && !!code)
      .map((code) => ({
        value: code,
        text:
          AZURE_SUPPORTED_LANGUAGES.find((lang) => lang.value === code)?.text ||
          code,
      }));
  }
  return AZURE_SUPPORTED_LANGUAGES.map((lang) => ({ ...lang }));
};

/** A restriction violated when staging files for upload. */
export interface FileRestrictionError {
  /** Translation key describing the violation. */
  key: string;
  /** Translation parameters (e.g. the offending file name, the allowed count). */
  params?: Record<string, unknown>;
}

/**
 * Checks whether an mime type / extension is covered by a file question's
 * `acceptedTypes` (same format as the native `accept` HTML attribute, e.g.
 * `.png,.jpg,image/*`).
 *
 * @param file File being checked
 * @param acceptedTypes Comma separated list of extensions / mime types / wildcards
 * @returns True when the file matches at least one entry
 */
const matchesAcceptedTypes = (file: File, acceptedTypes: string): boolean => {
  const tokens = acceptedTypes
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => !!token);
  if (!tokens.length) {
    return true;
  }
  const fileName = file.name.toLowerCase();
  const fileType = (file.type || '').toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) {
      return fileName.endsWith(token);
    }
    if (token.endsWith('/*')) {
      return fileType.startsWith(token.slice(0, -1));
    }
    return fileType === token;
  });
};

/**
 * Validates files about to be staged / uploaded against a target file
 * question's restrictions, reading them the same way
 * `FormBuilderService.checkFileUploadValidity` does (`allowMultiple`,
 * `allowedFileNumber`), plus `acceptedTypes` and `maxSize` which that helper
 * does not cover.
 *
 * @param question Target file question
 * @param existingCount Number of files already held by the question (committed + already staged)
 * @param incoming Files about to be added
 * @returns The first violated restriction, or null when the files are valid
 */
export const checkFileRestrictions = (
  question: SurveyQuestion,
  existingCount: number,
  incoming: File[]
): FileRestrictionError | null => {
  if (!incoming.length) {
    return null;
  }
  const allowMultiple = !!question.getPropertyValue('allowMultiple');
  const allowedFileNumber = Number(
    question.getPropertyValue('allowedFileNumber') || 0
  );
  const acceptedTypes = question.getPropertyValue('acceptedTypes') as
    | string
    | undefined;
  const maxSize = Number(question.getPropertyValue('maxSize') || 0);

  if (!allowMultiple && existingCount + incoming.length > 1) {
    return { key: 'components.filesUpload.errors.singleFileOnly' };
  }
  if (
    allowMultiple &&
    allowedFileNumber > 0 &&
    existingCount + incoming.length > allowedFileNumber
  ) {
    return {
      key: 'components.filesUpload.errors.maximumAllowedFiles',
      params: { number: allowedFileNumber },
    };
  }
  if (maxSize > 0) {
    const tooBig = incoming.find((file) => file.size > maxSize);
    if (tooBig) {
      return {
        key: 'components.filesUpload.errors.maxSizeExceeded',
        params: { name: tooBig.name },
      };
    }
  }
  if (acceptedTypes) {
    const invalid = incoming.find(
      (file) => !matchesAcceptedTypes(file, acceptedTypes)
    );
    if (invalid) {
      return {
        key: 'components.filesUpload.errors.invalidType',
        params: { name: invalid.name },
      };
    }
  }
  return null;
};
