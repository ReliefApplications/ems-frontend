import { Apollo } from 'apollo-angular';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder.service';
import {
  GetChannelsQueryResponse,
  GET_CHANNELS,
  GET_GRID_FORM_META,
  GetFormByIdQueryResponse,
  GET_GRID_RESOURCE_META,
  GetResourceByIdQueryResponse,
} from '../../../graphql/queries';
import { Application } from '../../../models/application.model';
import { Channel } from '../../../models/channel.model';
import { SafeApplicationService } from '../../../services/application.service';
import { Form } from '../../../models/form.model';
import {
  addNewField,
  createQueryForm,
} from '../../query-builder/query-builder-forms';
import { Observable } from 'rxjs';
import { Overlay } from '@angular/cdk/overlay';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { scrollFactory } from '../../../utils/scroll-factory';
import { Layout } from '../../../models/layout.model';
import { Resource } from '../../../models/resource.model';

/**
 * Modal content for the settings of the grid widgets.
 */
@Component({
  selector: 'safe-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss'],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
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

  // === DATASET AND TEMPLATES ===
  public templates: Form[] = [];
  public availableQueries?: Observable<any[]>;
  public allQueries: any[] = [];
  public filteredQueries: any[] = [];
  public form: Form | null = null;
  public resource: Resource | null = null;

  get floatingButtons(): FormArray {
    return (this.tileForm?.controls.floatingButtons as FormArray) || null;
  }

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
    private queryBuilder: QueryBuilderService
  ) {}

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    const hasActions = !!tileSettings && !!tileSettings.actions;
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: [
        tileSettings && tileSettings.title ? tileSettings.title : '',
        Validators.required,
      ],
      query: this.formBuilder.group({
        name: [
          tileSettings.query ? tileSettings.query.name : '',
          Validators.required,
        ],
        template: [tileSettings.query ? tileSettings.query.template : '', null],
      }),
      layouts: [tileSettings?.layouts || [], Validators.required],
      resource: [
        tileSettings && tileSettings.resource ? tileSettings.resource : null,
      ],
      actions: this.formBuilder.group({
        delete: [hasActions ? tileSettings.actions.delete : true],
        history: [hasActions ? tileSettings.actions.history : true],
        convert: [hasActions ? tileSettings.actions.convert : true],
        update: [hasActions ? tileSettings.actions.update : true],
        inlineEdition: [hasActions ? tileSettings.actions.inlineEdition : true],
        addRecord: [hasActions ? tileSettings.actions.addRecord : false],
        showDetails: [
          hasActions && typeof tileSettings.actions.showDetails !== 'undefined'
            ? tileSettings.actions.showDetails
            : true,
        ],
      }),
      floatingButtons: this.formBuilder.array(
        tileSettings.floatingButtons && tileSettings.floatingButtons.length
          ? tileSettings.floatingButtons.map((x: any) =>
              this.createFloatingButtonForm(x)
            )
          : [this.createFloatingButtonForm(null)]
      ),
    });
    this.availableQueries = this.queryBuilder.availableQueries$;
    this.availableQueries.subscribe((res) => {
      if (res && res.length > 0) {
        this.allQueries = res.map((x) => x.name);
        this.filteredQueries = this.filterQueries(
          this.tileForm?.value.query.name
        );
      }
    });
    this.tileForm?.get('query.name')?.valueChanges.subscribe((res) => {
      this.filteredQueries = this.filterQueries(res);
    });

    this.queryName = this.tileForm.get('query')?.value.name;
    this.getQueryMetaData();

    this.tileForm.get('query.name')?.valueChanges.subscribe((name) => {
      if (name) {
        // Check if the query changed to clean modifications and fields for email in floating button
        if (name !== this.queryName) {
          this.queryName = name;
          this.tileForm?.get('layouts')?.setValue([]);
          this.tileForm?.get('query.template')?.setValue(null);
          this.tileForm?.get('query.template')?.enable();
          const floatingButtons = this.tileForm?.get(
            'floatingButtons'
          ) as FormArray;
          for (const floatingButton of floatingButtons.controls) {
            const modifications = floatingButton.get(
              'modifications'
            ) as FormArray;
            modifications.clear();
            this.tileForm
              ?.get('floatingButton.modifySelectedRows')
              ?.setValue(false);
            const bodyFields = floatingButton.get('bodyFields') as FormArray;
            bodyFields.clear();
          }
        }
        this.getQueryMetaData();
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

      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.apollo
              .watchQuery<GetChannelsQueryResponse>({
                query: GET_CHANNELS,
                variables: {
                  application: application.id,
                },
              })
              .valueChanges.subscribe((res) => {
                this.channels = res.data.channels;
              });
          } else {
            this.apollo
              .watchQuery<GetChannelsQueryResponse>({
                query: GET_CHANNELS,
              })
              .valueChanges.subscribe((res) => {
                this.channels = res.data.channels;
              });
          }
        }
      );
    }
  }

  /**
   * Floating button form factory.
   *
   * @param value default value ( if any )
   * @returns new form group for the floating button.
   */
  private createFloatingButtonForm(value: any): FormGroup {
    const buttonForm = this.formBuilder.group({
      show: [value && value.show ? value.show : false, Validators.required],
      name: [value && value.name ? value.name : 'Next'],
      selectAll: [value && value.selectAll ? value.selectAll : false],
      selectPage: [value && value.selectPage ? value.selectPage : false],
      goToNextStep: [value && value.goToNextStep ? value.goToNextStep : false],
      prefillForm: [value && value.prefillForm ? value.prefillForm : false],
      prefillTargetForm: [
        value && value.prefillTargetForm ? value.prefillTargetForm : null,
        value && value.prefillForm ? Validators.required : null,
      ],
      closeWorkflow: [
        value && value.closeWorkflow ? value.closeWorkflow : false,
      ],
      confirmationText: [
        value && value.confirmationText ? value.confirmationText : '',
        value && value.closeWorkflow ? Validators.required : null,
      ],
      autoSave: [value && value.autoSave ? value.autoSave : false],
      modifySelectedRows: [value ? value.modifySelectedRows : false],
      modifications: this.formBuilder.array(
        value && value.modifications && value.modifications.length
          ? value.modifications.map((x: any) =>
              this.formBuilder.group({
                field: [x.field, Validators.required],
                value: [x.value, Validators.required],
              })
            )
          : []
      ),
      attachToRecord: [
        value && value.attachToRecord ? value.attachToRecord : false,
      ],
      targetForm: [value && value.targetForm ? value.targetForm : null],
      targetFormField: [
        value && value.targetFormField ? value.targetFormField : null,
      ],
      targetFormQuery: createQueryForm(
        value && value.targetFormQuery ? value.targetFormQuery : null,
        Boolean(value && value.targetForm)
      ),
      notify: [value && value.notify ? value.notify : false],
      notificationChannel: [
        value && value.notificationChannel ? value.notificationChannel : null,
        value && value.notify ? Validators.required : null,
      ],
      notificationMessage: [
        value && value.notificationMessage
          ? value.notificationMessage
          : 'Records update',
      ],
      publish: [value && value.publish ? value.publish : false],
      publicationChannel: [
        value && value.publicationChannel ? value.publicationChannel : null,
        value && value.publish ? Validators.required : null,
      ],
      sendMail: [value && value.sendMail ? value.sendMail : false],
      distributionList: [
        value && value.distributionList ? value.distributionList : [],
        value && value.sendMail ? Validators.required : null,
      ],
      subject: [
        value && value.subject ? value.subject : '',
        value && value.sendMail ? Validators.required : null,
      ],
      export: [value && value.export ? value.export : false],
      bodyFields: this.formBuilder.array(
        value && value.bodyFields
          ? value.bodyFields.map((x: any) => addNewField(x))
          : [],
        value && value.sendMail ? Validators.required : null
      ),
      bodyText: [value && value.bodyText ? value.bodyText : ''],
      bodyTextAlternate: [
        value && value.bodyTextAlternate ? value.bodyTextAlternate : '',
      ],
    });
    return buttonForm;
  }

  /**
   * Adds a floating button configuration.
   */
  public addFloatingButton(): void {
    const floatingButtons = this.tileForm?.get('floatingButtons') as FormArray;
    floatingButtons.push(this.createFloatingButtonForm({ show: true }));
  }

  /**
   * Deletes a floating button configuration.
   */
  public deleteFloatingButton(): void {
    const floatingButtons = this.tileForm?.get('floatingButtons') as FormArray;
    floatingButtons.removeAt(this.tabIndex);
    this.tabIndex = 0;
  }

  /**
   * Gets query metadata for grid settings, from the query name
   */
  private getQueryMetaData(): void {
    this.fields = this.queryBuilder.getFields(this.queryName);
    const query = this.queryBuilder.sourceQuery(this.queryName);
    if (query) {
      query.subscribe((res1: { data: any }) => {
        // eslint-disable-next-line no-underscore-dangle
        const source = res1.data[`_${this.queryName}Meta`]._source;
        this.tileForm?.get('resource')?.setValue(source);
        if (source) {
          this.apollo
            .query<GetResourceByIdQueryResponse>({
              query: GET_GRID_RESOURCE_META,
              variables: {
                resource: source,
              },
            })
            .subscribe((res2) => {
              if (res2.errors) {
                this.apollo
                  .query<GetFormByIdQueryResponse>({
                    query: GET_GRID_FORM_META,
                    variables: {
                      id: source,
                    },
                  })
                  .subscribe((res3) => {
                    if (res3.errors) {
                      this.relatedForms = [];
                      this.templates = [];
                      this.form = null;
                      this.resource = null;
                    } else {
                      this.form = res3.data.form;
                      this.resource = null;
                      this.templates = [res3.data.form] || [];
                      this.tileForm
                        ?.get('query.template')
                        ?.setValue(res3.data.form.id);
                      this.tileForm?.get('query.template')?.disable();
                    }
                  });
              } else {
                this.resource = res2.data.resource;
                this.form = null;
                this.relatedForms = res2.data.resource.relatedForms || [];
                this.templates = res2.data.resource.forms || [];
              }
            });
        }
      });
    } else {
      this.relatedForms = [];
      this.templates = [];
      this.form = null;
      this.resource = null;
    }
  }

  /**
   * Filters the queries using text value.
   *
   * @param value search value
   * @returns filtered list of queries.
   */
  private filterQueries(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allQueries.filter((x) => x.toLowerCase().includes(filterValue));
  }
}
