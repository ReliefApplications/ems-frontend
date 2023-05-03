import { Component } from '@angular/core';
import {Dialog, DialogRef} from '@angular/cdk/dialog';

@Component({
  selector: 'ui-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(public dialogRef: DialogRef) {}
}
