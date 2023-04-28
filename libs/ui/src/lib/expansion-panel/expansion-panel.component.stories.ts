import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { ExpansionPanelComponent } from './expansion-panel.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

type PanelOption = {
  title: string;
  expanded: boolean;
  text: string;
};

export default {
  title: 'ExpansionPanelComponent',
  component: ExpansionPanelComponent,
  argTypes: {
    title: {
      control: 'text',
    },
    displayIcon: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    expanded: {
      control: 'boolean',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CdkAccordionModule, BrowserAnimationsModule],
    }),
  ],
} as Meta<ExpansionPanelComponent>;

/**
 *
 */
const panelOptions: PanelOption[] = [
  {
    title: 'Item 1',
    expanded: true,
    text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis excepturi incidunt ipsum deleniti labore, tempore non nam doloribus blanditiis veritatis illo autem iure aliquid ullam rem tenetur deserunt velit culpa?',
  },
  {
    title: 'Item 2',
    expanded: false,
    text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis excepturi incidunt ipsum deleniti labore, tempore non nam doloribus blanditiis veritatis illo autem iure aliquid ullam rem tenetur deserunt velit culpa?',
  },
  {
    title: 'Item 3',
    expanded: false,
    text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis excepturi incidunt ipsum deleniti labore, tempore non nam doloribus blanditiis veritatis illo autem iure aliquid ullam rem tenetur deserunt velit culpa?',
  },
];
/**
 * Template expansion panel group
 *
 * @param {ExpansionPanelComponent} args args
 * @returns ExpansionPanelComponent
 */
const Template: StoryFn<ExpansionPanelComponent> = (
  args: ExpansionPanelComponent
) => {
  return {
    component: ExpansionPanelComponent,
    template: `
      <cdk-accordion>
        <ui-expansion-panel 
          *ngFor="let panel of panelOptions; let i = index" 
          [disabled]="${args.disabled}" 
          [displayIcon]="'${args.displayIcon}'" 
          [expanded]="panel.expanded"
          [title]="panel.title"
          [index]="i"
        >
          <ng-container ngProjectAs="text">{{panel.text}}</ng-container>
        </ui-expansion-panel>
      </cdk-accordion>
    `,
    props: {
      ...args,
      panelOptions,
    },
  };
};

/** Primary expansion panel */
export const Primary = Template.bind({});
