import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

/**
 * UI ExpansionPanel component
 */
@Component({
  selector: 'ui-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
  animations: [
    trigger('contentExpansion', [
      state(
        'expanded',
        style({ height: '*', opacity: 1, visibility: 'visible' })
      ),
      state(
        'collapsed',
        style({ height: '0px', opacity: 0, visibility: 'hidden' })
      ),
      transition(
        'expanded <=> collapsed',
        animate('300ms cubic-bezier(.37,1.04,.68,.98)')
      ),
    ]),
    trigger('iconChange', [
      state('up', style({ transform: 'rotate(0deg)' })),
      state('down', style({ transform: 'rotate(180deg)' })),
      transition(
        'up <=> down',
        animate('300ms cubic-bezier(.37,1.04,.68,.98)')
      ),
    ]),
  ],
})
export class ExpansionPanelComponent {
  @Input() title = '';
  @Input() displayIcon = false;
  @Input() disabled = false;
  @Input() expanded = false;
  @Input() index = '0';
  @Output() closePanel = new EventEmitter<any>();

  /**
   * Function detects on close and emit
   */
  onClosed() {
    console.log('closed');
    this.closePanel.emit(true);
  }
}
