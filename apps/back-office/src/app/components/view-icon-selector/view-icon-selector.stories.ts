import {
  moduleMetadata,
  Meta,
  StoryFn,
  applicationConfig,
} from '@storybook/angular';
import { ViewIconSelectorComponent } from './view-icon-selector.component';
import { StorybookTranslateModule } from '../../../../.storybook/storybook-translate.module';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { APP_INITIALIZER } from '@angular/core';
import { FormControl } from '@angular/forms';

type Story = ViewIconSelectorComponent;

/** Provided environment */
const environment = {
  theme: {
    primary: '#6f51ae',
  },
};

/**
 * App initializer
 *
 * @returns callback method when initializing app
 */
const initializeApp = (): any => () => {
  // Add fa icon font to check in the application
  library.add(fas, fab);
};

export default {
  title: 'Components/Icon Selector',
  tags: ['autodocs'],
  component: ViewIconSelectorComponent,
  decorators: [
    moduleMetadata({
      imports: [ViewIconSelectorComponent, StorybookTranslateModule],
      providers: [{ provide: 'environment', useValue: environment }],
    }),
    applicationConfig({
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: initializeApp,
          multi: true,
        },
      ],
    }),
  ],
} as Meta<Story>;

/**
 * Default story
 *
 * @returns StoryFn
 */
export const Default: StoryFn<Story> = () => {
  return {
    props: {
      iconControl: new FormControl(),
    },
  };
};

/**
 * Story with default value
 *
 * @returns StoryFn
 */
export const WithValue: StoryFn<Story> = () => {
  return {
    props: {
      iconControl: new FormControl('people-group'),
    },
  };
};
