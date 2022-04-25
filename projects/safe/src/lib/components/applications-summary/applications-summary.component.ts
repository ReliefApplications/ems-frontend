import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Application } from '../../models/application.model';

@Component({
  selector: 'safe-applications-summary',
  templateUrl: './applications-summary.component.html',
  styleUrls: ['./applications-summary.component.scss'],
})
export class SafeApplicationsSummaryComponent implements OnInit {
  @Input() loading = false;
  @Input() canCreate = false;
  @Input() applications: Application[] = [];
  @Output() add = new EventEmitter();
  @Output() openApplication = new EventEmitter<string>();
  @Output() preview = new EventEmitter<Application>();
  @Output() delete = new EventEmitter<Application>();
  @Output() clone = new EventEmitter<Application>();
  @Output() editAccess = new EventEmitter<Application>();

  constructor() {}

  ngOnInit(): void {}
}
