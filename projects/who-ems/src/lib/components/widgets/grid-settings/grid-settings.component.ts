import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { GetChannelsQueryResponse, GET_CHANNELS } from '../../../graphql/queries';
import { Application } from '../../../models/application.model';
import { Channel } from '../../../models/channel.model';
import { WhoApplicationService } from '../../../services/application.service';
import { QueryBuilderService } from '../../../services/query-builder.service';

@Component({
  selector: 'who-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss']
})
/*  Modal content for the settings of the grid widgets.
*/
export class WhoGridSettingsComponent implements OnInit {

  // === REACTIVE FORM ===
  tileForm: FormGroup;
  showFilter = false;
  showDetailsFilter = false;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === PARENT ===
  // public forms: any[] = [];

  // === CHILD ===
  // public subForms: any[] = [];

  // === QUERY BUILDER ===
  public availableQueries: Observable<any[]>;
  public availableFields: any[];
  public availableFilter: any[];
  public availableDetailsType: any[];
  public availableDetailsFields: any[];
  public availableDetailsFilter: any[];

  // === NOTIFICATIONS ===
  public channels: Channel[];

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private applicationService: WhoApplicationService
  ) { }

  /*  Build the settings form, using the widget saved parameters.
  */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: [(tileSettings && tileSettings.title) ? tileSettings.title : '', Validators.required],
      query: this.formBuilder.group({
        name: ['', Validators.required],
        fields: [null, Validators.required],
        sort: this.formBuilder.group({
          field: [''],
          order: ['asc']
        }),
        filter: this.formBuilder.group({})
      }),
      channel: [(tileSettings && tileSettings.channel) ? tileSettings.channel : null]
      // queryType: [(tileSettings && tileSettings.queryType) ? tileSettings.queryType : '', Validators.required],
      // fields: [(tileSettings && tileSettings.fields) ? tileSettings.fields : null, Validators.required],
      // sortField: [(tileSettings && tileSettings.sortField) ? tileSettings.sortField : null],
      // sortOrder: [(tileSettings && tileSettings.sortOrder) ? tileSettings.sortOrder : null],
      // filter: this.formBuilder.group({}),
      // details: this.formBuilder.group({
      //   type: [(tileSettings && tileSettings.details && tileSettings.details.type) ? tileSettings.details.type : null],
      //   fields: [(tileSettings && tileSettings.details && tileSettings.details.fields) ? tileSettings.details.fields : null],
      //   filter: this.formBuilder.group({}),
      // })
    });
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });
    // this.availableQueries = this.queryBuilder.availableQueries;
    // this.availableQueries.subscribe((res) => {
    //   if (res) {
    //     this.availableFields = this.queryBuilder.getFields(this.tileForm.value.queryType);
    //     this.availableFilter = this.queryBuilder.getFilter(this.tileForm.value.queryType);
    //     this.availableDetailsType = this.queryBuilder.getListFields(this.tileForm.value.queryType);
    //     this.tileForm.setControl('filter', this.createFilterGroup(this.tile.settings.filter, this.availableFilter));
    //     const typeName = this.tileForm.get('details.type').value;
    //     if (typeName) {
    //       const type = this.availableDetailsType.find(x => x.name === typeName).type.ofType.name;
    //       this.availableDetailsFields = this.queryBuilder.getFieldsFromType(type);
    //       this.availableDetailsFilter = this.queryBuilder.getFilterFromType(type);
    //       (this.tileForm.get('details') as FormGroup).setControl('filter',
    //         this.createFilterGroup(this.tile.settings.details.filter, this.availableDetailsFilter));
    //     }
    //   }
    // });
    // this.tileForm.controls.queryType.valueChanges.subscribe((res) => {
    //   this.availableFields = this.queryBuilder.getFields(res);
    //   this.availableFilter = this.queryBuilder.getFilter(res);
    //   this.availableDetailsType = this.queryBuilder.getListFields(res);
    //   this.tileForm.setControl('filter', this.createFilterGroup(this.tile.settings.filter, this.availableFilter));
    // });
    // this.tileForm.get('details.type').valueChanges.subscribe((res) => {
    //   if (res) {
    //     const type = this.availableDetailsType.find(x => x.name === res).type.ofType.name;
    //     this.availableDetailsFields = this.queryBuilder.getFieldsFromType(type);
    //     this.availableDetailsFilter = this.queryBuilder.getFilterFromType(type);
    //     this.tileForm.get('details.fields').setValue(null);
    //     (this.tileForm.get('details') as FormGroup).setControl('filter',
    //       this.createFilterGroup(this.tile.settings.details.filter, this.availableDetailsFilter));
    //   } else {
    //     this.availableDetailsFields = [];
    //     this.availableDetailsFilter = [];
    //   }
    // });
    this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.apollo.watchQuery<GetChannelsQueryResponse>({
          query: GET_CHANNELS,
          variables: {
            application: application.id
          }
        }).valueChanges.subscribe(res => {
          this.channels = res.data.channels;
        });
      } else {
        this.apollo.watchQuery<GetChannelsQueryResponse>({
          query: GET_CHANNELS,
        }).valueChanges.subscribe(res => {
          this.channels = res.data.channels;
        });
      }
    });
  }

  // private createFilterGroup(filter: any, availableFilter: any): FormGroup {
  //   const group = availableFilter.reduce((o, key) => {
  //     return ({...o, [key.name]: [(filter && ( filter[key.name] || filter[key.name] === false ) ? filter[key.name] : null )]});
  //   }, {});
  //   return this.formBuilder.group(group);
  // }

  // public toggleFilter(): void {
  //   this.showFilter = !this.showFilter;
  // }

  // public toggleDetailsFilter(): void {
  //   this.showDetailsFilter = !this.showDetailsFilter;
  // }
}
