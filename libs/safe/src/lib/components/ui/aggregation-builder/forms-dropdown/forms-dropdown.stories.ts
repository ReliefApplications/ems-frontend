import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { BehaviorSubject } from 'rxjs';
import { SafeFormsDropdownComponent } from './forms-dropdown.component';
import { SafeFormsDropdownModule } from './forms-dropdown.module';
import { Form } from '../../../../models/form.model';
import { StorybookTranslateModule } from '../../../storybook-translate/storybook-translate-module';
import { UntypedFormControl } from '@angular/forms';
import { delay } from 'rxjs/operators';

export default {
  component: SafeFormsDropdownComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SafeFormsDropdownModule,
        BrowserAnimationsModule,
        StorybookTranslateModule,
      ],
    }),
  ],
  title: 'UI/Aggregation builder/Forms dropdown',
  args: {
    currentForms: [],
    filteredForms: [],
  },
} as Meta;

/**
 * Template used by storybook to display the component.
 *
 * @param args story arguments
 * @returns storybook template
 */
const TEMPLATE: StoryFn<SafeFormsDropdownComponent> = (args) => ({
  template:
    '<safe-forms-dropdown [forms$]=forms$ [sourceControl]=sourceControl></safe-forms-dropdown>',
  props: {
    ...args,
  },
});

/**
 * List of forms for testing.
 */
const DEFAULT_FORMS = [
  {
    id: '608fcf37425fcd001d46ef40',
    name: 'Partners Capacity Survey',
    core: false,
    resource: undefined,
  },
  {
    id: '608fcfb5425fcd001d46ef79',
    name: 'Staff Structure',
    core: true,
    resource: { id: '608fcfb5425fcd001d46ef78' },
  },
  {
    id: '613b6c052921406adbfb54bd',
    name: 'T Advanced feature',
    core: false,
    resource: undefined,
  },
  {
    id: '608a7ab942eaf0001edb5d64',
    name: 'Information',
    core: true,
    resource: { id: '608a7ab942eaf0001edb5d63' },
  },
  {
    id: '608a7d2742eaf0001edb5d6c',
    name: 'Signals',
    core: true,
    resource: { id: '608a7d2742eaf0001edb5d6b' },
  },
  {
    id: '60b0c49606bd35001e6510c3',
    name: 'Add new action',
    core: true,
    resource: { id: '60b0c49606bd35001e6510c2' },
  },
  {
    id: '60f8260208658026b50d0a20',
    name: 'Information COVID IMST',
    core: false,
    resource: { id: '608a7ab942eaf0001edb5d63' },
  },
  {
    id: '610aa6428ce0724639d69789',
    name: 'Signal EURO',
    core: false,
    resource: { id: '608a7d2742eaf0001edb5d6b' },
  },
  {
    id: '610d28e98ce0723184d71ba6',
    name: 'Signal COVID IMST',
    core: false,
    resource: { id: '608a7d2742eaf0001edb5d6b' },
  },
  {
    id: '610d30818ce07229d4d72adf',
    name: 'Signal HQ',
    core: false,
    resource: { id: '608a7d2742eaf0001edb5d6b' },
  },
];

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Default',

  args: {
    forms$: new BehaviorSubject<Form[]>(DEFAULT_FORMS)
      .asObservable()
      .pipe(delay(500)),
    sourceControl: new UntypedFormControl(''),
  },
};

/**
 * Initial source story.
 */
export const INITIAL_SOURCE = {
  render: TEMPLATE,
  name: 'Initial source',

  args: {
    ...DEFAULT.args,
    sourceControl: new UntypedFormControl('613b6c052921406adbfb54bd'),
  },
};
