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
  title: 'Components/Expansion Panel',
  component: ExpansionPanelComponent,
  argTypes: {
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
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae ab harum eius, ullam, ex expedita animi nihil, et ut fugit commodi quam! Saepe, recusandae quo sapiente id quidem velit, beatae error distinctio asperiores nesciunt officiis iusto. Sed, aliquid labore pariatur, optio sequi recusandae blanditiis voluptas perferendis sint eveniet inventore harum porro nemo consequatur nesciunt quos delectus, id amet quae? Exercitationem ab debitis ipsum sapiente? A, culpa, quaerat assumenda amet nulla id, quod quia facilis tempora fugit aut provident natus omnis doloremque dolorem odit! Voluptatum assumenda, ipsum vel architecto possimus adipisci ipsam. Fugiat hic impedit rem voluptatem expedita architecto fugit.',
  },
  {
    title: 'Item 3',
    expanded: false,
    text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis excepturi incidunt ipsum deleniti labore, tempore non nam doloribus blanditiis veritatis illo autem iure aliquid ullam rem tenetur deserunt velit culpa?',
  },
];

/**
 * Test panel close
 */
const onClose = () => {
  console.log('panel closed');
};

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
          *ngFor="let panel of panelOptions; let i = index;" 
          [disabled]="${args.disabled}" 
          [displayIcon]="${args.displayIcon}" 
          [expanded]="panel.expanded"
          [index]="i"
          (closePanel)="onClose()"
        >
          <ng-container ngProjectAs="title">
            {{panel.title}}
          </ng-container>
          <p class="mb-2 text-gray-500">{{panel.text}}</p>
        </ui-expansion-panel>
      </cdk-accordion>
    `,
    props: {
      ...args,
      panelOptions,
      onClose,
    },
  };
};

/** Toggle expansion panel */
export const TogglePanel = Template.bind({});
TogglePanel.args = {
  disabled: false,
  displayIcon: true,
};

/**
 * Template multi expansion panel group
 *
 * @param {ExpansionPanelComponent} args args
 * @returns ExpansionPanelComponent
 */
const TemplateMulti: StoryFn<ExpansionPanelComponent> = (
  args: ExpansionPanelComponent
) => {
  args.displayIcon = true;
  return {
    component: ExpansionPanelComponent,
    template: `
      <cdk-accordion [multi]="true">
        <ui-expansion-panel 
          *ngFor="let panel of panelOptions; let i = index;" 
          [disabled]="${args.disabled}" 
          [displayIcon]="${args.displayIcon}" 
          [expanded]="panel.expanded"
          [index]="i"
          (closePanel)="onClose()"
        >
          <ng-container ngProjectAs="title">
            {{panel.title}}
          </ng-container>
          <p class="mb-2 text-gray-500" >{{panel.text}}</p>
        </ui-expansion-panel>
      </cdk-accordion>
    `,
    props: {
      ...args,
      panelOptions,
      onClose,
    },
  };
};

/** Multi expansion panel */
export const MultiPanel = TemplateMulti.bind({});
MultiPanel.args = {
  disabled: false,
  displayIcon: true,
};
