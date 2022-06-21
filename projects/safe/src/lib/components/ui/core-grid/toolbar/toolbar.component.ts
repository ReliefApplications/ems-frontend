import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/** Component for the grid toolbar */
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

  /** @returns A boolean indicating if the toolbar must be shown */
  get display(): boolean {
    return this.actions.delete || this.actions.update || this.actions.convert;
  }

  /** @returns A boolean indicating if there are updatable items */
  get canUpdate(): boolean {
    return !this.items.some((x) => x.canUpdate);
  }

  /** @returns A boolean indicating if there are deletable items */
  get canDelete(): boolean {
    return !this.items.some((x) => x.canDelete);
  }

  /** Constructor of this component */
  constructor() {}

  ngOnInit(): void {}
}
