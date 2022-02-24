import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'safe-snackbar-spinner',
  templateUrl: './snackbar-spinner.component.html',
  styleUrls: ['./snackbar-spinner.component.scss'],
})
export class SafeSnackbarSpinnerComponent implements OnInit {
  message = 'File ongoing';

  constructor() {}

  ngOnInit(): void {}
}
