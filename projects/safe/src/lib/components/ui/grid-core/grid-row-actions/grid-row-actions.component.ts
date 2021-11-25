import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'safe-grid-row-actions',
  templateUrl: './grid-row-actions.component.html',
  styleUrls: ['./grid-row-actions.component.scss']
})
export class SafeGridRowActionsComponent implements OnInit {

  // === DATA ===
  @Input() item: any;

  // === ACTIONS ===
  @Input() actions = {
    update: false,
    delete: false,
    history: false,
    convert: false
  };
  @Output() action = new EventEmitter();

  get display(): boolean {
    return this.actions.history ||
      this.actions.delete ||
      this.actions.update ||
      this.actions.convert;
  }

  constructor() { }

  ngOnInit(): void {
  }
}
