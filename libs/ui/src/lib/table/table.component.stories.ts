import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import '@angular/compiler';
import {
  moduleMetadata,
  Meta,
  StoryFn,
  componentWrapperDecorator,
} from '@storybook/angular';
import { CdkTableModule } from '@angular/cdk/table';
import { PagerModule } from '@progress/kendo-angular-pager';
import { TableComponent } from './table.component';
import { TableColumnDefinition } from './interfaces/table-column.interface';

type MockedTable = {
  name: string;
  email: { value: string };
  phone: { value: string };
  cityVal: string;
  isValid: boolean;
  id: string;
};

export default {
  title: 'TableComponent',
  component: TableComponent,
  decorators: [
    moduleMetadata({
      imports: [CdkTableModule, PagerModule, BrowserAnimationsModule],
    }),
    componentWrapperDecorator(
      (story) => `<div class="h-screen overflow-y-auto">${story}</div>`
    ),
  ],
} as Meta<TableComponent<MockedTable>>;

/**
 * Mocked table data
 */
const tableData: MockedTable[] = [
  {
    name: 'Name 1',
    email: { value: 'email@email.com' },
    phone: { value: '111111111' },
    cityVal: 'City 1',
    isValid: false,
    id: '1',
  },
  {
    name: 'Name 3',
    email: { value: 'email@email.com' },
    phone: { value: '333333333' },
    cityVal: 'City 3',
    isValid: true,
    id: '3',
  },
  {
    name: 'Name 2',
    email: { value: 'email@email.com' },
    phone: { value: '222222222' },
    cityVal: 'City 2',
    isValid: true,
    id: '2',
  },
  {
    name: 'Name 4',
    email: { value: 'email@email.com' },
    phone: { value: '444444444' },
    cityVal: 'City 4',
    isValid: false,
    id: '4',
  },
  {
    name: 'Name 5',
    email: { value: 'email@email.com' },
    phone: { value: '555555555' },
    cityVal: 'City 5',
    isValid: false,
    id: '5',
  },
  {
    name: 'Name 6',
    email: { value: 'email@email.com' },
    phone: { value: '666666666' },
    cityVal: 'City 6',
    isValid: true,
    id: '6',
  },
  {
    name: 'Name 1',
    email: { value: 'email@email.com' },
    phone: { value: '111111111' },
    cityVal: 'City 1',
    isValid: false,
    id: '1',
  },
  {
    name: 'Name 3',
    email: { value: 'email@email.com' },
    phone: { value: '333333333' },
    cityVal: 'City 3',
    isValid: true,
    id: '3',
  },
  {
    name: 'Name 2',
    email: { value: 'email@email.com' },
    phone: { value: '222222222' },
    cityVal: 'City 2',
    isValid: true,
    id: '2',
  },
  {
    name: 'Name 4',
    email: { value: 'email@email.com' },
    phone: { value: '444444444' },
    cityVal: 'City 4',
    isValid: false,
    id: '4',
  },
  {
    name: 'Name 5',
    email: { value: 'email@email.com' },
    phone: { value: '555555555' },
    cityVal: 'City 5',
    isValid: false,
    id: '5',
  },
  {
    name: 'Name 6',
    email: { value: 'email@email.com' },
    phone: { value: '666666666' },
    cityVal: 'City 6',
    isValid: true,
    id: '6',
  },
  {
    name: 'Name 1',
    email: { value: 'email@email.com' },
    phone: { value: '111111111' },
    cityVal: 'City 1',
    isValid: false,
    id: '1',
  },
  {
    name: 'Name 3',
    email: { value: 'email@email.com' },
    phone: { value: '333333333' },
    cityVal: 'City 3',
    isValid: true,
    id: '3',
  },
  {
    name: 'Name 2',
    email: { value: 'email@email.com' },
    phone: { value: '222222222' },
    cityVal: 'City 2',
    isValid: true,
    id: '2',
  },
  {
    name: 'Name 4',
    email: { value: 'email@email.com' },
    phone: { value: '444444444' },
    cityVal: 'City 4',
    isValid: false,
    id: '4',
  },
  {
    name: 'Name 5',
    email: { value: 'email@email.com' },
    phone: { value: '555555555' },
    cityVal: 'City 5',
    isValid: false,
    id: '5',
  },
  {
    name: 'Name 6',
    email: { value: 'email@email.com' },
    phone: { value: '666666666' },
    cityVal: 'City 6',
    isValid: true,
    id: '6',
  },
];

/**
 * Mocked Table column definition
 */
const columnDefinitionData: TableColumnDefinition[] = [
  {
    title: 'name',
    dataAccessor: 'name',
    sortable: true,
    template: '',
  },
  {
    title: 'email',
    dataAccessor: 'email.value',
    sortable: false,
    template: '',
  },
  {
    title: 'phone',
    dataAccessor: 'phone.value',
    sortable: true,
    template: '',
  },
  {
    title: 'city',
    dataAccessor: 'cityVal',
    sortable: true,
    template: '',
  },
  {
    title: 'Active',
    dataAccessor: 'isValid',
    sortable: false,
    template: `<div class="flex items-center justify-end gap-x-2 sm:justify-start">
    <div [ngClass]="{'text-rose-400 bg-rose-400/10': !get(element, dataAccessor), 'text-green-400 bg-green-400/10': get(element, dataAccessor)} class="flex-none rounded-full p-1">
      <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
    </div>
    <div class="text-white sm:block">{{get(element, dataAccessor) ? 'Completed' : 'Error' }}</div>
  </div>`,
  },
  {
    title: 'id',
    dataAccessor: 'id',
    sortable: false,
    template: '',
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
  tableDefinition: { tableData, columnDefinitionData },
};
