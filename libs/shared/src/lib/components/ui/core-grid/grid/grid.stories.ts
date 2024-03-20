/* eslint-disable jsdoc/require-param-description */
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridComponent } from './grid.component';
import { GridModule } from './grid.module';
import { HttpClientModule } from '@angular/common/http';
import { GridService } from '../../../../services/grid/grid.service';
import { ApiProxyService } from '../../../../services/api-proxy/api-proxy.service';
import { RestService } from '../../../../services/rest/rest.service';
import {
  DEFAULT_LANGUAGE,
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateCompiler,
  TranslateLoader,
  TranslateParser,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  USE_STORE,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { DownloadService } from '../../../../services/download/download.service';
import { SnackbarService } from '@oort-front/ui';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
/**
 *
 */
export class TranslateHttpLoaderMock implements TranslateLoader {
  // eslint-disable-next-line jsdoc/require-returns, jsdoc/require-jsdoc
  getTranslation(): Observable<any> {
    const translation = { key: 'value' };
    return of(translation);
  }
}
// eslint-disable-next-line jsdoc/require-jsdoc
export class TranslateCompilerMock implements TranslateCompiler {
  // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/ban-types
  compile(value: string): string | Function {
    return value;
  }

  // eslint-disable-next-line jsdoc/require-description, jsdoc/require-returns, jsdoc/require-jsdoc
  compileTranslations(translations: any): any {
    return translations;
  }
}
// eslint-disable-next-line jsdoc/require-jsdoc
export class TranslateParseMock implements TranslateParser {
  // eslint-disable-next-line jsdoc/require-description, jsdoc/require-param, jsdoc/require-returns
  // eslint-disable-next-line @typescript-eslint/ban-types, jsdoc/require-jsdoc
  interpolate(expr: string | Function): string | undefined {
    return expr as string;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  getValue(target: any, key: string): any {
    return target[key];
  }
}
// eslint-disable-next-line jsdoc/require-jsdoc
export class MissingTranslationHandlerMock
  implements MissingTranslationHandler
{
  // eslint-disable-next-line jsdoc/require-jsdoc
  handle(params: MissingTranslationHandlerParams): any {
    return params.key;
  }
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const translateLoaderMock = () => new TranslateHttpLoaderMock();

// eslint-disable-next-line jsdoc/require-jsdoc
export const translateCompilerMock = () => new TranslateCompilerMock();

// eslint-disable-next-line jsdoc/require-jsdoc
export const translateParseMock = () => new TranslateParseMock();

// eslint-disable-next-line jsdoc/require-jsdoc
export const missingTranslationHandlerMock = () =>
  new MissingTranslationHandlerMock();

export default {
  component: GridComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [GridModule, HttpClientModule, BrowserAnimationsModule],
      providers: [
        {
          provide: 'environment',
          useValue: {},
        },
        GridService,
        ApiProxyService,
        RestService,
        TranslateService,
        TranslateStore,
        {
          provide: TranslateLoader,
          useFactory: translateLoaderMock,
        },
        {
          provide: TranslateCompiler,
          useFactory: translateCompilerMock,
        },
        {
          provide: TranslateParser,
          useFactory: translateParseMock,
        },
        {
          provide: MissingTranslationHandler,
          useFactory: missingTranslationHandlerMock,
        },
        { provide: USE_DEFAULT_LANG, useValue: 'en' },
        { provide: USE_STORE, useValue: {} },
        { provide: USE_EXTEND, useValue: {} },
        { provide: DEFAULT_LANGUAGE, useValue: 'en' },
        Apollo,
        DownloadService,
        SnackbarService,
        DashboardService,
      ],
    }),
  ],
  title: 'UI/Grid',
  argTypes: {},
} as Meta;

/**
 * Template factory for the GridComponent
 *
 * @param args Properties of the component
 * @returns The template
 */
const TEMPLATE: StoryFn<GridComponent> = (args) => ({
  template: `<div style="height: 400px"><shared-grid
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
    ></shared-grid></div>`,
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

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Default',

  args: {
    fields: DEFAULT_FIELDS,
    data: {
      data: DEFAULT_DATA,
      total: DEFAULT_DATA.length,
    },
    editable: true,
  },
};

/**
 * Empty story.
 */
export const EMPTY = {
  render: TEMPLATE,
  name: 'Empty',

  args: {
    fields: DEFAULT_FIELDS,
    data: {
      data: DEFAULT_DATA,
      total: DEFAULT_DATA.length,
    },
  },
};

/**
 * Error story.
 */
export const ERROR = {
  render: TEMPLATE,
  name: 'With error',

  args: {
    fields: DEFAULT_FIELDS,
    data: {
      data: [],
      total: 0,
    },
  },
};

/**
 * Loading story.
 */
export const LOADING = {
  render: TEMPLATE,
  name: 'Loading',

  args: {
    ...DEFAULT.args,
  },
};

/**
 * Fixed position story.
 */
export const FIXED = {
  render: TEMPLATE,
  name: 'Fixed size',

  args: {
    ...DEFAULT.args,
    resizable: false,
    reorderable: false,
    sortable: false,
  },
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

/**
 * With mutli select inputs.
 */
export const MULTI_SELECT_INPUTS = {
  render: TEMPLATE,
  name: 'With multi select inputs',

  args: {
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

/**
 * With complex inputs.
 */
export const COMPLEX_INPUTS = {
  render: TEMPLATE,
  name: 'With complex inputs',

  args: {
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
  },
};
