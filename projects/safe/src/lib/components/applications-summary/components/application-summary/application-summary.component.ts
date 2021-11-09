import { Component, Input, OnInit } from '@angular/core';
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

  get status(): IStatus | undefined {
    return STATUSES.find(x => x.name === this.application.status);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
