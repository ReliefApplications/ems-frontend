import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Application } from '@safe/builder';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  @Input() applications: Application[] = [];
  @Output() openEvent = new EventEmitter();
  public loading = false;

  constructor() { }

  ngOnInit(): void { }
}
