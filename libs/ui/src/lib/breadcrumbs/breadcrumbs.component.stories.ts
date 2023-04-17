import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';

export default {
  title: 'BreadcrumbsComponent',
  component: BreadcrumbsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<BreadcrumbsComponent>;

const Template: Story<BreadcrumbsComponent> = (args: BreadcrumbsComponent) => ({
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}