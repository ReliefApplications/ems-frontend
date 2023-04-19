import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { CdkTableModule } from '@angular/cdk/table';
import { PagerModule } from '@progress/kendo-angular-pager';
import { TableComponent } from './table.component';

type MockedTable = {
  name: string;
  email: string;
  phone: string;
  city: string;
  active: boolean;
};

export default {
  title: 'TableComponent',
  component: TableComponent,
  decorators: [
    moduleMetadata({
      imports: [CdkTableModule, PagerModule],
    }),
  ],
} as Meta<TableComponent<MockedTable>>;

/**
 * Mocked table data
 */
const tableData = [
  {
    name: 'Name 1',
    email: 'email@email.com',
    phone: '111111111',
    city: 'City 1',
    active: false,
    id: '1',
  },
  {
    name: 'Name 3',
    email: 'email@email.com',
    phone: '333333333',
    city: 'City 3',
    active: true,
    id: '3',
  },
  {
    name: 'Name 2',
    email: 'email@email.com',
    phone: '222222222',
    city: 'City 2',
    active: true,
    id: '2',
  },
  {
    name: 'Name 4',
    email: 'email@email.com',
    phone: '444444444',
    city: 'City 4',
    active: false,
    id: '4',
  },
  {
    name: 'Name 5',
    email: 'email@email.com',
    phone: '555555555',
    city: 'City 5',
    active: false,
    id: '5',
  },
  {
    name: 'Name 6',
    email: 'email@email.com',
    phone: '666666666',
    city: 'City 6',
    active: true,
    id: '6',
  },
];

/**
 * Template divider
 *
 * @param args Table component args
 * @returns TableComponent story
 */
const Template: StoryFn<TableComponent<MockedTable>> = (
  args: TableComponent<MockedTable>
) => ({
  props: args,
});

/** Primary divider */
export const Primary = Template.bind({});
Primary.args = {
  data: tableData,
};
