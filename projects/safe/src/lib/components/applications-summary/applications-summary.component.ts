import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Application } from '../../models/application.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'safe-applications-summary',
  templateUrl: './applications-summary.component.html',
  styleUrls: ['./applications-summary.component.scss']
})
export class SafeApplicationsSummaryComponent implements OnInit {

  @Input() canCreate = false;
  @Input() applications: Application[] = [];
  @Output() add = new EventEmitter();
  @Output() openApplication = new EventEmitter<string>();
  @Output() preview = new EventEmitter<Application>();
  @Output() delete = new EventEmitter<Application>();
  @Output() clone = new EventEmitter<Application>();
  @Output() editAccess = new EventEmitter<Application>();

  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
  }

}
