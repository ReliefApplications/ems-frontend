import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import get from 'lodash/get';

/**
 * Component for the popup of a marker on the map
 */
@Component({
  selector: 'safe-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss'],
})
export class SafeMapPopupComponent implements OnInit, AfterViewInit {
  @Input() fields: string[] = [];
  @Input() data: any;
  @Output() loaded = new EventEmitter();

  public popupRows: { label: string; value: any }[] = [];

  ngOnInit(): void {
    this.popupRows = this.setPopupContent();
  }

  ngAfterViewInit(): void {
    this.loaded.emit(true);
  }

  /**
   * Get the content to display.
   *
   * @returns list of popup rows to display
   */
  private setPopupContent(): any[] {
    const popupRows: { label: string; value: any }[] = [];
    for (const field of this.fields) {
      const value = field
        .split('.')
        .reduce((val, nestedField) => val[nestedField] || undefined, this.data);
      if (value !== undefined) {
        popupRows.push({ label: field, value });
      }
    }
    return popupRows;
  }
}
