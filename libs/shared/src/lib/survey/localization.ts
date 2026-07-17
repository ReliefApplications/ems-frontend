import { surveyLocalization } from 'survey-core';
import { editorLocalization } from 'survey-creator-core';

/**
 * Build the localized file limitations text for a file question, from the
 * locale-specific strings.
 *
 * @param strings Locale-specific strings
 * @param strings.intro Drag and drop instruction
 * @param strings.maxFiles Max number of files sentence, built from the limit
 * @param strings.max 'Max' word
 * @param strings.mb Megabytes unit
 * @param strings.kb Kilobytes unit
 * @returns Function building the text from the question
 */
const fileLimitations =
  (strings: {
    intro: string;
    maxFiles: (count: number) => string;
    max: string;
    mb: string;
    kb: string;
  }) =>
  (question: any) => {
    const allowMultiple = question.getPropertyValue('allowMultiple');
    const maxSize = question.getPropertyValue('maxSize');
    const maxFiles = allowMultiple
      ? question.getPropertyValue('allowedFileNumber')
      : null;
    const sizeOnKB = Math.floor(maxSize / 1024);
    const sizeOnMB = Math.floor(sizeOnKB / 1024);
    const size =
      sizeOnMB >= 1 ? `${sizeOnMB} ${strings.mb}` : `${sizeOnKB} ${strings.kb}`;
    return `${strings.intro}
      ${maxFiles ? strings.maxFiles(maxFiles) : ''}${
      maxSize ? `${strings.max} ${size}` : ''
    }
      `;
  };

/** Available localizable strings, for survey */
const SURVEY_LOCALIZABLE_STRINGS = [
  {
    key: 'addNewRecord',
    locales: {
      en: 'Add new record',
      fr: 'Ajouter un enregistrement',
      ua: 'Додати новий запис',
    },
  },
  {
    key: 'displayOnly',
    locales: {
      en: 'Display only',
      fr: 'Affichage seul',
      ua: 'Тільки перегляд',
    },
  },
  {
    key: 'onSelect',
    locales: {
      en: 'On select',
      fr: 'A la sélection',
      ua: 'При виборі',
    },
  },
  {
    key: 'fileLimitations',
    locales: {
      en: fileLimitations({
        intro:
          'Drag and drop a file here or click the button below and choose a file to upload.',
        maxFiles: (count) => `Attach up to ${count} files. `,
        max: 'Max',
        mb: 'MB',
        kb: 'KB',
      }),
      fr: fileLimitations({
        intro:
          'Faites glisser et déposez un fichier ici ou cliquez sur le bouton ci-dessous et choisissez un fichier à télécharger.',
        maxFiles: (count) => `Joindre jusqu'à ${count} fichiers. `,
        max: 'Max',
        mb: 'MB',
        kb: 'KB',
      }),
      ua: fileLimitations({
        intro:
          'Перетягніть файл сюди або натисніть кнопку нижче, щоб вибрати файл для завантаження.',
        maxFiles: (count) => `Додайте до ${count} файлів. `,
        max: 'Максимум',
        mb: 'МБ',
        kb: 'КБ',
      }),
    },
  },
  {
    key: 'search',
    locales: {
      en: 'Search',
      fr: 'Rechercher',
      ua: 'Пошук',
    },
  },
  {
    key: 'edit',
    locales: {
      en: 'Edit',
      fr: 'Éditer',
      ua: 'Редагувати',
    },
  },
];

/**
 * Help text for the title, description & tooltip properties in the survey
 * creator property grid, explaining dynamic text support, per creator locale.
 */
