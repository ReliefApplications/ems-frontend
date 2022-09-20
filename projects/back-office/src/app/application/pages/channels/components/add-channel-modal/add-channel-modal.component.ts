import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Add channel component, act as modal.
 */
@Component({
  selector: 'app-add-channel-modal',
  templateUrl: './add-channel-modal.component.html',
  styleUrls: ['./add-channel-modal.component.scss'],
})
export class AddChannelModalComponent implements OnInit {
  // === REACTIVE FORM ===
  channelForm: FormGroup = new FormGroup({});

  /**
   * Add channel component
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Material dialog ref
   */
  constructor(
    private formBuilder: FormBuilder,
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
