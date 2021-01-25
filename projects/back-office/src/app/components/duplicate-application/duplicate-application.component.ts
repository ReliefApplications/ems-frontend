import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-duplicate-application',
  templateUrl: './duplicate-application.component.html',
  styleUrls: ['./duplicate-application.component.scss']
})
export class DuplicateApplicationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DuplicateApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }

}
