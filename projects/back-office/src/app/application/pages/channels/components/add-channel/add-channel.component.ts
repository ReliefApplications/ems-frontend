import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Add channel component, act as modal.
 */
@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.scss'],
})
export class AddChannelComponent implements OnInit {
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
    public dialogRef: MatDialogRef<AddChannelComponent>
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
