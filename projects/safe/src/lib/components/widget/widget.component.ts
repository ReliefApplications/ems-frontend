import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'safe-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class SafeWidgetComponent implements OnInit {

  @Input() widget: any;
  @Input() header = true;

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToRelativeStep: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
}
