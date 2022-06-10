import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'safe-card-settings',
  templateUrl: './card-settings.component.html',
  styleUrls: ['./card-settings.component.scss']
})
export class SafeCardSettingsComponent implements OnInit {

  @Input() dialogRef: any;
  @Input() tileForm: any;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.tileForm?.getRawValue());
  }

}
