import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'safe-grid-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})

/**
 * Custom toolbar that we use in the safe-grid component to interact with the admin features
 */
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

  /**
   * Gets a boolean indicating if the toolbar should be displayed.
   *
   * @returns Returns true if any of the actions is true.
   */
  get display(): boolean {
    return this.actions.delete || this.actions.update || this.actions.convert;
  }

  /**
   * Gets a boolean indicating if the grid can be updated.
   *
   * @returns Returns true if the option is available
   */
  get canUpdate(): boolean {
    return !this.items.some((x) => x.canUpdate);
  }

  /**
   * Gets a boolean indicating if the grid can be deleted.
   *
   * @returns Returns true if the option is available
   */
  get canDelete(): boolean {
    return !this.items.some((x) => x.canDelete);
  }

  /**
   * Constructor for safe-toolbar component
   */
  constructor() {}

  ngOnInit(): void {}
}
