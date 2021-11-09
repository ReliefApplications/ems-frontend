import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../models/application.model';

@Component({
  selector: 'safe-applications-summary',
  templateUrl: './applications-summary.component.html',
  styleUrls: ['./applications-summary.component.scss']
})
export class SafeApplicationsSummaryComponent implements OnInit {

  @Input() canCreate = false;
  @Input() applications: Application[] = [];
  @Output() add = new EventEmitter();
  @Output() openApplication = new EventEmitter<Application>();

  constructor() { }

  ngOnInit(): void {
  }

}
