import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PaletteControlComponent } from './palette-control.component';
import { PaletteControlModule } from './palette-control.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: PaletteControlComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        PaletteControlModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [],
    }),
  ],
  title: 'UI/Controls/Palette',
} as Meta;

/**
 * Default template of palette control.
 *
 * @param args story args
 * @returns story
 */
const TEMPLATE: StoryFn<PaletteControlComponent> = (args) => ({
  // template:
  //   '<shared-palette-control [formControl]="palette"></shared-palette-control>',
  props: {
    ...args,
    // palette: new FormControl(['red', 'blue']),
  },
});

/** Default list of colors */
const COLORS = [
  '#FF8C00',
  '#B0C4DE',
  '#ADD8E6',
  '#BC8F8F',
  '#DA70D6',
  '#CD5C5C',
  '#48D1CC',
  '#FF00FF',
  '#6495ED',
  '#FF0000',
];

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,

  args: {
    formControl: new UntypedFormControl(COLORS),
    colors: COLORS,
  },
};

/**
 * Disabled status story.
 */
export const DISABLED = {
  render: TEMPLATE,

  args: {
    formControl: new UntypedFormControl({ value: COLORS, disabled: true }),
  },
};
