import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { GetResourcesQueryResponse, GET_RESOURCES, GetFormsQueryResponse,
  GET_FORMS, GetResourceByIdQueryResponse, GET_RESOURCE_BY_ID, GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../../graphql/queries';

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

  // === PARENT ===
  // public sources: any[] = [];
  // public fields: any[] = [];
  // public forms: any[] = [];

  // === CHILD ===
  // public subSources: any[] = [];
  // public subFields: any[] = [];
  // public subForms: any[] = [];

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
      title: [(tileSettings && tileSettings.title) ? tileSettings.title : '', Validators.required],
      query: [(tileSettings && tileSettings.query) ? tileSettings.query : '', Validators.required]
      // sortable: [(tileSettings && tileSettings.sortable) ? true : false, Validators.required],
      // pageable: [(tileSettings && tileSettings.pageable) ? true : false, Validators.required],
      // filterable: [(tileSettings && tileSettings.filterable) ? true : false, Validators.required],
      // from: [(tileSettings && tileSettings.from) ? tileSettings.from : 'resource', Validators.required],
      // editable: [(tileSettings && tileSettings.editable) ? true : false, Validators.required],
      // source: [(tileSettings && tileSettings.source) ? tileSettings.source : null, Validators.required],
      // fields: [(tileSettings && tileSettings.fields) ? tileSettings.fields : null, Validators.required],
      // toolbar: [(tileSettings && tileSettings.toolbar) ? true : false],
      // canAdd: [(tileSettings && tileSettings.canAdd) ? true : false],
      // addTemplate: [(tileSettings && tileSettings.addTemplate) ? tileSettings.addTemplate : null],
      // canExpand: [(tileSettings && tileSettings.canExpand) ? true : false],
      // childGrid: this.formBuilder.group({
      //   sortable: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.sortable) ? true : false],
      //   pageable: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.pageable) ? true : false],
      //   filterable: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.filterable) ? true : false],
      //   from: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.from) ?
      //     tileSettings.childGrid.from : 'resource'],
      //   editable: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.editable) ? true : false],
      //   source: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.source) ?
      //     tileSettings.childGrid.source : null],
      //   fields: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.fields) ?
      //     tileSettings.childGrid.fields : null],
      //   filter: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.filter) ?
      //     tileSettings.childGrid.filter : null],
      //   toolbar: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.toolbar) ? true : false],
      //   canAdd: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.canAdd) ? true : false],
      //   addTemplate: [(tileSettings && tileSettings.childGrid && tileSettings.childGrid.addTemplate) ?
      //     tileSettings.childGrid.addTemplate : null],
      // })
    });
    this.change.emit(this.tileForm);
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    // this.getSources({ value: this.tileForm.get('from').value }, true);
    // this.getSubSources({ value: this.tileForm.get('childGrid.from').value }, true);

    // if (tileSettings.source) {
    //   this.getSource({ value: tileSettings.source });
    // }
    // if (tileSettings.childGrid && tileSettings.childGrid.source) {
    //   this.getSubSource({ value: tileSettings.childGrid.source });
    // }
  }

  /*  Load the list of resources or forms.
  */
  // getSources(e: any, init?: boolean): void {
  //   if (e.value === 'resource') {
  //     this.apollo.query<GetResourcesQueryResponse>({
  //       query: GET_RESOURCES
  //     }).subscribe(res => {
  //       this.sources = res.data.resources.map(source => source = { id: source.id, name: source.name });
  //       if (!init) {
  //         this.tileForm.get('source').setValue(null);
  //         this.tileForm.get('fields').setValue(null);
  //         this.tileForm.get('addTemplate').setValue(null);
  //       }
  //       this.fields = [];
  //     });
  //   } else {
  //     this.apollo.query<GetFormsQueryResponse>({
  //       query: GET_FORMS
  //     }).subscribe(res => {
  //       this.sources = res.data.forms.map(source => source = { id: source.id, name: source.name });
  //       if (!init) {
  //         this.tileForm.get('source').setValue(null);
  //         this.tileForm.get('fields').setValue(null);
  //         this.tileForm.get('addTemplate').setValue(null);
  //       }
  //       this.fields = [];
  //     });
  //   }
  // }

  /*  Load the list of resources or forms for child grid.
  */
  // getSubSources(e: any, init?: boolean): void {
  //   if (e.value === 'resource') {
  //     this.apollo.query<GetResourcesQueryResponse>({
  //       query: GET_RESOURCES
  //     }).subscribe(res => {
  //       this.subSources = res.data.resources.map(source => source = { id: source.id, name: source.name });
  //       if (!init) {
  //         this.tileForm.get('childGrid.source').setValue(null);
  //         this.tileForm.get('childGrid.fields').setValue(null);
  //         this.tileForm.get('childGrid.filter').setValue(null);
  //         this.tileForm.get('childGrid.addTemplate').setValue(null);
  //       }
  //       this.subFields = [];
  //     });
  //   } else {
  //     this.apollo.query<GetFormsQueryResponse>({
  //       query: GET_FORMS
  //     }).subscribe(res => {
  //       this.subSources = res.data.forms.map(source => source = { id: source.id, name: source.name });
  //       if (!init) {
  //         this.tileForm.get('childGrid.source').setValue(null);
  //         this.tileForm.get('childGrid.fields').setValue(null);
  //         this.tileForm.get('childGrid.filter').setValue(null);
  //         this.tileForm.get('childGrid.addTemplate').setValue(null);
  //       }
  //       this.subFields = [];
  //     });
  //   }
  // }

  /*  Load a resource or a form.
  */
  // getSource(e: any): void {
  //   if (this.tileForm.controls.from.value === 'resource') {
  //     this.apollo.query<GetResourceByIdQueryResponse>({
  //       query: GET_RESOURCE_BY_ID,
  //       variables: {
  //         id: e.value
  //       }
  //     }).subscribe(res => {
  //       this.fields = res.data.resource.fields;
  //       this.forms = res.data.resource.forms;
  //     });
  //   } else {
  //     this.apollo.query<GetFormByIdQueryResponse>({
  //       query: GET_FORM_BY_ID,
  //       variables: {
  //         id: e.value
  //       }
  //     }).subscribe(res => {
  //       this.fields = res.data.form.fields;
  //       this.forms = [{ id: res.data.form.id, name: res.data.form.name }];
  //     });
  //   }
  // }

  /*  Load a resource or a form for child grid.
  */
  // getSubSource(e: any): void {
  //   const childGrid = this.tileForm.controls.childGrid as FormGroup;
  //   if (childGrid.controls.from.value === 'resource') {
  //     this.apollo.query<GetResourceByIdQueryResponse>({
  //       query: GET_RESOURCE_BY_ID,
  //       variables: {
  //         id: e.value
  //       }
  //     }).subscribe(res => {
  //       this.subFields = res.data.resource.fields;
  //       this.subForms = res.data.resource.forms;
  //     });
  //   } else {
  //     this.apollo.query<GetFormByIdQueryResponse>({
  //       query: GET_FORM_BY_ID,
  //       variables: {
  //         id: e.value
  //       }
  //     }).subscribe(res => {
  //       this.subFields = res.data.form.fields;
  //       this.subForms = [{ id: res.data.form.id, name: res.data.form.name }];
  //     });
  //   }
  // }
}
