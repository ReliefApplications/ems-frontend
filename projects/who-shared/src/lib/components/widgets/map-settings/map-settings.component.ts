import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { GetResourcesQueryResponse, GET_RESOURCES, GetFormsQueryResponse, GET_FORMS,
  GetResourceByIdQueryResponse, GET_RESOURCE_BY_ID, GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../../graphql/queries';

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
  public sources = [];
  public fields = [];
  public forms: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo
  ) { }

  /*  Build the settings form, using the widget saved parameters.
  */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: [(tileSettings && tileSettings.title) ? tileSettings.title : null],
      source: [(tileSettings && tileSettings.source) ? tileSettings.source : null],
      latitude: [(tileSettings && tileSettings.latitude) ? tileSettings.latitude : null],
      longitude: [(tileSettings && tileSettings.longitude) ? tileSettings.longitude : null],
      zoom: [(tileSettings && tileSettings.zoom) ? tileSettings.zoom : null],
      centerLong: [(tileSettings && tileSettings.centerLong) ? tileSettings.centerLong : null, [Validators.min(-180), Validators.max(180)]],
      centerLat: [(tileSettings && tileSettings.centerLat) ? tileSettings.centerLat : null, [Validators.min(-90), Validators.max(90)]],
      from: [(tileSettings && tileSettings.from) ? tileSettings.from : 'resource', Validators.required]
    });
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    this.getSources({ value: this.tileForm.get('from').value }, true);

    if (tileSettings.source) {
      this.getSource({ value: tileSettings.source });
    }
  }

  /*  Load the list of resources or forms.
  */
  getSources(e: any, init?: boolean): void {
    if (e.value === 'resource') {
      this.apollo.query<GetResourcesQueryResponse>({
        query: GET_RESOURCES
      }).subscribe(res => {
        this.sources = res.data.resources.map(source => source = { id: source.id, name: source.name });
        if (!init) {
          this.tileForm.get('source').setValue(null);
          this.tileForm.get('latitude').setValue(null);
          this.tileForm.get('longitude').setValue(null);
        }
        this.fields = [];
      });
    } else {
      this.apollo.query<GetFormsQueryResponse>({
        query: GET_FORMS
      }).subscribe(res => {
        this.sources = res.data.forms.map(source => source = { id: source.id, name: source.name });
        if (!init) {
          this.tileForm.get('source').setValue(null);
          this.tileForm.get('latitude').setValue(null);
          this.tileForm.get('longitude').setValue(null);
        }
        this.fields = [];
      });
    }
  }

  /*  Load a resource or a form.
  */
  getSource(e: any): void {
    if (this.tileForm.controls.from.value === 'resource') {
      this.apollo.query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: e.value
        }
      }).subscribe(res => {
        this.fields = res.data.resource.fields;
        this.forms = res.data.resource.forms;
      });
    } else {
      this.apollo.query<GetFormByIdQueryResponse>({
        query: GET_FORM_BY_ID,
        variables: {
          id: e.value
        }
      }).subscribe(res => {
        this.fields = res.data.form.fields;
        this.forms = [{ id: res.data.form.id, name: res.data.form.name }];
      });
    }
  }
}
