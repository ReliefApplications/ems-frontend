import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { GetChannelsQueryResponse, GET_CHANNELS } from '../../../graphql/queries';
import { Application } from '../../../models/application.model';
import { Channel } from '../../../models/channel.model';
import { WhoApplicationService } from '../../../services/application.service';

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

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === NOTIFICATIONS ===
  public channels: Channel[];

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private applicationService: WhoApplicationService,
    private queryBuilder: QueryBuilderService
  ) { }

  /*  Build the settings form, using the widget saved parameters.
  */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    console.log(tileSettings.query);
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: [(tileSettings && tileSettings.title) ? tileSettings.title : '', Validators.required],
      query: this.queryBuilder.createQueryForm(tileSettings.query),
      channel: [(tileSettings && tileSettings.channel) ? tileSettings.channel : null]
    });
    console.log(this.tileForm.get('query').value);
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });
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
