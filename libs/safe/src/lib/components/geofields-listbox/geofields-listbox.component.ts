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
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Geofield } from '../../models/geofield.model';

/** All available fields */
export const ALL_FIELDS: { value: keyof GeoProperties; label: string }[] = [
  { value: 'coordinates', label: 'Coordinates' },
  { value: 'city', label: 'City' },
  { value: 'countryName', label: 'Country Name' },
  { value: 'countryCode', label: 'Country Code' },
  { value: 'district', label: 'District' },
  { value: 'region', label: 'Region' },
  //{ value: 'street', label: 'Street' },
  { value: 'subRegion', label: 'Sub Region' },
  { value: 'address', label: 'Address' },
];

/** Component for the selection of the interest fields from geospatial question */
@Component({
  selector: 'safe-geofields-listbox',
  standalone: true,
  imports: [
    CommonModule,
    ListBoxModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './geofields-listbox.component.html',
  styleUrls: ['./geofields-listbox.component.scss'],
})
export class GeofieldsListboxComponent implements OnInit, OnChanges {
  @Input() selectedFields: { value: keyof GeoProperties; label: string }[] = [];
  public availableFields = ALL_FIELDS;
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

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.availableFields = ALL_FIELDS.filter(
      (x) => !this.selectedFields.some((obj) => obj.value.includes(x.value))
    );
  }

  ngOnChanges(): void {
    this.availableFields = ALL_FIELDS.filter(
      (x) => !this.selectedFields.some((obj) => obj.value.includes(x.value))
    );
  }

  /** Emits select fields on action click */
  handleActionClick(): void {
    this.selectionChange.emit(this.selectedFields);
  }

  /** Open dialog to edit label */
  async editLabel(geofield: Geofield): Promise<void> {
    const { EditGeofieldComponent } = await import(
      './edit-geofield/edit-geofield.component'
    );
    const dialogRef = this.dialog.open(EditGeofieldComponent, {
      data: {
        geofield,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const modified_fields = this.availableFields.map((field) => {
          if (field.value === geofield.value) {
            return { ...field, label: value.label };
          }
          return field;
        });
        this.availableFields = modified_fields;
      }
    });
  }
}
