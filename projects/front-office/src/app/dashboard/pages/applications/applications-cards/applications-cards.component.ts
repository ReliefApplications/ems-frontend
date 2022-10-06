import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Application } from '@safe/builder';

/**
 * Component used to display applications informations
 */
@Component({
  selector: 'app-cards',
  templateUrl: './applications-cards.component.html',
  styleUrls: ['./applications-cards.component.scss'],
})
export class ApplicationsCardsComponent implements OnInit {
  /** List of applications we want to display */
  @Input() applications: Application[] = [];
  /** The user favorite page */
  @Input() favorite = '';
  /** Event emitter when clicking on an application card */
  @Output() openEvent = new EventEmitter();
  /** Is the application loading */
  public loading = false;

  /**
   * Component used to display applications informations
   */
  constructor() {}

  ngOnInit(): void {}
}
