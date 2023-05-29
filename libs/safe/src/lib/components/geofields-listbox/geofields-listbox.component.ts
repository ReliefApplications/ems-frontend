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
import { Geofield } from '@oort-front/safe';
import { Apollo, QueryRef } from 'apollo-angular';
import { GetGeoFieldsQueryResponse, GET_GEOFIELDS, GetNotificationsQueryResponse, GET_NOTIFICATIONS } from './graphql/queries';
import { EditGeoFieldMutationResponse, EDIT_GEOFIELD } from './graphql/mutations';

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
  @Input() selectedFields: (keyof GeoProperties)[] = [];
  private geofields: Geofield[] = [];
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

  constructor(public dialog: MatDialog, private apollo: Apollo){}

  ngOnInit(): void {
    this.availableFields = ALL_FIELDS.filter(
      (x) => !this.selectedFields.includes(x)
    );

    const teste = this.apollo.watchQuery<GetGeoFieldsQueryResponse>({
      query: GET_GEOFIELDS
    });
    teste.valueChanges.subscribe(
      ({ data }) =>
        console.log(data)
    );

    const teste2 = this.apollo.watchQuery<GetNotificationsQueryResponse>({
      query: GET_NOTIFICATIONS
    });
    teste2.valueChanges.subscribe(
      ({ data }) =>
        console.log(data)
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

  async editLabel(geofield: Geofield): Promise<void> {
    const { EditGeofieldComponent} = await import(
      './edit-geofield/edit-geofield.component'
    );
    const dialogRef = this.dialog.open(EditGeofieldComponent, {
      data: {
        geofield,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        alert(value);
      }
    });
  }
}
