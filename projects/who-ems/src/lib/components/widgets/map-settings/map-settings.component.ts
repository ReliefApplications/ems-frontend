import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { QueryBuilderService } from '../../../services/query-builder.service';

@Component({
  selector: 'who-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss']
})
/*  Modal content for the settings of the map widgets.
*/
export class WhoMapSettingsComponent implements OnInit {

  // === REACTIVE FORM ===
  tileForm: FormGroup;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === DATA ===
  public forms: any[] = [];

  // === QUERY BUILDER ===
  public availableQueries: Observable<any[]>;
  public availableFields: any[];

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService
  ) { }

  /*  Build the settings form, using the widget saved parameters.
  */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: [(tileSettings && tileSettings.title) ? tileSettings.title : null],
      query: [(tileSettings && tileSettings.query) ? tileSettings.query : '', Validators.required],
      latitude: [(tileSettings && tileSettings.latitude) ? tileSettings.latitude : null],
      longitude: [(tileSettings && tileSettings.longitude) ? tileSettings.longitude : null],
      zoom: [(tileSettings && tileSettings.zoom) ? tileSettings.zoom : null],
      centerLong: [(tileSettings && tileSettings.centerLong) ? tileSettings.centerLong : null, [Validators.min(-180), Validators.max(180)]],
      centerLat: [(tileSettings && tileSettings.centerLat) ? tileSettings.centerLat : null, [Validators.min(-90), Validators.max(90)]],
      queryType: [(tileSettings && tileSettings.queryType) ? tileSettings.queryType : ''],
      fields: [(tileSettings && tileSettings.fields) ? tileSettings.fields : null],
      sortField: [(tileSettings && tileSettings.sortField) ? tileSettings.sortField : null],
      sortOrder: [(tileSettings && tileSettings.sortField) ? tileSettings.sortField : null],
    });
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    this.availableQueries = this.queryBuilder.availableQueries;
    this.availableQueries.subscribe((res) => {
      if (res) { this.availableFields = this.queryBuilder.getFields(this.tileForm.value.queryType); }
    });
    this.tileForm.controls.queryType.valueChanges.subscribe((res) => {
      this.availableFields = this.queryBuilder.getFields(res);
    });
  }
}