const DYNAMIC_TEXT_HELP: Record<string, string> = {
  en:
    'Supports dynamic text: any {placeholder} is replaced at runtime by the value of a question, a variable ({user.name}, {user.roles}…) or a calculated value.\n\n' +
    "• For a conditional label, define a calculated value, e.g. myLabel = iif(id() = 'unknown id', 'New record', 'Existing record'), and write {myLabel} here.\n" +
    '• To translate a conditional label, create one calculated value per language and reference the matching one in each translated title.',
  fr:
    "Supporte le texte dynamique : tout {placeholder} est remplacé à l'exécution par la valeur d'une question, d'une variable ({user.name}, {user.roles}…) ou d'une valeur calculée.\n\n" +
    "• Pour un libellé conditionnel, définissez une valeur calculée, ex. monLibelle = iif(id() = 'unknown id', 'Nouvel enregistrement', 'Enregistrement existant'), et écrivez {monLibelle} ici.\n" +
    '• Pour traduire un libellé conditionnel, créez une valeur calculée par langue et référencez la bonne dans chaque titre traduit.',
  uk:
    'Підтримує динамічний текст: будь-який {placeholder} під час виконання замінюється значенням питання, змінної ({user.name}, {user.roles}…) або обчислюваного значення.\n\n' +
    "• Для умовного підпису визначте обчислюване значення, напр. myLabel = iif(id() = 'unknown id', 'Новий запис', 'Наявний запис'), і напишіть тут {myLabel}.\n" +
    '• Щоб перекласти умовний підпис, створіть окреме обчислюване значення для кожної мови та посилайтеся на відповідне в кожному перекладеному заголовку.',
};

/**
 * Assign the dynamic text help to the title, description & tooltip properties
 * of the given creator locale.
 *
 * @param editorLocale Survey creator locale strings object
 * @param locale Locale code, to pick the help text
 */
const addDynamicTextHelp = (editorLocale: any, locale: string) => {
  if (!editorLocale.pehelp) editorLocale.pehelp = {};
  editorLocale.pehelp.title = DYNAMIC_TEXT_HELP[locale];
  editorLocale.pehelp.description = DYNAMIC_TEXT_HELP[locale];
  editorLocale.pehelp.tooltip = DYNAMIC_TEXT_HELP[locale];
};

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
  if (editorEn) {
    if (editorEn.pehelp) {
      editorEn.pehelp.onSelect =
        'Define the mapping to pre-fill form questions from selected record.\n\n' +
        '• **On the left (Key):** The name of the question in *this* form (e.g., "country").\n' +
        '• **On the right (Value):** Expression running on selected *data record* (e.g., "{region}", "length({regions})").';
    }
    addDynamicTextHelp(editorEn, 'en');
    if (editorEn.pe) {
      if (!editorEn.pe.tabs) editorEn.pe.tabs = {};
      editorEn.pe.tabs.translation = 'Translation';
      editorEn.pe.translateField = 'Translate from question';
      editorEn.pe.translateTo = 'Language to translate to';
      editorEn.pe.translateIf = 'Translate if';
    }
  }

  const editorFr = editorLocalization.getLocale('fr');
  if (editorFr && editorFr !== editorEn) {
    addDynamicTextHelp(editorFr, 'fr');
    if (editorFr.pe) {
      if (!editorFr.pe.tabs) editorFr.pe.tabs = {};
      editorFr.pe.tabs.translation = 'Traduction';
      editorFr.pe.translateField = 'Traduire à partir de la question';
      editorFr.pe.translateTo = 'Langue de traduction';
      editorFr.pe.translateIf = 'Traduire si';
    }
  }

  const editorUk = editorLocalization.getLocale('uk');
  if (editorUk && editorUk !== editorEn) {
    addDynamicTextHelp(editorUk, 'uk');
    if (editorUk.pe) {
      if (!editorUk.pe.tabs) editorUk.pe.tabs = {};
      editorUk.pe.tabs.translation = 'Переклад';
      editorUk.pe.translateField = 'Перекласти з питання';
      editorUk.pe.translateTo = 'Мова для перекладу';
      editorUk.pe.translateIf = 'Перекласти якщо';
    }
  }
};
