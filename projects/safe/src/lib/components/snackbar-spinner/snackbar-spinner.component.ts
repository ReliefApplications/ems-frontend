import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

interface SnackBarData {
  loading: boolean;
  error?: boolean;
}

@Component({
  selector: 'safe-snackbar-spinner',
  templateUrl: './snackbar-spinner.component.html',
  styleUrls: ['./snackbar-spinner.component.scss'],
})
export class SafeSnackbarSpinnerComponent implements OnInit {
  message = 'Preparing file';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: SnackBarData
  ) {}

  ngOnInit(): void {}
}
