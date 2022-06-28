import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Channel } from '@safe/builder';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss'],
})
/** Modal to edit a channel. */
export class EditChannelComponent implements OnInit {
  // === REACTIVE FORM ===
  roleForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditChannelComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      channel: Channel;
    }
  ) {}

  /** Load data and build the form. */
  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      title: [this.data.channel.title, Validators.required],
    });
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
