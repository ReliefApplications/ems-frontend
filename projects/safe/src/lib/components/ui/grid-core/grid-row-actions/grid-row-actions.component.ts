import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridAction } from '../models/grid-action.model';

@Component({
  selector: 'safe-grid-row-actions',
  templateUrl: './grid-row-actions.component.html',
  styleUrls: ['./grid-row-actions.component.scss']
})
export class SafeGridRowActionsComponent implements OnInit {

  // === DATA ===

  // === ACTIONS ===
  @Input() actions: GridAction[] = [];
  @Output() action = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Emits an action.
   * @param action Action descriptor.
   */
   public onAction(action: string): void {
    this.action.emit({ action, ids: null });
  }
}
