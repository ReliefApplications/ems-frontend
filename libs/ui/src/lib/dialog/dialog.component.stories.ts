import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DialogComponent } from './dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { DialogModule } from './dialog.module';
import { Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogSize } from './enums/dialog-size.enum';

@Component({
  selector: 'ui-dialog-launcher',
  template: `<button (click)="openDialog()">Open dialog</button>`,
})
class LaunchDialogComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() width = '';
  @Input() animal = '';
  @Input() size = 'medium';
  constructor(private _dialog: Dialog) {}

  openDialog(): void {
    this._dialog.open(DialogComponent, {
      autoFocus: true,
      data: {
        title: this.title,
        description: this.description,
        animal: this.animal,
        size: this.size,
      },
    });
  }
}

export default {
  title: 'Dialog',
  component: LaunchDialogComponent,
  decorators: [
    moduleMetadata({
      imports: [DialogModule, BrowserAnimationsModule],
    }),
  ],
} as Meta;

const Template: Story<LaunchDialogComponent> = (
  args: LaunchDialogComponent
) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut ex et tortor auctor fermentum. Curabitur tristique mauris sed mauris feugiat vestibulum. Quisque felis ex, auctor nec lobortis quis',
  animal: 'panda',
  size: DialogSize.FULLSCREEN,
};
