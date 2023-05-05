import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { ChipComponent } from './chip.component';
import { ChipModule } from './chip.module';
import { Variant } from '../shared/variant.enum';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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

/** Status array for story testing */
const statuses = ['Active', 'Pending', 'Archived'];
let currentStatus = statuses[0];

/** Form control to test chip story */
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
 * Callback to test the chip remove event
 *
 * @param index Index of the selected status from the chip list
 */
const removeStatus = (index: number) => {
  statuses.splice(index, 1);
};

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
      <div class="flex gap-1">
        <ui-chip [variant]="'${Variant.DEFAULT}'" [removable]="true"> Default </ui-chip>
        <ui-chip [variant]="'${Variant.PRIMARY}'" [removable]="true"> Primary </ui-chip>
        <ui-chip [variant]="'${Variant.SUCCESS}'" [removable]="true"> Success </ui-chip>
        <ui-chip [variant]="'${Variant.DANGER}'" [removable]="true"> Danger </ui-chip>
        <ui-chip [variant]="'${Variant.DANGER}'" [removable]="true" [disabled]="true"> Disabled </ui-chip>
      </div>
    `,
    props: {
      ...args,
    },
  };
};
/** Chips variants demonstration */
export const ChipVariants = ChipVariantsTemplate.bind({});

/**
 * Template chip list with form control
 *
 * @param {ChipComponent} args args
 * @returns ChipComponent
 */
const FormChipListTemplate: StoryFn<ChipComponent> = (args: ChipComponent) => {
  return {
    component: ChipComponent,
    template: `
      <div 
        [formControl]="formControl"
        uiChipList
        (uiChipListChange)="updateStatus($event)"
        class="flex gap-1"
      >
        <ui-chip
          *ngFor="let status of statuses; let i = index"
          [removable]="true"
          [value]="status"
          (removed)="removeStatus(i)"
        >
          {{ status }}
        </ui-chip>
      </div>
      <br>
      <p>value: {{formControl.value}}</p>
      <p>touched: {{formControl.touched}}</p>
    `,
    props: {
      ...args,
      formControl,
      statuses,
      updateStatus,
      currentStatus,
      removeStatus,
    },
  };
};
/** Chip list with form control */
export const FormChipList = FormChipListTemplate.bind({});

/**
 * Callback to test the chip input directive change event
 *
 * @param chip New chip to add to the chip list
 */
const addChipFromInput = (chip: string) => {
  statuses.push(chip);
};

/** Separator key codes for story testing */
const separatorKeysCodes = [ENTER, COMMA];

/**
 * Template chip list with input
 *
 * @param {ChipComponent} args args
 * @returns ChipComponent
 */
const ChipsInputTemplate: StoryFn<ChipComponent> = (args: ChipComponent) => {
  return {
    component: ChipComponent,
    template: `
      <div uiChipList #chipList>
        <ui-chip
          [removable]="true"
          [value]="status"
          *ngFor="let status of statuses; let i = index"
          (removed)="removeStatus(i)"
        >
          {{ status }}
        </ui-chip>
      </div>
      <input
        placeholder="New status..."
        #inputChip
        [uiChipListFor]="chipList"
        [chipInput]="inputChip"
        [chipInputSeparatorKeyCodes]="separatorKeysCodes"
        (chipTokenEnd)="addChipFromInput($event)"
        >
        `,
    props: {
      ...args,
      statuses,
      removeStatus,
      addChipFromInput,
      separatorKeysCodes,
    },
  };
};
/** Chip list with input */
export const ChipWithInput = ChipsInputTemplate.bind({});
