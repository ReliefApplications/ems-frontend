import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import get from 'lodash/get';

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

  constructor() {}

  ngOnInit(): void {
    console.log(this.item);
    console.log(this.fields);
    this.popupRows = this.setPopupContent(this.fields);
  }

  ngAfterViewInit(): void {
    this.loaded.emit(true);
  }

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
