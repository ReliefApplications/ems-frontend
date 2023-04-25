import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PaginatorComponent } from './paginator.component';
import { PagerModule } from '@progress/kendo-angular-pager';
import { CommonModule } from '@angular/common';
import { UIPageChangeEvent } from './interfaces/paginator.interfaces';
import { StorybookTranslateModule } from '../../storybook-translate.module';
import { TranslateModule } from '@ngx-translate/core';

export default {
  title: 'Paginator',
  component: PaginatorComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        PagerModule,
        StorybookTranslateModule,
        TranslateModule,
      ],
    }),
  ],
} as Meta<PaginatorComponent>;

/**
 * Paginator template
 *
 * @param args Paginator component arguments
 * @returns PaginatorComponent
 */
const Template: Story<PaginatorComponent> = (args: PaginatorComponent) => {
  const itemsArray: number[] = [];
  for (let index = 0; index < 100; index++) {
    itemsArray.push(index + 1);
  }
  let pagedItems: number[] = [];
  const pageChange = (event: UIPageChangeEvent) => {
    console.log(event);
    pagedItems = itemsArray.slice(event.skip, event.skip + event.pageSize);
  };
  return {
    component: PaginatorComponent,
    template: `
      <ng-container *ngFor="let item of pagedItems">
      <p>{{item}}</p>
      </ng-container>
      <ui-paginator (pageChange)="pageChange($event)" [totalItems]="itemsArray.length" ></ui-paginator>
        `,
    props: {
      ...args,
      itemsArray,
      pagedItems,
      pageChange,
    },
  };
};

/**
 * Paginator story
 */
export const Paginator = Template.bind({});
