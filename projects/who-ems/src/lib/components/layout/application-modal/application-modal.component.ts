import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Application } from '../../../models/application.model';

@Component({
  selector: 'who-application-modal',
  templateUrl: './application-modal.component.html',
  styleUrls: ['./application-modal.component.css']
})
export class ApplicationModalComponent implements OnInit {
  @Output() openApplication: EventEmitter<Application> = new EventEmitter();


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

   /* Emit the application to open
  */
 onOpenApplication(application: Application): void {
  this.openApplication.emit(application);
}

}
