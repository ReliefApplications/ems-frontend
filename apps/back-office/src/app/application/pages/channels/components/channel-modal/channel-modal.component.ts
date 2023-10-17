import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChannelsRoutingModule } from '../../channels-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';
import {
  SpinnerModule,
  DividerModule,
  MenuModule,
  ButtonModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { Channel } from '@oort-front/shared';

/**
 * Channel component, act as modal.
 * Used for both edition and addition of channels.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ChannelsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    FormWrapperModule,
    SpinnerModule,
    MenuModule,
    DividerModule,
    DialogModule,
    ButtonModule,
  ],
  selector: 'app-channel-modal',
  templateUrl: './channel-modal.component.html',
  styleUrls: ['./channel-modal.component.scss'],
})
export class ChannelModalComponent {
  /** Channel form group */
  public channelForm = this.fb.group({
    title: [this.data?.channel.title ?? '', Validators.required],
  });

  /**
   * Channel component, act as modal.
   * Used for both edition and addition of channels.
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   * @param data Injected dialog data
   * @param data.channel channel to edit
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<ChannelModalComponent>,
    @Optional()
    @Inject(DIALOG_DATA)
    public data: {
      channel: Channel;
    }
  ) {}
}
