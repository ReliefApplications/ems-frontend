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
    });
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });
    // this.availableQueries.subscribe((res) => {
    //   if (res) {
    //     this.availableDetailsType = this.queryBuilder.getListFields(this.tileForm.value.queryType);
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
    //   this.availableDetailsType = this.queryBuilder.getListFields(res);
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
}
