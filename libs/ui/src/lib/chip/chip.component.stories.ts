import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { ChipComponent } from './chip.component';
import { ChipModule } from './chip.module';
import { Variant } from '../shared/variant.enum';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export default {
  title: 'Chip',
  component: ChipComponent,
  argTypes: {
    variant: {
      defaultValue: Variant.DEFAULT,
      options: Object.values(Variant),
      control: {
        type: 'select',
      },
    },
    value: {
      control: { type: 'text' },
    },
    removable: {
      defaultValue: false,
      type: 'boolean',
    },
    disabled: {
      defaultValue: false,
      type: 'boolean',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ChipModule, ReactiveFormsModule],
    }),
  ],
} as Meta<ChipComponent>;

/**
 * Status array for story testing
 */
const statuses = ['Active', 'Pending', 'Archived'];
let currentStatus = statuses[0];

/**
 * Form control to test chip story
 */
const formControl = new FormControl('');

/**
 * Callback to test the chip list directive change event
 *
 * @param status Selected status from the chips
 */
const updateStatus = (status: any) => {
  currentStatus = status;
  console.log('Update Status: ', status);
};

/**
 * Callback to test the chip list directive change event
 *
 * @param status Selected status from the chips
 */
const removeStatus = (status: string) => {
  console.log('Remove Status: ', status);
  const index = statuses.indexOf(status);
  if (index >= 0) {
    statuses.splice(index, 1);
  }
  currentStatus = statuses[0];
  // formControl.setValue(currentStatus);
};

/**
 * Template chip
 *
 * @param {ChipComponent} args args
 * @returns ChipComponent
 */
const ChipListTemplate: StoryFn<ChipComponent> = (args: ChipComponent) => {
  return {
    component: ChipComponent,
    template: `
      <div [uiChipList]="currentStatus" (uiChipListChange)="updateStatus($event)">
        <ui-chip [removable]="true" [value]="status"
          *ngFor="let status of statuses" (removed)="removeStatus(status)"
        >
          {{ status }}
        </ui-chip>
      </div>
    `,
    props: {
      ...args,
      statuses,
      updateStatus,
      currentStatus,
      removeStatus,
    },
  };
};
/** Chip list */
export const ChipList = ChipListTemplate.bind({});

/**
 * Template chip variants
 *
 * @param {ChipComponent} args args
 * @returns ChipComponent
 */
const ChipVariantsTemplate: StoryFn<ChipComponent> = (args: ChipComponent) => {
  return {
    component: ChipComponent,
    template: `
      <ui-chip [variant]="'${Variant.DEFAULT}'" [removable]="true"> Default </ui-chip>
      <ui-chip [variant]="'${Variant.PRIMARY}'" [removable]="true"> Primary </ui-chip>
      <ui-chip [variant]="'${Variant.SUCCESS}'" [removable]="true"> Success </ui-chip>
      <ui-chip [variant]="'${Variant.DANGER}'" [removable]="true"> Danger </ui-chip>
      <ui-chip [variant]="'${Variant.DANGER}'" [removable]="true" [disabled]="true"> Disabled </ui-chip>
    `,
    props: {
      ...args,
    },
  };
};
/** Chips variants demonstration */
export const ChipVariants = ChipVariantsTemplate.bind({});
