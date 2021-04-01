import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
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
  public channels: Channel[] = [];

  // === FLOATING BUTTON ===
  public fields: any[];
  public queryName: string;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private applicationService: WhoApplicationService,
    private queryBuilder: QueryBuilderService
  ) {
  }

  /*  Build the settings form, using the widget saved parameters.
  */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    const hasActions = !!tileSettings && !!tileSettings.actions;

    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: [(tileSettings && tileSettings.title) ? tileSettings.title : '', Validators.required],
      query: this.queryBuilder.createQueryForm(tileSettings.query),
      actions: this.formBuilder.group({
        delete: [hasActions ? tileSettings.actions.delete : true],
        history: [hasActions ? tileSettings.actions.history : true],
        convert: [hasActions ? tileSettings.actions.convert : true],
        update: [hasActions ? tileSettings.actions.update : true]
      }),
      floatingButton: this.createFloatingButtonForm(tileSettings.floatingButton)
    });

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

    this.tileForm.get('query').valueChanges.subscribe(res => {
      if (res.name) {
        if (this.fields && (res.name !== this.queryName)) {
          const modifications = this.tileForm.get('floatingButton.modifications') as FormArray;
          modifications.clear();
          this.tileForm.get('floatingButton.modifySelectedRows').setValue(false);
        }
        this.fields = this.queryBuilder.getFields(res.name);
        this.queryName = res.name;
      } else {
        this.fields = [];
      }
    });
  }

  private createFloatingButtonForm(value: any): FormGroup {
    const buttonForm = this.formBuilder.group({
      show: [value && value.show ? value.show : false, Validators.required],
      name: [value && value.name ? value.name : 'Next'],
      goToNextStep: [value && value.goToNextStep ? value.goToNextStep : false],
      passDataToNextStep: [value && value.passDataToNextStep ? value.passDataToNextStep : false],
      autoSave: [value && value.autoSave ? value.autoSave : false],
      modifySelectedRows: [value ? value.modifySelectedRows : false],
      modifications: this.formBuilder.array(value && value.modifications.length
        ? value.modifications.map(x => this.formBuilder.group({
          field: [x.field, Validators.required],
          value: [x.value, Validators.required],
        }))
        : []),
      notify: [value && value.notify ? value.notify : false],
      notificationChannel: [value && value.notificationChannel ? value.notificationChannel : null,
      value && value.notify ? Validators.required : null],
      notificationMessage: [value && value.notificationMessage ? value.notificationMessage : 'Records update'],
      publish: [value && value.publish ? value.publish : false],
      publicationChannel: [value && value.publicationChannel ? value.publicationChannel : null,
      value && value.publish ? Validators.required : null]
    });
    return buttonForm;
  }
}
