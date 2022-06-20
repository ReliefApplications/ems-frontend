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
 * Map Popup component.
 */
@Component({
  selector: 'safe-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss'],
})
export class MapPopupComponent implements OnInit, AfterViewInit {
  @Input() item: any;
  @Input() fields: any[] = [];
  @Output() loaded = new EventEmitter();

  public popupRows: { label: string; value: any }[] = [];

  /**
   * Map Popup component.
   */
  constructor() {}

  ngOnInit(): void {
    this.popupRows = this.setPopupContent(this.fields);
  }

  ngAfterViewInit(): void {
    this.loaded.emit(true);
  }

  /**
   * Get the content to display.
   *
   * @param fields list of available fiels
   * @param prefix prefix to apply to field names
   * @returns list of popup rows to display
   */
  private setPopupContent(fields: any[], prefix = ''): any[] {
    let popupRows: { label: string; value: any }[] = [];
    for (const field of fields) {
      console.log(prefix + field.name);
      if (field.fields) {
        popupRows = popupRows.concat(
          this.setPopupContent(field.fields, prefix + field.name + '.')
        );
      } else {
        const value = get(this.item, prefix + field.name, null);
        if (value) {
          popupRows.push({ label: field.label, value });
        }
      }
    }
    return popupRows;
  }
}
