import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Channel } from '@oort-front/safe';
import { CommonModule } from '@angular/common';
import { ChannelsRoutingModule } from '../../channels-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import {
  SpinnerModule,
  DividerModule,
  MenuModule,
  ButtonModule,
  FormWrapperModule,
} from '@oort-front/ui';

/**
 * Edit channel component, act as modal.
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
  selector: 'app-edit-channel-modal',
  templateUrl: './edit-channel-modal.component.html',
  styleUrls: ['./edit-channel-modal.component.scss'],
})
export class EditChannelModalComponent {
  /** Current form */
  public formGroup = this.fb.group({
    title: [this.data.channel.title, Validators.required],
  });

  /**
   * Edit channel component
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   * @param data Injected dialog data
   * @param data.channel channel to edit
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<EditChannelModalComponent>,
    @Inject(DIALOG_DATA)
    public data: {
      channel: Channel;
    }
  ) {}

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
