import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { GetChannelsQueryResponse, GetRelatedFormsQueryResponse, GET_CHANNELS, GET_RELATED_FORMS } from '../../../graphql/queries';
import { Application } from '../../../models/application.model';
import { Channel } from '../../../models/channel.model';
import { WhoApplicationService } from '../../../services/application.service';
import { Form } from '../../../models/form.model';

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
  public relatedForms: Form[];
  public queryName: string;
  public tabIndex: number;

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
      floatingButtons: this.formBuilder.array(tileSettings.floatingButtons && tileSettings.floatingButtons.length ?
        tileSettings.floatingButtons.map(x => this.createFloatingButtonForm(x)) : [this.createFloatingButtonForm(null)])
    });

    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    // Fetch channels for floating buttons parameters
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

    // Fetch related forms with a question referring to the current form displayed in the grid
    this.queryName = this.tileForm.get('query').value.name;
    this.queryBuilder.resourceQuery(this.queryName).valueChanges.subscribe(res1 => {
      const resource = res1.data[this.queryName][0].resource;
      if (resource) {
        this.apollo.watchQuery<GetRelatedFormsQueryResponse>({
          query: GET_RELATED_FORMS,
          variables: {
            resource
          }
        }).valueChanges.subscribe(res2 => {
          this.relatedForms = res2.data.relatedForms;
        });
      }
    });

    // Clean up modifications field from floating buttons on query change
    this.tileForm.get('query').valueChanges.subscribe(res => {
      if (res.name) {
        if (this.fields && (res.name !== this.queryName)) {
          const floatingButtons = this.tileForm.get('floatingButtons') as FormArray;
          for (const floatingButton of floatingButtons.controls) {
            const modifications = floatingButton.get('modifications') as FormArray;
            modifications.clear();
            floatingButton.get('modifySelectedRows').setValue(false);
          }
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
      modifications: this.formBuilder.array(value && value.modifications && value.modifications.length
        ? value.modifications.map(x => this.formBuilder.group({
          field: [x.field, Validators.required],
          value: [x.value, Validators.required],
        }))
        : []),
      attachToRecord: [value && value.attachToRecord ? value.attachToRecord : false],
      targetForm: [value && value.targetForm ? value.targetForm : null],
      targetFormField: [value && value.targetFormField ? value.targetFormField : null],
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

  public addFloatingButton(): void {
    const floatingButtons = this.tileForm.get('floatingButtons') as FormArray;
    floatingButtons.push(this.createFloatingButtonForm({ show: true }));
    this.tabIndex = floatingButtons.length - 1;
  }

  public deleteFloatingButton(): void {
    const floatingButtons = this.tileForm.get('floatingButtons') as FormArray;
    floatingButtons.removeAt(this.tabIndex);
    this.tabIndex = 0;
  }
}
