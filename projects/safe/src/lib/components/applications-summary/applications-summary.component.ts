import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Application } from '../../models/application.model';

/**
 * This component is used to display the most recent applications and a button to create a new application
 */
@Component({
  selector: 'safe-applications-summary',
  templateUrl: './applications-summary.component.html',
  styleUrls: ['./applications-summary.component.scss'],
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

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   */
  constructor() {}

  ngOnInit(): void {}
}
