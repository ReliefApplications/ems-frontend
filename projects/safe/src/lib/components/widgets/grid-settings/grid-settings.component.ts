import { Apollo } from 'apollo-angular';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder.service';
import {
  GetChannelsQueryResponse,
  GetRelatedFormsQueryResponse,
  GET_CHANNELS,
  GET_RELATED_FORMS
} from '../../../graphql/queries';
import { Application } from '../../../models/application.model';
import { Channel } from '../../../models/channel.model';
import { SafeApplicationService } from '../../../services/application.service';
import { Form } from '../../../models/form.model';

@Component({
  selector: 'safe-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss']
})
/*  Modal content for the settings of the grid widgets.
*/
export class SafeGridSettingsComponent implements OnInit, AfterViewInit {

  // === REACTIVE FORM ===
  tileForm: FormGroup | undefined;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === NOTIFICATIONS ===
  public channels: Channel[] = [];

  // === FLOATING BUTTON ===
  public fields: any[] = [];
  public queryName = '';
  public relatedForms: Form[] = [];
  public tabIndex = 0;

  // === TEMPLATE USED FOR EDITION AND DETAILS VIEW ===
  public templates: Form[] = [];

  get floatingButtons(): FormArray {
    return this.tileForm?.controls.floatingButtons as FormArray || null;
  }

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
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
      resource: [tileSettings && tileSettings.resource ? tileSettings.resource : null],
      actions: this.formBuilder.group({
        delete: [hasActions ? tileSettings.actions.delete : true],
        history: [hasActions ? tileSettings.actions.history : true],
        convert: [hasActions ? tileSettings.actions.convert : true],
        update: [hasActions ? tileSettings.actions.update : true],
        inlineEdition: [hasActions ? tileSettings.actions.inlineEdition : true],
        addRecord: [hasActions ? tileSettings.actions.addRecord : false],
      }),
      floatingButtons: this.formBuilder.array(tileSettings.floatingButtons && tileSettings.floatingButtons.length ?
        tileSettings.floatingButtons.map((x: any) => this.createFloatingButtonForm(x)) : [this.createFloatingButtonForm(null)])
    });
    this.queryName = this.tileForm.get('query')?.value.name;

    this.tileForm.get('query')?.valueChanges.subscribe(res => {
      if (res.name) {
        // Check if the query changed to clean modifications and fields for email in floating button
        if (res.name !== this.queryName) {
          this.queryName = res.name;
          const floatingButtons = this.tileForm?.get('floatingButtons') as FormArray;
          for (const floatingButton of floatingButtons.controls) {
            const modifications = floatingButton.get('modifications') as FormArray;
            modifications.clear();
            this.tileForm?.get('floatingButton.modifySelectedRows')?.setValue(false);
            const bodyFields = floatingButton.get('bodyFields') as FormArray;
            bodyFields.clear();
          }
        }
        this.fields = this.queryBuilder.getFields(res.name);
        const query = this.queryBuilder.sourceQuery(this.queryName);
        if (query) {
          query.subscribe((res1: { data: any }) => {
            // eslint-disable-next-line no-underscore-dangle
            const source = res1.data[`_${this.queryName}Meta`]._source;
            this.tileForm?.get('resource')?.setValue(source);
            if (source) {
              this.apollo.query<GetRelatedFormsQueryResponse>({
                query: GET_RELATED_FORMS,
                variables: {
                  resource: source
                }
              }).subscribe(res2 => {
                if (res2.errors) {
                  this.relatedForms = [];
                  this.templates = [];
                } else {
                  this.relatedForms = res2.data.resource.relatedForms || [];
                  this.templates = res2.data.resource.forms || [];
                }
              });
            }
          });
        } else {
          this.relatedForms = [];
          this.templates = [];
        }
      } else {
        this.fields = [];
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.tileForm) {
      this.tileForm.valueChanges.subscribe(() => {
        this.change.emit(this.tileForm);
      });

      this.applicationService.application$.subscribe((application: Application | null) => {
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

  private createFloatingButtonForm(value: any): FormGroup {
    const buttonForm = this.formBuilder.group({
      show: [value && value.show ? value.show : false, Validators.required],
      name: [value && value.name ? value.name : 'Next'],
      selectAll: [value && value.selectAll ? value.selectAll : false],
      goToNextStep: [value && value.goToNextStep ? value.goToNextStep : false],
      prefillForm: [value && value.prefillForm ? value.prefillForm : false],
      prefillTargetForm: [value && value.prefillTargetForm ? value.prefillTargetForm : null,
        value && value.prefillForm ? Validators.required : null],
      closeWorkflow: [value && value.closeWorkflow ? value.closeWorkflow : false],
      confirmationText: [value && value.confirmationText ? value.confirmationText : '',
        value && value.closeWorkflow ? Validators.required : null],
      autoSave: [value && value.autoSave ? value.autoSave : false],
      modifySelectedRows: [value ? value.modifySelectedRows : false],
      modifications: this.formBuilder.array(value && value.modifications && value.modifications.length
        ? value.modifications.map((x: any) => this.formBuilder.group({
          field: [x.field, Validators.required],
          value: [x.value, Validators.required],
        }))
        : []),
      attachToRecord: [value && value.attachToRecord ? value.attachToRecord : false],
      targetForm: [value && value.targetForm ? value.targetForm : null],
      targetFormField: [value && value.targetFormField ? value.targetFormField : null],
      targetFormQuery: this.queryBuilder.createQueryForm(value && value.targetFormQuery ? value.targetFormQuery : null,
        Boolean(value && value.targetForm)),
      notify: [value && value.notify ? value.notify : false],
      notificationChannel: [value && value.notificationChannel ? value.notificationChannel : null,
        value && value.notify ? Validators.required : null],
      notificationMessage: [value && value.notificationMessage ? value.notificationMessage : 'Records update'],
      publish: [value && value.publish ? value.publish : false],
      publicationChannel: [value && value.publicationChannel ? value.publicationChannel : null,
        value && value.publish ? Validators.required : null],
      sendMail: [value && value.sendMail ? value.sendMail : false],
      distributionList: [value && value.distributionList ? value.distributionList : [],
        value && value.sendMail ? Validators.required : null],
      subject: [value && value.subject ? value.subject : '',
        value && value.sendMail ? Validators.required : null],
      export: [value && value.export ? value.export : false],
      bodyFields: this.formBuilder.array((value && value.bodyFields) ?
        value.bodyFields.map((x: any) => this.queryBuilder.addNewField(x)) : [],
        value && value.sendMail ? Validators.required : null),
      bodyText: [value && value.bodyText ? value.bodyText : '']
    });
    return buttonForm;
  }

  public addFloatingButton(): void {
    const floatingButtons = this.tileForm?.get('floatingButtons') as FormArray;
    floatingButtons.push(this.createFloatingButtonForm({show: true}));
  }

  public deleteFloatingButton(): void {
    const floatingButtons = this.tileForm?.get('floatingButtons') as FormArray;
    floatingButtons.removeAt(this.tabIndex);
    this.tabIndex = 0;
  }
}
