import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'safe-grid-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class SafeGridToolbarComponent implements OnInit {
  // === DATA ===
  @Input() items: any[] = [];

  // === ACTIONS ===
  @Input() actions = {
    update: false,
    delete: false,
    history: false,
    convert: false,
  };
  @Output() action = new EventEmitter();

  get display(): boolean {
    return this.actions.delete || this.actions.update || this.actions.convert;
  }

  get canUpdate(): boolean {
    return !this.items.some((x) => !x.canUpdate);
  }

  get canDelete(): boolean {
    return !this.items.some((x) => !x.canDelete);
  }

  constructor() {}

  ngOnInit(): void {}
}
