import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Application } from '@safe/builder';

@Component({
  selector: 'app-cards',
  templateUrl: './applications-cards.component.html',
  styleUrls: ['./applications-cards.component.scss']
})
export class ApplicationsCardsComponent implements OnInit {
  @Input() applications: Application[] = [];
  @Input() favorite = '';
  @Output() openEvent = new EventEmitter();
  public loading = false;

  constructor() { }

  ngOnInit(): void { }
}
