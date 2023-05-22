import {
  Component,
  Input,
  OnChanges,
  Output,
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
  @Input() closable = false;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<Event>();

  // alert is being displayed
  display = true;

  // alert is in closing animation
  closing = false;

  ngOnChanges(): void {
    this.closing = false;
  }

  /** Closes the alert and emits an event */
  onClose() {
    setTimeout(() => {
      this.display = false;
      this.close.emit();
    }, 300);
    this.closing = true;
  }
}
