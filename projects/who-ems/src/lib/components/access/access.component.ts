import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WhoEditAccessComponent } from './edit-access/edit-access.component';

@Component({
  selector: 'who-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class WhoAccessComponent implements OnInit {

  // === PERMISSIONS LAYER OF CURRENT OBJECT ===
  @Input() access: any;
  @Input() application: string;

  // === DISPLAY ===
  @Input() menuItem: boolean;

  // === PASS THE RESULT TO PARENT COMPONENT ===
  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void { }

  /*  Display the EditAccess modal.
    Once closed, emit the result if exists.
  */
  onClick(): void {
    const dialogRef = this.dialog.open(WhoEditAccessComponent, {
      data: {
        access: this.access,
        application: this.application
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.save.emit(res);
      }
    });
  }
}
