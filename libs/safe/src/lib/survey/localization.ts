import { set } from 'lodash';
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
 * @param Survey Survey library
 */
export const initLocalization = () => {
  for (const item of SURVEY_LOCALIZABLE_STRINGS) {
    for (const [locale, value] of Object.entries(item.locales)) {
      set(surveyLocalization.locales, `${locale}.oort:${item.key}`, value);
    }
  }
};
