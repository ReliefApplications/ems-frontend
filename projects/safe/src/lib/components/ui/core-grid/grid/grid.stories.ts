import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafeGridComponent } from './grid.component';
import { SafeGridModule } from './grid.module';
import { HttpClientModule } from '@angular/common/http';

export default {
  component: SafeGridComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeGridModule, HttpClientModule, BrowserAnimationsModule],
      providers: [
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    }),
  ],
  title: 'UI/Grid',
  argTypes: {},
} as Meta;

/**
 * Template factory for the SafeGridComponent
 *
 * @param args Properties of the component
 * @returns The template
 */
const TEMPLATE: Story<SafeGridComponent> = (args) => ({
  template: `<div style="height: 400px"><safe-grid
        [loading]="loading"
        [error]="error"
        [fields]="fields"
        [data]="data"
        [resizable]="resizable"
        [reorderable]="reorderable"
        [sortable]="sortable"
        [filterable]="filterable"
        [selectable]="selectable"
        [editable]="editable"
        [rowActions]="rowActions"
    ></safe-grid></div>`,
  props: {
    ...args,
  },
});

/** Mock data for the compoent */
const DEFAULT_DATA = [
  {
    id: '1',
    text: 'dummy text',
    // eslint-disable-next-line max-len
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non lacus non magna tempus bibendum vel vitae nisi. Maecenas vel felis sem.',
    bool: true,
    color: 'red',
    dropdown: 1,
    radiogroup: 2,
    date: new Date(),
    file: [
      {
        name: 'file',
      },
    ],
    canUpdate: true,
  },
  {
    id: '2',
    text: 'dummy text 2',
    // eslint-disable-next-line max-len
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non lacus non magna tempus bibendum vel vitae nisi. Maecenas vel felis sem.',
    bool: false,
    color: 'blue',
    dropdown: 2,
    radiogroup: 1,
    date: new Date(),
    file: [
      {
        name: 'file',
      },
    ],
    canUpdate: true,
  },
];

/** Mock fields for the component */
const DEFAULT_FIELDS = [
  {
    title: 'Text',
    name: 'text',
    type: 'text',
    filter: 'text',
    editor: 'text',
    meta: {
      type: 'text',
    },
  },
  {
    title: 'Comment',
    name: 'comment',
    type: 'comment',
    filter: 'text',
    editor: 'text',
    meta: {
      type: 'text',
    },
  },
  {
    title: 'Boolean',
    name: 'bool',
    type: 'boolean',
    filter: 'boolean',
    editor: 'boolean',
    meta: {
      type: 'boolean',
    },
  },
  {
    title: 'Color',
    name: 'color',
    type: 'color',
    filter: null,
    editor: 'text',
    meta: {
      type: 'color',
    },
  },
  {
    title: 'Dropdown',
    name: 'dropdown',
    type: 'dropdown',
    filter: 'dropdown',
    editor: 'text',
    meta: {
      type: 'dropdown',
      choices: [
        {
          value: 1,
          text: 'Option 1',
        },
        {
          value: 2,
          text: 'Option 2',
        },
      ],
    },
  },
  {
    title: 'Radiogroup',
    name: 'radiogroup',
    type: 'radiogroup',
    filter: 'radiogroup',
    editor: 'text',
    meta: {
      type: 'radiogroup',
      choices: [
        {
          value: 1,
          text: 'Option 1',
        },
        {
          value: 2,
          text: 'Option 2',
        },
      ],
    },
  },
  {
    title: 'Date',
    name: 'date',
    type: 'date',
    filter: 'date',
    format: 'dd/MM/yy',
    editor: 'date',
    meta: {
      type: 'date',
    },
  },
  {
    title: 'File',
    name: 'file',
    type: 'JSON',
    filter: null,
    editor: null,
    meta: {
      type: 'file',
    },
  },
];

/** Exoprt a template with mock properties */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  fields: DEFAULT_FIELDS,
  data: {
    data: DEFAULT_DATA,
    total: DEFAULT_DATA.length,
  },
  editable: true,
};

/** Export an empty template with mock properties */
export const EMPTY = TEMPLATE.bind({});
EMPTY.storyName = 'Empty';
EMPTY.args = {
  fields: DEFAULT_FIELDS,
  data: {
    data: DEFAULT_DATA,
    total: DEFAULT_DATA.length,
  },
};

/** Export a template with invalid properties and an error */
export const ERROR = TEMPLATE.bind({});
ERROR.storyName = 'With error';
ERROR.args = {
  fields: DEFAULT_FIELDS,
  error: true,
  data: {
    data: [],
    total: 0,
  },
};

