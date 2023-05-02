import { Directive, Input, Output, EventEmitter } from '@angular/core';

/**
 * UI sidenav directive
 */
@Directive({
  selector: '[uiSidenavDirective]',
  exportAs: 'uiSidenavDirective',
})
export class SidenavDirective {
  @Input() opened = true;
  @Output() openedChange = new EventEmitter<boolean>();

  /** Handles the toggle of the sidenav status */
  public toggle() {
    this.opened = !this.opened;
    this.openedChange.emit(this.opened);
  }
}
