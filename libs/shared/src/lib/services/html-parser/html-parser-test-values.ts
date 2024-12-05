import { InputType, QuestionType } from '../form-helper/form-helper.service';

/** Not number value examples */
export const notNumberValueExamples = [
  'k',
  '?',
  '/',
  '%%',
  '#',
  '&(',
  ')',
  '|\\',
  '.',
  ',',
  ';',
];

/**
 * Hardcoded values for round func test cases
 * - [initial value, expected value, precision level]
 */
export const roundValues = {
  regular: [
    ['1.49', '1'],
    ['1.49', '1.5', '1'],
  ],
  up: [
    ['1.49', '2'],
    ['1.511', '1.52', '2'],
  ],
  down: [
    ['1.49', '1'],
    ['1.555', '1.55', '2'],
  ],
};
/**
 * Hardcoded values for percentage func test cases
 * - [initial value, total value, expected value, precision level]
 */
export const percentageValues = [
  ['50.04', '100', '50.04%'],
  ['5', '1', '500%', '0'],
  ['50.6', '100', '51%', '0'],
];
/**
 * Hardcoded values for max/min func test cases
 * - [expected value, ...values]
 */
export const maxMinValues = {
  max: [
    ['1.501', '1', '1.01', '1.500', '1.501'],
    ['1.49', '1.48', '1.0', '1', '0.54'],
  ],
  min: [
    ['1', '1', '1.01', '1.500', '1.501'],
    ['0.54', '1.48', '1.0', '1', '0.54'],
  ],
};
/** Custom date formats */
export const customDateFormats = [
  { format: 'yyyy-MM-dd', result: `2024-11-26` }, // 2024-11-26: ISO 8601 format date
  { format: 'dd/MM/yyyy', result: `26/11/2024` }, // 26/11/2024: Day-first numeric format
  { format: 'MM/dd/yyyy', result: `11/26/2024` }, // 11/26/2024: Month-first numeric format
  {
    format: 'EEEE, MMMM d, yyyy',
    result: `Tuesday, November 26, 2024`,
  }, // Tuesday, November 26, 2024: Full day name, month name, day, year
  {
    format: 'MMM d, y, h:mm a',
    result: `Nov 26, 2024, 12:00 PM`,
  }, // Nov 26, 2024, 12:00 PM: Short month name, day, year, 12-hour time
  {
    format: "MMMM d, y 'at' h:mm a",
    result: `November 26, 2024 at 12:00 PM`,
  }, // November 26, 2024 at 12:00 PM: Full month, day, year with literal text
  {
    format: 'yyyy/MM/dd HH:mm:ss Z',
    result: `2024/11/26 12:00:00 +0000`,
  }, // 2024/11/26 1:00:00 +0000: ISO-like with timezone offset
  {
    format: 'yyyy-MM-ddTHH:mm:ss',
    result: `2024-11-26T12:00:00`,
  }, // 2024-11-26T1:00:00: ISO 8601 with "T" separator for time
  { format: 'hh:mm a', result: `12:00 PM` }, // 1:00 PM: 12-hour time with AM/PM
  { format: 'HH:mm:ss', result: `12:00:00` }, // 1:00:00: 24-hour time with seconds
  { format: 'MMMM d', result: `November 26` }, // November 26: Full month name and day (no year)
  { format: 'E, MMM dd yyyy', result: `Tue, Nov 26 2024` }, // Tue, Nov 26 2024: Short day name, short month, day, year
  { format: 'yyyy MMMM dd', result: `2024 November 26` }, // 2024 November 26: Year, full month name, day
  {
    format: 'yyyy-MM-dd HH:mm',
    result: `2024-11-26 12:00`,
  }, // 2024-11-26 1:00: ISO-like date with hours and minutes
  { format: 'dd-MMM-yyyy', result: `26-Nov-2024` }, // 26-Nov-2024: Day, short month name, year
  { format: 'MM/yyyy', result: `11/2024` }, // 11/2024: Month and year only
  {
    format: 'HH:mm:ss.SSS',
    result: `12:00:00.000`,
  }, // 1:00:00.000: 24-hour time with milliseconds
  {
    format: 'EEE, d MMM yyyy HH:mm:ss Z',
    result: `Tue, 26 Nov 2024 12:00:00 +0000`,
  }, // Tue, 26 Nov 2024 1:00:00 +0000: RFC 2822 format (emails)
  {
    format: 'yyyy-MM-dd HH:mm:ss zzzz',
    result: `2024-11-26 12:00:00 GMT+00:00`,
  }, // 2024-11-26 1:00:00 GMT+00:00: Full timezone name
  {
    format: 'h:mm:ss a z',
    result: `12:00:00 PM GMT+0`,
  }, // 12:00:00 PM GMT: 12-hour time with seconds and timezone abbreviation
  { format: 'G yyyy-MM-dd', result: 'AD 2024-11-26' }, // AD 2024-11-26: Era designator (AD/BC), year, month, day
];
/** Predefined formats */
export const predefinedDateFormats = [
  {
    format: 'short',
    result: `11/26/24, 12:00 PM`,
  }, // Example: 11/26/24, 12:00 PM
  {
    format: 'medium',
    result: `Nov 26, 2024, 12:00:00 PM`,
  }, // Example: Nov 26, 2024, 12:00:00 PM
  {
    format: 'long',
    result: `November 26, 2024 at 12:00:00 PM GMT+0`,
  }, // Example: November 26, 2024 at 12:00:00 PM GMT+0
  {
    format: 'full',
    result: `Tuesday, November 26, 2024 at 12:00:00 PM GMT+00:00`,
  }, // Example: Tuesday, November 26, 2024 at 12:00:00 PM GMT+00:00
  { format: 'shortDate', result: '11/26/24' }, // Example: 11/26/24
  { format: 'mediumDate', result: 'Nov 26, 2024' }, // Example: Nov 26, 2024
  { format: 'longDate', result: 'November 26, 2024' }, // Example: November 26, 2024
  {
    format: 'fullDate',
    result: 'Tuesday, November 26, 2024',
  }, // Example: Tuesday, November 26, 2024
  { format: 'shortTime', result: `12:00 PM` }, // Example: 12:00 PM
  {
    format: 'mediumTime',
    result: `12:00:00 PM`,
  }, // Example: 12:00:00 PM
  {
    format: 'longTime',
    result: `12:00:00 PM GMT+0`,
  }, // Example: 12:00:00 PM GMT
  {
    format: 'fullTime',
    result: `12:00:00 PM GMT+00:00`,
  }, // Example: 12:00:00 PM GMT+00:00
];
/** Html with calc functions */
export const calcFormatElement = {
  before: `
  <p>{{calc.round( 9.5 ; 1 )}}</p>
  <p>{{calc.roundup( 9.5 ; 1 )}}</p>
  <p>{{calc.rounddown( 9.5 ; 1 )}}</p>
  <p>{{calc.percentage( 5 ; 10 ; 0 )}}</p>
  <p>{{calc.min( 1 ; 2 ; 3 )}}</p>
  <p>{{calc.max( 3 ; 2 ; 1 )}}</p>
  <p>{{calc.date( Tuesday, November 26, 2024 ; shortDate )}}</p>
  `,
  after: `
  <p>9.5</p>
  <p>9.5</p>
  <p>9.5</p>
  <p>50%</p>
  <p>1</p>
  <p>3</p>
  <p>11/26/24</p>
  `,
};
/** Aggregations data for testing */
export const optionsAggregation = {
  '59ac6544-6bee-4099-84f6-7d0c6324cb46': {
    items: [
      {
        count: 1,
        property_to_check: 'societal',
        property_to_also_check: 'Published',
      },
      {
        count: 2,
        property_to_check: 'product',
        property_to_also_check: 'Published',
      },
      {
        count: 302,
        property_to_check: 'infectious',
        property_to_also_check: 'Published',
      },
      {
        count: 1,
        property_to_check: 'chemical',
        property_to_also_check: 'Published',
      },
      {
        count: 3,
        property_to_check: 'animal',
        property_to_also_check: 'Published',
      },
      {
        count: 20,
        property_to_check: 'zoonosis',
        property_to_also_check: 'Published',
      },
      {
        count: 3,
        property_to_check: 'disaster',
        property_to_also_check: 'Published',
      },
      {
        count: 6,
        property_to_check: 'undetermined',
        property_to_also_check: 'Published',
      },
      {
        count: 1,
        property_to_check: 'food safety',
        property_to_also_check: 'Published',
      },
    ],
    totalCount: 9,
  },
  '2fa51225-02c9-4ef8-9bc2-0ef5df3638b1': {
    items: [
      {
        count: 1,
        property_to_check: 'societal_income',
        property_to_also_check: 'Pending',
      },
      {
        count: 2,
        property_to_check: 'product_income',
        property_to_also_check: 'Pending',
      },
      {
        count: 102,
        property_to_check: 'infectious_income',
        property_to_also_check: 'Pending',
      },
      {
        count: 1,
        property_to_check: 'chemical_income',
        property_to_also_check: 'Pending',
      },
      {
        count: 3,
        property_to_check: 'animal_income',
        property_to_also_check: 'Pending',
      },
      {
        count: 20,
        property_to_check: 'zoonosis_income',
        property_to_also_check: 'Pending',
      },
      {
        count: 3,
        property_to_check: 'disaster_income',
        property_to_also_check: 'Pending',
      },
      {
        count: 6,
        property_to_check: 'undetermined_income',
        property_to_also_check: 'Pending',
      },
      {
        count: 1,
        property_to_check: 'food safety_income',
        property_to_also_check: 'Pending',
      },
    ],
    totalCount: 19,
  },
};

