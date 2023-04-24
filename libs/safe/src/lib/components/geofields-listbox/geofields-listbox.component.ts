import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListBoxModule,
  ListBoxToolbarConfig,
} from '@progress/kendo-angular-listbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeoProperties } from '../../components/geospatial-map/geospatial-map.interface';

@Component({
  selector: 'safe-geofields-listbox',
  standalone: true,
  imports: [CommonModule, ListBoxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './geofields-listbox.component.html',
  styleUrls: ['./geofields-listbox.component.scss'],
})
export class GeofieldsListboxComponent {
  public availableFields: (keyof GeoProperties)[] = [
    'coordinates',
    'city',
    'countryName',
    'countryCode',
    'district',
    'region',
    'street',
    'subRegion',
    'address',
  ];
  @Input() selectedFields: string[] = [];
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

  handleActionClick(): void {
    this.selectionChange.emit(this.selectedFields);
  }
}
