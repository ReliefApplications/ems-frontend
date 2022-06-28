import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dashboard',
  templateUrl: './add-dashboard.component.html',
  styleUrls: ['./add-dashboard.component.scss'],
})
export class AddDashboardComponent implements OnInit {
  // === REACTIVE FORM ===
  dashboardForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDashboardComponent>
  ) {}

  /** Build the form. */
  ngOnInit(): void {
    this.dashboardForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