/**
 * Html with aggregations
 *
 * Results removes all \n as they'll be added from tailwind
 */
export const aggregationFormatElement = {
  before: `
<div>Infectious count 1</div>
<div>{{calc.max({{aggregation.59ac6544-6bee-4099-84f6-7d0c6324cb46.$.items[?(@.property_to_check=="infectious")].count}};0)}}</div>
<div>Infectious count 2</div>
<div>{{calc.max({{aggregation.2fa51225-02c9-4ef8-9bc2-0ef5df3638b1.$.items[?(@.property_to_check=="infectious_income")].count}};0)}}</div>
<div>Total count 1</div>
<div>{{aggregation.59ac6544-6bee-4099-84f6-7d0c6324cb46.$.totalCount}}</div>
<div>Total count 2</div>
<div>{{aggregation.2fa51225-02c9-4ef8-9bc2-0ef5df3638b1.$.totalCount}}</div>
  `,
  after: `<div>Infectious count 1</div><div>302</div><div>Infectious count 2</div><div>102</div><div>Total count 1</div><div>9</div><div>Total count 2</div><div>19</div>  `,
};

/**
 * Html with data
 *
 * Results removes all \n as they'll be added from tailwind
 */
export const dataFormatElement = {
  before: `
<p>{{data.id}}</p>
<p>{{data.status}}</p>
<p>{{data.title}}</p>
<p>{{data.description}}</p>
<p>{{data.check_box}}</p>
<p>{{data.createdAt}}</p>
<p>{{data.modifiedAt}}</p>
 `,
  after: `<p>66fa9502760ab688bf8508e9s</p><p>Published</p><p>I can't believe this is a title</p><p>Super duper dubi dat gua trikili dup description</p><p><input type="checkbox" style="margin: 0; height: 16px; width: 16px;" checked disabled></input></p><p><span style=''>9/28/2024, 0:21 PM</span></p><p><span style=''>9/30/2024</span></p> `,
};
/** Record data */
export const optionsData = {
  __typename: 'TestsMockData',
  id: '66fa9502760ab688bf8508e9s',
  status: 'Published',
  title: "I can't believe this is a title",
  description: 'Super duper dubi dat gua trikili dup description',
  check_box: true,
  modifiedAt: '2024-09-30T12:21:21.498Z',
  createdAt: '2024-09-28T12:21:21.498Z',
};
/** Option data fields metadata to inject */
export const optionFields = [
  {
    name: 'modifiedAt',
    type: InputType.DATE,
    kind: 'SCALAR',
    label: 'Modified At',
    width: null,
    format: null,
    __typename: 'FieldMetaData',
  },
  {
    name: 'createdAt',
    type: InputType.DATETIME,
    __typename: 'FieldMetaData',
  },
  {
    name: 'description',
    type: QuestionType.TEXT,
    kind: 'SCALAR',
    label: 'Description',
    width: null,
    format: null,
    __typename: 'FieldMetaData',
  },
  {
    name: 'status',
    type: QuestionType.DROPDOWN,
    kind: 'SCALAR',
    label: 'Status',
    width: null,
    format: null,
    __typename: 'FieldMetaData',
  },
  {
    name: 'title',
    type: QuestionType.TEXT,
    __typename: 'FieldMetaData',
  },
  {
    name: 'id',
    type: QuestionType.TEXT,
    kind: 'SCALAR',
    label: 'Id',
    width: null,
    format: null,
    __typename: 'FieldMetaData',
  },
  {
    name: 'check_box',
    type: QuestionType.BOOLEAN,
    __typename: 'FieldMetaData',
  },
];
