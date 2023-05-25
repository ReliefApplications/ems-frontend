import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { CommonModule } from '@angular/common';
import { ChannelsRoutingModule } from '../../channels-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { SafeModalModule } from '@oort-front/safe';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { TranslateModule } from '@ngx-translate/core';
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
    MatFormFieldModule,
    MatIconModule,
    FormWrapperModule,
    SpinnerModule,
    MenuModule,
    MatSelectModule,
    DividerModule,
    MatButtonModule,
    TranslateModule,
    SafeModalModule,
    ButtonModule,
    TableModule,
  ],
  selector: 'app-add-channel-modal',
  templateUrl: './add-channel-modal.component.html',
  styleUrls: ['./add-channel-modal.component.scss'],
})
export class AddChannelModalComponent implements OnInit {
  // === REACTIVE FORM ===
  channelForm: UntypedFormGroup = new UntypedFormGroup({});

  /**
   * Add channel component
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Material dialog ref
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddChannelModalComponent>
  ) {}

  ngOnInit(): void {
    this.channelForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
