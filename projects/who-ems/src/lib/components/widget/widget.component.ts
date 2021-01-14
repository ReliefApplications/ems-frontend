import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'who-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WhoWidgetComponent implements OnInit {

  @Input() widget: any;
  @Input() header = true;

  @Output() toggleHistory: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  toggleHistoryEvent(event) {
    this.toggleHistory.emit(event);
  }

}
