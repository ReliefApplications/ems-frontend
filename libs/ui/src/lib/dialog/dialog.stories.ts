import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogModule } from './dialog.module';
import { CommonModule } from '@angular/common';
import { Component, Input, Inject, OnDestroy } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DialogSize, dialogSizes } from './types/dialog-size';

/**
 * LaunchDialog component.
 */
@Component({
  selector: 'ui-dialog-launcher',
  template: `
    <button
      type="button"
      class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      (click)="openDialog()"
    >
      Open dialog
    </button>
  `,
})
class LaunchDialogComponent implements OnDestroy {
  @Input() animal = '';
  @Input() size: DialogSize = 'medium';
  private destroy$ = new Subject<void>();

  /**
   * Constructor for the launchDialog component
   *
   * @param _dialog Dialog service
   */
  constructor(private _dialog: Dialog) {}

  /**
   * open Dialog.
   */
  openDialog(): void {
    const dialogRef: any = this._dialog.open(EditDialogComponent, {
      data: {
        animal: this.animal,
        size: this.size,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
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
  imports: [CommonModule, DialogModule],
  selector: 'ui-edit-dialog',
  template: `
    <ui-dialog [size]="data.size">
      <ng-container ngProjectAs="header">
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
        >
          <svg
            class="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      </ng-container>
      <ng-container ngProjectAs="content">
        <div class="flex flex-col h-full">
          <div class="my-auto text-center">
            <h3
              class="text-base font-semibold leading-6 text-gray-900"
              id="modal-title"
            >
              Payment successful
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur amet labore.
              </p>
            </div>
          </div>
        </div>
      </ng-container>
      <ng-container ngProjectAs="actions">
        <br />
        <button
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          [uiDialogClose]="data.animal"
        >
          Go back
        </button>
      </ng-container>
    </ui-dialog>
  `,
})
class EditDialogComponent {
  /**
   * Edit Dialog component
   *
   * @param dialogRef Dialog ref
   * @param data Injected dialog data
   * @param data.animal animal data
   * @param data.size size data
   */
  constructor(
    public dialogRef: DialogRef<EditDialogComponent>,
    @Inject(DIALOG_DATA)
    public data: {
      animal: string;
      size: DialogSize;
    }
  ) {}
}

export default {
  title: 'Components/Dialog',
  tags: ['autodocs'],
  component: LaunchDialogComponent,
  decorators: [
    moduleMetadata({
      declarations: [LaunchDialogComponent],
      imports: [CommonModule, DialogModule],
    }),
  ],
  argTypes: {
    size: {
      options: dialogSizes,
      control: {
        type: 'select',
      },
    },
  },
} as Meta;

/**
 * Template launchDialog
 *
 * @param {LaunchDialogComponent} args args
 * @returns LaunchDialogComponent
 */
const Template: Story<LaunchDialogComponent> = (
  args: LaunchDialogComponent
) => ({
  props: args,
});

/** Primary launchDialog */
export const Default = Template.bind({});
Default.args = {
  animal: 'panda',
  size: 'small',
};
