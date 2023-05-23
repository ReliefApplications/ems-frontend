import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';

import { TableModule } from './table.module';
import { StorybookTranslateModule } from '../../storybook-translate.module';
import { ToggleModule } from '../toggle/toggle.module';
import { TableSort } from './interfaces/table-column.interface';

type MockedTable = {
  name: string;
  email: { value: string };
  phone: { value: string };
  cityVal: string;
  isValid: boolean;
  id: string;
};

export default {
  title: 'Table',
  decorators: [
    moduleMetadata({
      imports: [TableModule, StorybookTranslateModule, ToggleModule],
    }),
  ],
} as Meta<any>;

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
 * Console log receive table sort data
 *
 * @param column TableSort data
 */
const sortTableByKey = (column: TableSort) => {
  console.log(column);
};

/**
 * Column definition for table
 */
const columnDefinitionArray = [
  'name',
  'email',
  'phone',
  'city',
  'active',
  'selected',
  'id',
];

/**
 * Template divider for table
 *
 * @param args Table component args
 * @returns TableComponent story
 */
const Template: StoryFn<any> = (args: any) => {
  const pagedTableData = tableData.filter((el, index) => index < 10);
  return {
    template: `
    <!--TABLE CONTENT-->
<table
  cdk-table 
  uiTableWrapper
  (sortChange)="sortTableByKey($event)"
  [dataSource]="pagedTableData"
>
  <ng-container cdkColumnDef="name">
    <th
    uiTableHeaderSort="name"
      uiCellHeader
      *cdkHeaderCellDef
      scope="col"
      
    >
      name
    </th>
    <td uiCell *cdkCellDef="let element">
      {{ element.name }}
    </td>
  </ng-container>

  <ng-container cdkColumnDef="email">
    <th
      uiCellHeader
      *cdkHeaderCellDef
      scope="col"
      
    >
      email
    </th>
    <td uiCell *cdkCellDef="let element">
      {{ element.email.value }}
    </td>
  </ng-container>

  <ng-container cdkColumnDef="phone">
    <th
    uiTableHeaderSort="phone"
      uiCellHeader
      *cdkHeaderCellDef
      scope="col"
      
    >
      phone
    </th>
    <td uiCell *cdkCellDef="let element">
      {{ element.phone.value }}
    </td>
  </ng-container>

  <ng-container cdkColumnDef="city">
    <th
    uiTableHeaderSort="cityVal"
      uiCellHeader
      *cdkHeaderCellDef
      scope="col"
      
    >
      city
    </th>
    <td uiCell *cdkCellDef="let element">
      {{ element.cityVal }}
    </td>
  </ng-container>

  <ng-container cdkColumnDef="active">
    <th
      uiCellHeader
      *cdkHeaderCellDef
      scope="col"
      
    >
      active
    </th>
    <td uiCell *cdkCellDef="let element">
    <div class="flex items-center justify-end gap-x-2 sm:justify-start">
    <div [ngClass]="{'text-rose-400 bg-rose-400/10': !element.isValid, 'text-green-400 bg-green-400/10': element.isValid}" class="flex-none rounded-full p-1">
      <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
    </div>
    <div class="text-neutral sm:block">{{element.isValid ? 'Completed' : 'Error' }}</div>
  </div>
    </td>
  </ng-container>

  <ng-container cdkColumnDef="selected">
    <th
      uiCellHeader
      *cdkHeaderCellDef
      scope="col"
      
    >
      selected
    </th>
    <td uiCell *cdkCellDef="let element">
      <ui-toggle></ui-toggle>
    </td>
  </ng-container>

  <ng-container cdkColumnDef="id">
    <th
      uiCellHeader
      *cdkHeaderCellDef
      scope="col"
      
    >
      id
    </th>
    <td uiCell *cdkCellDef="let element">
      {{ element.id }}
    </td>
  </ng-container>
  <tr cdk-header-row *cdkHeaderRowDef="columnDefinitionArray"></tr>
  <tr cdk-row *cdkRowDef="let row; columns: columnDefinitionArray"></tr>
</table>`,
    props: {
      ...args,
      pagedTableData,
      sortTableByKey,
      columnDefinitionArray,
    },
  };
};

/** Table component */
export const Table = Template.bind({});
