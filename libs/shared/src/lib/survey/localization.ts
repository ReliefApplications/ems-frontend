import { surveyLocalization } from 'survey-core';
import { editorLocalization } from 'survey-creator-core';

/** Available localizable strings, for survey */
const SURVEY_LOCALIZABLE_STRINGS = [
  {
    key: 'addNewRecord',
    locales: {
      en: 'Add new record',
      fr: 'Ajouter un enregistrement',
    },
  },
  {
    key: 'displayOnly',
    locales: {
      en: 'Display only',
      fr: 'Affichage seul',
    },
  },
  {
    key: 'onSelect',
    locales: {
      en: 'On select',
      fr: 'A la sélection',
    },
  },
  {
    key: 'fileLimitations',
    locales: {
      en: (question: any) => {
        const allowMultiple = question.getPropertyValue('allowMultiple');
        const maxSize = question.getPropertyValue('maxSize');
        const maxFiles = allowMultiple
          ? question.getPropertyValue('allowedFileNumber')
          : null;
        const sizeOnKB = Math.floor(maxSize / 1024);
        const isMB = Math.floor(sizeOnKB / 1024) >= 1;
        return `Drag and drop a file here or click the button below and choose a file to upload.
      ${maxFiles ? 'Attach up to ' + maxFiles + ' files. ' : ''}${
          maxSize
            ? 'Max ' +
              (isMB ? Math.floor(sizeOnKB / 1024) : sizeOnKB) +
              (isMB ? ' MB' : ' KB')
            : ''
        }
      `;
      },
      fr: (question: any) => {
        const allowMultiple = question.getPropertyValue('allowMultiple');
        const maxSize = question.getPropertyValue('maxSize');
        const maxFiles = allowMultiple
          ? question.getPropertyValue('allowedFileNumber')
          : null;
        const sizeOnKB = Math.floor(maxSize / 1024);
        const isMB = Math.floor(sizeOnKB / 1024) >= 1;
        return `Faites glisser et déposez un fichier ici ou cliquez sur le bouton ci-dessous et choisissez un fichier à télécharger.
      ${maxFiles ? "Joindre jusqu'à " + maxFiles + ' fichiers. ' : ''}${
          maxSize
            ? 'Max ' +
              (isMB ? Math.floor(sizeOnKB / 1024) : sizeOnKB) +
              (isMB ? ' MB' : ' KB')
            : ''
        }
      `;
      },
    },
  },
  {
    key: 'search',
    locales: {
      en: 'Search',
      fr: 'Rechercher',
    },
  },
  {
    key: 'edit',
    locales: {
      en: 'Edit',
      fr: 'Éditer',
    },
  },
];

/**
 * Add localizable strings to surveyjs
 *
 */
export const initLocalization = () => {
  for (const item of SURVEY_LOCALIZABLE_STRINGS) {
    for (const [locale, value] of Object.entries(item.locales)) {
      if (!surveyLocalization.locales[locale]) {
        surveyLocalization.locales[locale] = {};
      }
      surveyLocalization.locales[locale][`oort:${item.key}`] = value;
    }
  }
  // Also add to survey creator localization
  const editorEn = editorLocalization.getLocale('en');
  editorEn.pehelp.onSelect =
    'Define the mapping to pre-fill form questions from selected record.\n\n' +
    '• **On the left (Key):** The name of the question in *this* form (e.g., "country").\n' +
    '• **On the right (Value):** Expression running on selected *data record* (e.g., "{region}", "length({regions})").';
};
