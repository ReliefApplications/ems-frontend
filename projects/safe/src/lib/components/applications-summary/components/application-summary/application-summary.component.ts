import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../../../models/application.model';

const STATUSES: IStatus[] = [
  {
    name: 'active',
    short: 'A',
    color: 'rgba(149, 221, 101, 0.2)',
    focusColor: '#95DD65'
  },
  {
    name: 'pending',
    short: 'P',
    color: 'rgba(244, 174, 82, 0.2)',
    focusColor: '#F4AE52'
  },
  {
    name: 'archived',
    short: 'D',
    color: 'rgba(241, 67, 67, 0.19)',
    focusColor: '#F14343'
  }
];

interface IStatus {
  name: string;
  short: string;
  color: string;
  focusColor: string;
}

@Component({
  selector: 'safe-application-summary',
  templateUrl: './application-summary.component.html',
  styleUrls: ['./application-summary.component.scss']
})
export class SafeApplicationSummaryComponent implements OnInit {

  @Input() application!: Application;
  @Output() preview = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() clone = new EventEmitter();
  @Output() editAccess = new EventEmitter();

  get status(): IStatus | undefined {
    return STATUSES.find(x => x.name === this.application.status);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
