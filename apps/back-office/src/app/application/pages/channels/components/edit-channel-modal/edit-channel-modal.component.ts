import { Component, OnInit, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
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
export class EditChannelModalComponent implements OnInit {
  // === REACTIVE FORM ===
  roleForm: UntypedFormGroup = new UntypedFormGroup({});

  /**
   * Edit channel component
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Dialog ref
   * @param data Injected dialog data
   * @param data.channel channel to edit
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: DialogRef<EditChannelModalComponent>,
    @Inject(DIALOG_DATA)
    public data: {
      channel: Channel;
    }
  ) {}

  /** Load data and build the form. */
  ngOnInit(): void {    
    this.roleForm = this.formBuilder.group({
      title: [this.data?.channel?.title, Validators.required],
    });
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