/** Export a template with loading data */
export const LOADING = TEMPLATE.bind({});
LOADING.storyName = 'Loading';
LOADING.args = {
  ...DEFAULT.args,
  loading: true,
};

/** Export a template with a size fixed */
export const FIXED = TEMPLATE.bind({});
FIXED.storyName = 'Fixed size';
FIXED.args = {
  ...DEFAULT.args,
  resizable: false,
  reorderable: false,
  sortable: false,
};

/** Mock data for multi-select field */
const MULTI_SELECT_DATA = [
  {
    checkbox: [1, 2],
    tagbox: [1, 2],
    users: [1, 2],
    canUpdate: true,
  },
];

/** Export template with multi-select data */
export const MULTI_SELECT_INPUTS = TEMPLATE.bind({});
MULTI_SELECT_INPUTS.storyName = 'With multi select inputs';
MULTI_SELECT_INPUTS.args = {
  ...DEFAULT.args,
  fields: [
    {
      title: 'Checkbox',
      name: 'checkbox',
      type: 'JSON',
      editor: '',
      meta: {
        type: 'checkbox',
        choices: [
          {
            value: 1,
            text: 'Option 1',
          },
          {
            value: 2,
            text: 'Option 2',
          },
        ],
      },
    },
    {
      title: 'Tagbox',
      name: 'tagbox',
      type: 'JSON',
      editor: '',
      meta: {
        type: 'tagbox',
        choices: [
          {
            value: 1,
            text: 'Option 1',
          },
          {
            value: 2,
            text: 'Option 2',
          },
        ],
      },
    },
    {
      title: 'Users',
      name: 'users',
      type: 'JSON',
      editor: '',
      meta: {
        type: 'users',
        choices: [
          {
            value: 1,
            text: 'User 1',
          },
          {
            value: 2,
            text: 'User 2',
          },
        ],
      },
    },
  ],
  data: {
    data: MULTI_SELECT_DATA,
    total: MULTI_SELECT_DATA.length,
  },
};

/** Mock data which is more complex */
const COMPLEX_DATA = [
  {
    multipletext: {
      first: 'first text',
      second: 'second text',
    },
    matrix: {
      first: 'first',
      second: 'second',
    },
    matrixdropdown: {
      first: {
        first: 'first',
        second: 'second',
      },
      second: {
        first: 'first',
        second: 'second',
      },
    },
    matrixdynamic: [
      {
        first: 'first',
        second: 'second',
      },
      {
        first: 'first',
        second: 'second',
      },
    ],
  },
];

/** Export template with more complex data */
export const COMPLEX_INPUTS = TEMPLATE.bind({});
COMPLEX_INPUTS.storyName = 'With complex inputs';
COMPLEX_INPUTS.args = {
  ...DEFAULT.args,
  fields: [
    {
      title: 'Multiple text',
      name: 'multipletext',
      type: 'JSON',
      meta: {
        type: 'multipletext',
        columns: [
          {
            label: 'First',
            name: 'first',
          },
          {
            label: 'Second',
            name: 'second',
          },
        ],
      },
    },
    {
      title: 'Matrix',
      name: 'matrix',
      type: 'JSON',
      meta: {
        type: 'matrix',
        rows: [
          {
            label: '1st',
            name: 'first',
          },
          {
            label: '2nd',
            name: 'second',
          },
        ],
        columns: [
          {
            label: 'First',
            name: 'first',
          },
          {
            label: 'Second',
            name: 'second',
          },
          {
            label: 'Third',
            name: 'third',
          },
        ],
      },
    },
    {
      title: 'Matrix Dropdown',
      name: 'matrixdropdown',
      type: 'JSON',
      meta: {
        type: 'matrixdropdown',
        rows: [
          {
            label: '1st',
            name: 'first',
          },
          {
            label: '2nd',
            name: 'second',
          },
        ],
        columns: [
          {
            label: 'First',
            name: 'first',
            type: 'dropdown',
          },
          {
            label: 'Second',
            name: 'second',
            type: 'radiogroup',
          },
        ],
      },
    },
    {
      title: 'Matrix Dynamic',
      name: 'matrixdynamic',
      type: 'JSON',
      meta: {
        type: 'matrixdynamic',
        columns: [
          {
            label: 'First',
            name: 'first',
            type: 'dropdown',
          },
          {
            label: 'Second',
            name: 'second',
            type: 'radiogroup',
          },
        ],
      },
    },
  ],
  data: {
    data: COMPLEX_DATA,
    total: COMPLEX_DATA.length,
  },
};
