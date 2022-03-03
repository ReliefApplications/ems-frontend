import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Application } from '../../../../models/application.model';

interface IStatus {
  name: string;
  short: string;
  color: string;
  focusColor: string;
}

@Component({
  selector: 'safe-application-summary',
  templateUrl: './application-summary.component.html',
  styleUrls: ['./application-summary.component.scss'],
})
export class SafeApplicationSummaryComponent implements OnInit {
  @Input() application!: Application;
  @Output() preview = new EventEmitter();
  @Output() access = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() clone = new EventEmitter();
  @Output() editAccess = new EventEmitter();

  statuses: IStatus[] = [
    {
      name: 'active',
      short: 'A',
      color: 'rgba(149, 221, 101, 0.2)',
      focusColor: '#95DD65',
    },
    {
      name: 'pending',
      short: 'P',
      color: 'rgba(244, 174, 82, 0.2)',
      focusColor: '#F4AE52',
    },
    {
      name: 'archived',
      short: 'D',
      color: 'rgba(241, 67, 67, 0.19)',
      focusColor: '#F14343',
    },
  ];

  get status(): IStatus | undefined {
    return this.statuses.find((x) => x.name === this.application.status);
  }

  constructor(translate: TranslateService) {
    this.statuses[0].short = translate
      .instant('status.active')[0]
      .toUpperCase();
    this.statuses[1].short = translate
      .instant('status.pending')[0]
      .toUpperCase();
    this.statuses[2].short = translate
      .instant('status.archived')[0]
      .toUpperCase();
  }

  ngOnInit(): void {}
}
