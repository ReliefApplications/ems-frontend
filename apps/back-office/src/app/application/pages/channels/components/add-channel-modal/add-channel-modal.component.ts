import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
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
  TableModule,
  FormWrapperModule,
} from '@oort-front/ui';

/**
 * Add channel component, act as modal.
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
    TableModule,
  ],
  selector: 'app-add-channel-modal',
  templateUrl: './add-channel-modal.component.html',
  styleUrls: ['./add-channel-modal.component.scss'],
})
export class AddChannelModalComponent {
  /** Channel form group */
  public channelForm = this.fb.group({
    title: ['', Validators.required],
  });

  /**
   * Add channel component
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<AddChannelModalComponent>
  ) {}

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
