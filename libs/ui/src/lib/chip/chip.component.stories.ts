import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { ChipComponent } from './chip.component';
import { ChipModule } from './chip.module';
import { variants } from '../types/variant';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export default {
  title: 'Chip',
  component: ChipComponent,
  argTypes: {
    variant: {
      defaultValue: 'default',
      options: variants,
      control: {
        type: 'select',
      },
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
let statuses = ['Active', 'Pending', 'Archived'];
/** Form control to test chip story */
const formControl = new FormControl();

/**
 * Callback to test the chip remove event
 *
 * @param index Index of the selected status from the chip list
 */
const removeStatus = (index: number) => {
  statuses.splice(index, 1);
};

/**
 * Callback to test the chip input directive change event
 *
 * @param chips New chip/chips to add to the chip list
 */
const addChipsFromInput = (chips: string[] | string) => {
  if (chips instanceof Array) {
    statuses = statuses.concat([...chips]);
  } else {
    statuses.push(chips);
  }
  formControl.setValue(statuses);
};

/** Separator key codes for story testing */
const separatorKeysCodes = [ENTER, COMMA];

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
        <ui-chip variant="default" [removable]="true"> Default </ui-chip>
        <ui-chip variant="primary" [removable]="true"> Primary </ui-chip>
        <ui-chip variant="success" [removable]="true"> Success </ui-chip>
        <ui-chip variant="danger" [removable]="true"> Danger </ui-chip>
        <ui-chip variant="danger" [removable]="true" [disabled]="true"> Disabled </ui-chip>
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
 * Template chip list with input
 *
 * @param {ChipComponent} args args
 * @returns ChipComponent
 */
const ChipsInputTemplate: StoryFn<ChipComponent> = (args: ChipComponent) => {
  return {
    component: ChipComponent,
    template: `
      <div uiChipList [formControl]="formControl" #chipList>
        <ui-chip
          [removable]="${args.removable}"
          [disabled]="${args.disabled}"
          [variant]="'${args.variant}'"
          [value]="status"
          *ngFor="let status of statuses; let i = index"
          (removed)="removeStatus(i)"
        >
          {{ status }}
        </ui-chip>
      </div>
      <input
        placeholder="New status..."
        [uiChipListFor]="chipList"
        [chipInputSeparatorKeyCodes]="separatorKeysCodes"
        (chipTokenEnd)="addChipsFromInput($event)"
        >
        <br>
        <p>value: <span *ngFor="let val of formControl.value;let last = last">{{val}} <span *ngIf="!last">, </span></span></p>
        <p>touched: {{formControl.touched}}</p>
        `,
    props: {
      ...args,
      statuses,
      formControl,
      removeStatus,
      addChipsFromInput,
      separatorKeysCodes,
    },
  };
};
/** Chip list with input */
export const ChipWithInput = ChipsInputTemplate.bind({});
ChipWithInput.args = {
  removable: true,
  variant: 'default',
  disabled: false,
};
