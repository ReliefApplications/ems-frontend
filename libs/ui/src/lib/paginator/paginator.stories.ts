import { addons } from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagerModule } from '@progress/kendo-angular-pager';
import { PaginatorComponent } from './paginator.component';
import { UIPageChangeEvent } from './interfaces/paginator.interfaces';
import { StorybookTranslateModule } from '../../storybook-translate.module';

export default {
  title: 'Components/Paginator',
  tags: ['autodocs'],
  component: PaginatorComponent,
  argTypes: {
    disabled: {
      defaultValue: false,
      type: 'boolean',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        PagerModule,
        StorybookTranslateModule,
        BrowserAnimationsModule,
      ],
    }),
  ],
} as Meta<PaginatorComponent>;

/**
 * Total items for the paginator
 */
const itemsArray: number[] = [...Array(100).keys()];
let pagedItems: number[] = itemsArray.filter((value) => value < 10);
/**
 * Custom method to update paged items for story testing
 *
 * @param event UIPageChangeEvent
 */
const pageChange = (event: UIPageChangeEvent) => {
  console.log('UIPageChangeEvent: ', event);
  pagedItems = [...itemsArray.slice(event.skip, event.skip + event.pageSize)];
  addons.getChannel().emit(FORCE_RE_RENDER);
};

/**
 * Paginator template
 *
 * @param args Paginator component arguments
 * @returns PaginatorComponent
 */
const Template: Story<PaginatorComponent> = (args: PaginatorComponent) => {
  return {
    component: PaginatorComponent,
    template: `
    <div class="overflow-y-auto max-h-70">
      <ng-container *ngFor="let item of pagedItems">
        <p>{{item}}</p>
      </ng-container>
    </div>
    <ui-paginator [disabled]="${args.disabled}" (pageChange)="pageChange($event)" [totalItems]="itemsArray.length" ></ui-paginator>
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
