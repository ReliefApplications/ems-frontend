import { surveyLocalization } from 'survey-core';

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
    key: 'fileLimitations',
    locales: {
      en: (maxSize: number, maxFiles: number) => `
      Drag and drop a file here or click the button below and choose a file to upload.
      ${maxFiles ? 'Attach up to ' + maxFiles + ' files. ' : ''}${
        maxSize ? 'Max ' + maxSize + ' bytes' : ''
      }
      `,
      fr: (maxSize: number, maxFiles: number) => `
      Faites glisser et déposez un fichier ici ou cliquez sur le bouton ci-dessous et choisissez un fichier à télécharger.
      ${maxFiles ? "Joindre jusqu'à " + maxFiles + ' fichiers. ' : ''}${
        maxSize ? 'Max ' + maxSize + ' bytes' : ''
      }
      `,
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
};
