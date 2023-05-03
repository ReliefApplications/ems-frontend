import { moduleMetadata, Story, Meta, StoryFn } from '@storybook/angular';
import { DialogComponent } from './dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { DialogModule } from './dialog.module'
import { Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-launcher',
  template: `
    <button mat-raised-button color="primary" (click)="launch()"> Launch </button>
  `
})
class LaunchDialogComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() width = '';
  constructor(private _dialog: Dialog) { }

  launch(): void {
      this._dialog.open(DialogComponent, {
          autoFocus: false,
          width: this.width,
          data: {
              title: this.title,
              description: this.description
          }
      });
  }
}

export default {
  title: 'Dialog',
  component: LaunchDialogComponent,
  decorators: [
      moduleMetadata({
          imports: [DialogModule, BrowserAnimationsModule],
      })
  ]
} as Meta;

const Template: Story<LaunchDialogComponent> = (args: LaunchDialogComponent) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut ex et tortor auctor fermentum. Curabitur tristique mauris sed mauris feugiat vestibulum. Quisque felis ex, auctor nec lobortis quis',
  width: '40vw'
};