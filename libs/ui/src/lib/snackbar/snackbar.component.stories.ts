import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SnackbarModule } from './snackbar.module';
import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SNACKBAR_DATA, SnackBarData } from './snackbar.token';
import { SnackbarService } from './snackbar.service';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { Variant } from '../shared/variant.enum';
import { StorybookTranslateModule } from '../../storybook-translate.module';

/**
 * LaunchSnackbarComponent component.
 */
@Component({
  selector: 'ui-snackbar-launcher',
  template: `
    <button
      type="button"
      class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      (click)="openSnackBar()"
    >
      {{ default ? 'Open default snackbar' : 'Open custom snackbar' }}
    </button>
  `,
})
class LaunchSnackbarComponent {
  @Input() default = true;
  /**
   * Constructor for the launchDialog component
   *
   * @param snackBar SnackbarService service
   */
  constructor(private snackBar: SnackbarService) {}

  /**
   * open material dialog.
   */
  openSnackBar(): void {
    if (this.default) {
      this.snackBar.openSnackBar('Processing failed', {
        duration: 5000,
        error: true,
      });
    } else {
      this.snackBar.openComponentSnackBar(CustomSnackbarComponent, {
        duration: 6000,
        data: {
          message: 'Processing',
          loading: true,
        },
      });
    }
  }
}

/**
 * EditDialog component.
 */
@Component({
  standalone: true,
  imports: [CommonModule, IconModule, SpinnerModule],
  selector: 'ui-custom-snackbar',
  template: `
    <div class="flex">
      <span class="pr-2">{{ data.message }}</span>
      <ui-spinner *ngIf="data.loading"></ui-spinner>
      <ng-container *ngIf="!data.loading">
        <ui-icon
          class="h-6"
          *ngIf="!data.error"
          [icon]="check"
          [variant]="variant.SUCCESS"
        ></ui-icon>
        <ui-icon
          class="h-6"
          *ngIf="data.error"
          [icon]="error"
          [variant]="variant.DANGER"
        ></ui-icon>
      </ng-container>
      <div></div>
    </div>
  `,
})
class CustomSnackbarComponent {
  data: SnackBarData;
  variant = Variant;
  /**
   * Snackbar child component
   *
   * @param dataToken Injected snackbar data
   */
  constructor(
    @Inject(SNACKBAR_DATA)
    public dataToken: BehaviorSubject<SnackBarData>
  ) {
    this.data = dataToken.getValue();
  }
}

export default {
  title: 'Snackbar',
  component: LaunchSnackbarComponent,
  decorators: [
    moduleMetadata({
      declarations: [LaunchSnackbarComponent],
      imports: [CommonModule, SnackbarModule, StorybookTranslateModule],
      providers: [SnackbarService],
    }),
  ],
  argTypes: {
    default: {
      type: 'boolean',
    },
  },
} as Meta;

/**
 * Template LaunchSnackbarComponent
 *
 * @param {LaunchSnackbarComponent} args args
 * @returns LaunchSnackbarComponent
 */
const Template: Story<LaunchSnackbarComponent> = (
  args: LaunchSnackbarComponent
) => ({
  props: args,
});

/** LaunchSnackbarComponent */
export const Snackbar = Template.bind({});
Snackbar.args = {
  default: true,
};
