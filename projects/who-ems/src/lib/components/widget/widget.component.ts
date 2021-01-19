import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'who-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WhoWidgetComponent implements OnInit {

  @Input() widget: any;
  @Input() header = true;

  @Output() dataChanges: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
