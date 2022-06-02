import {
  Component,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { AlertVariant } from './alert-variant.enum';

/** Simple alert message component */
@Component({
  selector: 'safe-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class SafeAlertComponent implements OnChanges {
  @Input() variant: AlertVariant | string = AlertVariant.DEFAULT;
  @Input() closable = true;

  @Output() closed = new EventEmitter<Event>();

  // alert is being displayed
  open = true;

  // alert is in closing animation
  closing = false;

  ngOnChanges(_: SimpleChanges): void {
    this.open = true;
    this.closing = false;
  }

  /** Closes the alert and emits an event */
  close() {
    setTimeout(() => {
      this.open = false;
      this.closed.emit();
    }, 300);
    this.closing = true;
  }
}
