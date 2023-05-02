import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListBoxModule,
  ListBoxToolbarConfig,
} from '@progress/kendo-angular-listbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeoProperties } from '../../components/geospatial-map/geospatial-map.interface';

/** All available fields */
export const ALL_FIELDS: (keyof GeoProperties)[] = [
  'coordinates',
  'city',
  'countryName',
  'countryCode',
  'district',
  'region',
  // 'street',
  'subRegion',
  'address',
];

/** Component for the selection of the interest fields from geospatial question */
@Component({
  selector: 'safe-geofields-listbox',
  standalone: true,
  imports: [CommonModule, ListBoxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './geofields-listbox.component.html',
  styleUrls: ['./geofields-listbox.component.scss'],
})
export class GeofieldsListboxComponent implements OnInit, OnChanges {
  @Input() selectedFields: (keyof GeoProperties)[] = [];
  public availableFields: (keyof GeoProperties)[] = ALL_FIELDS;
  public toolbarSettings: ListBoxToolbarConfig = {
    position: 'right',
    tools: [
      'moveUp',
      'moveDown',
      'transferFrom',
      'transferTo',
      'transferAllFrom',
      'transferAllTo',
    ],
  };
  @Output() selectionChange = new EventEmitter();

  ngOnInit(): void {
    this.availableFields = ALL_FIELDS.filter(
      (x) => !this.selectedFields.includes(x)
    );
  }

  ngOnChanges(): void {
    this.availableFields = ALL_FIELDS.filter(
      (x) => !this.selectedFields.includes(x)
    );
  }

  /** Emits select fields on action click */
  handleActionClick(): void {
    this.selectionChange.emit(this.selectedFields);
  }
}
