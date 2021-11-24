import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridAction } from '../models/grid-action.model';

@Component({
  selector: 'safe-grid-toolbar',
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss']
})
export class SafeGridToolbarComponent implements OnInit {

  // === DATA ===
  @Input() items: any[] = [];

  // === ACTIONS ===
  @Input() actions: GridAction[] = [];
  @Output() action = new EventEmitter();

  get canDeleteItems(): boolean {
    return this.items.some(x => !x.canDelete);
  }

  get canUpdateItems(): boolean {
    return this.items.some(x => !x.canUpdate);
  }

  get canConvertItems(): boolean {
    return this.items.some(x => !x.canUpdate);
  }

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Emits an action.
   * @param action Action descriptor.
   */
  public onAction(action: string): void {
    this.action.emit({ action, ids: this.items.map(x => x.id) });
  }
}
