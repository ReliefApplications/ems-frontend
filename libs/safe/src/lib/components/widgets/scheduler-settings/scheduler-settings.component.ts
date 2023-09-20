import { Apollo } from 'apollo-angular';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import {
  GET_RESOURCE_BY_ID,
  GET_FORM_BY_ID,
} from '../../../../graphql/queries/public-api';
import { ResourceQueryResponse } from '../../../models/resource.model';
import { FormQueryResponse } from '../../../models/form.model';

/** A component for the scheduler settings */
@Component({
  selector: 'safe-scheduler-settings',
  templateUrl: './scheduler-settings.component.html',
  styleUrls: ['./scheduler-settings.component.scss'],
})
/** Modal content for the settings of the scheduler widgets. */
export class SafeSchedulerSettingsComponent implements OnInit {
  // === REACTIVE FORM ===
  tileForm: UntypedFormGroup = new UntypedFormGroup({});

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === DATA ===
  public sources: any[] = [];
  public fields: any[] = [];
  public forms: any[] = [];

  /**
   * Constructor of the scheduler settings component
   *
   * @param formBuilder The form builder
   * @param apollo The apollo client
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apollo: Apollo
  ) {}

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: [
        tileSettings && tileSettings.title
          ? tileSettings.title
          : 'New scheduler',
      ],
      from: [
        tileSettings && tileSettings.from ? tileSettings.from : 'resource',
        Validators.required,
      ],
      source: [
        tileSettings && tileSettings.source ? tileSettings.source : null,
        Validators.required,
      ],
      events: this.formBuilder.group({
        title: [
          tileSettings && tileSettings.events && tileSettings.events.title
            ? tileSettings.events.title
            : null,
          Validators.required,
        ],
        description: [
          tileSettings && tileSettings.events && tileSettings.events.description
            ? tileSettings.events.description
            : null,
        ],
        startDate: [
          tileSettings && tileSettings.events && tileSettings.events.startDate
            ? tileSettings.events.startDate
            : null,
          Validators.required,
        ],
        endDate: [
          tileSettings && tileSettings.events && tileSettings.events.endDate
            ? tileSettings.events.endDate
            : null,
        ],
      }),
    });
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    // this.getSources({ value: this.tileForm.get('from')?.value }, true);
    if (tileSettings.source) {
      this.getSource({ value: tileSettings.source });
    }
  }

  /**
   * Load the list of resources or forms.
   */
  getSources(): void {
    // if (e.value === 'resource') {
    //   this.apollo.query<GetResourcesQueryResponse>({
    //     query: GET_RESOURCES
    //   }).subscribe(({ data }) => {
    //     this.sources = data.resources.edges.map(x => x.node.source = { id: source.id, name: source.name });
    //     if (!init) {
    //       this.tileForm.get('source')?.setValue(null);
    //       this.tileForm.get('events.title')?.setValue(null);
    //       this.tileForm.get('events.description')?.setValue(null);
    //       this.tileForm.get('events.startDate')?.setValue(null);
    //       this.tileForm.get('events.endDate')?.setValue(null);
    //     }
    //     this.fields = [];
    //   });
    // } else {
    //   this.apollo.query<GetFormsQueryResponse>({
    //     query: GET_FORMS
    //   }).subscribe(({ data }) => {
    //     this.sources = data.forms.map(source => source = { id: source.id, name: source.name });
    //     if (!init) {
    //       this.tileForm.get('source')?.setValue(null);
    //       this.tileForm.get('events.title')?.setValue(null);
    //       this.tileForm.get('events.description')?.setValue(null);
    //       this.tileForm.get('events.startDate')?.setValue(null);
    //       this.tileForm.get('events.endDate')?.setValue(null);
    //     }
    //     this.fields = [];
    //   });
    // }
  }

  /**
   * Load a resource or a form.
   *
   * @param event An event or any object with a value attribute
   */
  getSource(event: any): void {
    if (this.tileForm.controls.from.value === 'resource') {
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE_BY_ID,
          variables: {
            id: event,
          },
        })
        .subscribe(({ data }) => {
          this.fields = data.resource.fields || [];
          this.forms = data.resource.forms || [];
        });
    } else {
      this.apollo
        .query<FormQueryResponse>({
          query: GET_FORM_BY_ID,
          variables: {
            id: event,
          },
        })
        .subscribe(({ data }) => {
          this.fields = data.form.fields || [];
          this.forms = [{ id: data.form.id, name: data.form.name }];
        });
    }
  }
}
