/** Interface for the data generation map */
interface DataGenerationMap {
  [key: string]: {
    displayName: string;
    source: string;
    options?: any[] | null;
  };
}

/** Data generation map */
export const dataGenerationMap: DataGenerationMap = {
  boolean: {
    displayName: 'Yes/No (Boolean)',
    source: 'common.dataStudio.dataGeneration.map.boolean',
  },
  checkbox: {
    displayName: 'Checkboxes',
    source: 'common.dataStudio.dataGeneration.map.checkbox',
  },
  color: {
    displayName: 'Color',
    source: 'common.dataStudio.dataGeneration.map.color',
  },
  comment: {
    displayName: 'Comment',
    source: 'common.dataStudio.dataGeneration.map.text',
  },
  date: {
    displayName: 'Date',
    source: 'common.dataStudio.dataGeneration.map.date',
  },
  'datetime-local': {
    displayName: 'Date and Time',
    source: 'common.dataStudio.dataGeneration.map.datetimelocal',
  },
  dropdown: {
    displayName: 'Dropdown',
    source: 'common.dataStudio.dataGeneration.map.dropdown',
  },
  email: {
    displayName: 'Email',
    source: 'common.dataStudio.dataGeneration.map.email',
  },
  expression: {
    displayName: 'Expression (read-only)',
    source: 'common.dataStudio.dataGeneration.map.expression',
  },
  file: {
    displayName: 'File Upload',
    source: ' ',
  },
  geospatial: {
    displayName: 'Geospatial',
    source: 'common.dataStudio.dataGeneration.map.geospatial',
  },
  html: {
    displayName: 'HTML',
    source: ' ',
  },
  image: {
    displayName: 'Image',
    source: ' ',
  },
  matrix: {
    displayName: 'Single-Select Matrix',
    source: 'common.dataStudio.dataGeneration.map.matrix',
  },
  matrixdynamic: {
    displayName: 'Dynamic Matrix',
    source: 'common.dataStudio.dataGeneration.map.matrixdynamic',
  },
  matrixdropdown: {
    displayName: 'Multi-Select Matrix',
    source: 'common.dataStudio.dataGeneration.map.matrixdropdown',
  },
  month: {
    displayName: 'Month',
    source: 'common.dataStudio.dataGeneration.map.month',
  },
  multipletext: {
    displayName: 'Multiple Text',
    source: 'common.dataStudio.dataGeneration.map.multipletext',
  },
  number: {
    displayName: 'Number',
    source: 'common.dataStudio.dataGeneration.map.numeric',
  },
  owner: {
    displayName: 'Owner',
    source: 'common.dataStudio.dataGeneration.map.owner',
  },
  paneldynamic: {
    displayName: 'Panel Dynamic',
    source: 'common.dataStudio.dataGeneration.map.paneldynamic',
  },
  password: {
    displayName: 'Password',
    source: 'common.dataStudio.dataGeneration.map.password',
  },
  radiogroup: {
    displayName: 'Radio Button Group',
    source: 'common.dataStudio.dataGeneration.map.radiogroup',
  },
  range: {
    displayName: 'Range',
    source: 'common.dataStudio.dataGeneration.map.range',
  },
  resource: {
    displayName: 'Resource',
    source: 'common.dataStudio.dataGeneration.map.resource',
  },
  resources: {
    displayName: 'Resources',
    source: 'common.dataStudio.dataGeneration.map.resources',
  },
  tagbox: {
    displayName: 'Multi-Select Dropdown',
    source: 'common.dataStudio.dataGeneration.map.tagbox',
  },
  tel: {
    displayName: 'Phone Number',
    source: 'common.dataStudio.dataGeneration.map.tel',
  },
  text: {
    displayName: 'Text',
    source: 'common.dataStudio.dataGeneration.map.text',
  },
  time: {
    displayName: 'Time',
    source: 'common.dataStudio.dataGeneration.map.time',
  },
  url: {
    displayName: 'URL',
    source: 'common.dataStudio.dataGeneration.map.url',
  },
  users: {
    displayName: 'Users',
    source: 'common.dataStudio.dataGeneration.map.users',
  },
  week: {
    displayName: 'Week',
    source: 'common.dataStudio.dataGeneration.map.week',
  },
};
