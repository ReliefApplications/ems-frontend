import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/** Component for grid row actions */
@Component({
  selector: 'safe-grid-row-actions',
  templateUrl: './row-actions.component.html',
  styleUrls: ['./row-actions.component.scss'],
})
export class SafeGridRowActionsComponent implements OnInit {
  // === DATA ===
  @Input() item: any;

  // === ACTIONS ===
  @Input() actions = {
    update: false,
    delete: false,
    history: false,
    convert: false,
    remove: false,
  };
  @Output() action = new EventEmitter();

  /** @returns A boolean indicating if the component must be shown */
  get display(): boolean {
    return (
      this.actions.history ||
      (this.item.canDelete && this.actions.delete) ||
      (this.item.canUpdate &&
        (this.actions.update || this.actions.convert || this.actions.remove))
    );
  }

  /** Constructor of the component */
  constructor() {}

  ngOnInit(): void {}
}
