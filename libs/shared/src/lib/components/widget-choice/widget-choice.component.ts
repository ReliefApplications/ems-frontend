import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IWidgetType } from '../../models/dashboard.model';

/**
 * Component for widget choice
 */
@Component({
  selector: 'shared-widget-choice',
  templateUrl: './widget-choice.component.html',
  styleUrls: ['./widget-choice.component.scss'],
})
export class WidgetChoiceComponent {
  /** Hovered status */
  public hovered = '';
  /** Collapsed status */
  public collapsed = false;
  /** Floating status */
  @Input() floating = false;
  /** Widget types */
  @Input() widgetTypes?: IWidgetType[];
  /** Add event emitter */
  @Output() add: EventEmitter<string> = new EventEmitter();
  /** Close event emitter */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();

  /**
   * Emit an add event on selection
   *
   * @param e The event of the selection
   */
  public onSelect(e: any): void {
    this.add.emit(e);
  }
}
