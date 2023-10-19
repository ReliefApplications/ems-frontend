import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SnackbarModule } from './snackbar.module';
import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SNACKBAR_DATA, SnackBarData } from './snackbar.token';
import { SnackbarService } from './snackbar.service';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
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
class LaunchSnackbarComponent implements OnDestroy {
  @Input() default = true;
  destroy$ = new Subject<void>();

  /**
   * Constructor for the launch Snackbar component
   *
   * @param snackBar SnackbarService service
   */
  constructor(private snackBar: SnackbarService) {}

  /**
   * Open Snackbar.
   */
  openSnackBar(): void {
    if (this.default) {
      this.snackBar.openSnackBar('Processing failed', {
        duration: 5000,
        error: true,
      });
    } else {
      const snackbarRef = this.snackBar.openComponentSnackBar(
        CustomSnackbarComponent,
        {
          duration: 0,
          action: 'Reload',
          data: {
            message: 'Processing',
            loading: true,
          },
        }
      );
      snackbarRef.instance.actionComplete
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => window.alert('Action complete!!'),
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      <ui-spinner size="medium" *ngIf="data.loading"></ui-spinner>
      <ng-container *ngIf="!data.loading">
        <ui-icon
          class="h-6"
          *ngIf="!data.error"
          [icon]="check"
          variant="success"
        ></ui-icon>
        <ui-icon
          class="h-6"
          *ngIf="data.error"
          [icon]="error"
          variant="danger"
        ></ui-icon>
      </ng-container>
      <div></div>
    </div>
  `,
})
class CustomSnackbarComponent {
  data: SnackBarData;

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
  title: 'Components/Snackbar',
  tags: ['autodocs'],
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
      description: 'Open default snackbar',
      type: 'boolean',
    },
    destroy$: {
      description: 'Subject to emit when the component is destroyed.',
      type: 'string',
    },
    ngOnDestroy: {
      description:
        'Lifecycle hook that is called when the component is destroyed.',
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
