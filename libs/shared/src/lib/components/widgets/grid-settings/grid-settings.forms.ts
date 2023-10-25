import { FormArray, FormBuilder, Validators } from '@angular/forms';
import get from 'lodash/get';
import {
  addNewField,
  createQueryForm,
} from '../../query-builder/query-builder-forms';

/** Default action name */
const DEFAULT_ACTION_NAME = 'Action';

/** TODO: Replace once we have UI */
const DEFAULT_CONTEXT_FILTER = `{
  "logic": "and",
  "filters": []
}`;

/** Creating a new instance of the FormBuilder class. */
const fb = new FormBuilder();

/**
 * Floating button form factory.
 *
 * @param value default value ( if any )
 * @returns new form group for the floating button.
 */
export const createButtonFormGroup = (value: any) => {
  const formGroup = fb.group({
    show: [value && value.show ? value.show : false, Validators.required],
    name: [
      value && value.name ? value.name : DEFAULT_ACTION_NAME,
      Validators.required,
    ],
    selectAll: [value && value.selectAll ? value.selectAll : false],
    selectPage: [value && value.selectPage ? value.selectPage : false],
    goToNextStep: [get(value, 'goToNextStep', false)],
    goToPreviousStep: [get(value, 'goToPreviousStep', false)],
    prefillForm: [value && value.prefillForm ? value.prefillForm : false],
    prefillTargetForm: [
      value && value.prefillTargetForm ? value.prefillTargetForm : null,
      value && value.prefillForm ? Validators.required : null,
    ],
    closeWorkflow: [value && value.closeWorkflow ? value.closeWorkflow : false],
    confirmationText: [
      value && value.confirmationText ? value.confirmationText : '',
      value && value.closeWorkflow ? Validators.required : null,
    ],
    autoSave: [value && value.autoSave ? value.autoSave : false],
    modifySelectedRows: [value ? value.modifySelectedRows : false],
    modifications: fb.array(
      value && value.modifications && value.modifications.length
        ? value.modifications.map((x: any) =>
            fb.group({
              field: [x.field, Validators.required],
              value: [x.value, Validators.required],
            })
          )
        : []
    ),
    attachToRecord: [get(value, 'attachToRecord', false)],
    targetResource: [get(value, 'targetResource', null)],
    targetForm: [get(value, 'targetForm', null)],
    targetFormField: [get(value, 'targetFormField', null)],
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
      get(value, 'distributionList', null),
      value && value.sendMail ? Validators.required : null,
    ],
    templates: [
      get(value, 'templates', []),
      value && value.sendMail ? Validators.required : null,
    ],
    export: [value && value.export ? value.export : false],
    bodyFields: fb.array(
      value && value.bodyFields
        ? value.bodyFields.map((x: any) => addNewField(x))
        : [],
      value && value.sendMail ? Validators.required : null
    ),
  });
  // Avoid goToNextStep & goToPreviousStep to coexist
  if (formGroup.get('goToNextStep')?.value) {
    formGroup.get('goToPreviousStep')?.setValue(false);
  } else if (formGroup.get('goToPreviousStep')?.value) {
    formGroup.get('goToNextStep')?.setValue(false);
  }
  formGroup.get('goToNextStep')?.valueChanges.subscribe((value) => {
    if (value) {
      formGroup.get('goToPreviousStep')?.setValue(false);
    }
  });
  formGroup.get('goToPreviousStep')?.valueChanges.subscribe((value) => {
    if (value) {
      formGroup.get('goToNextStep')?.setValue(false);
    }
  });
  return formGroup;
};

/**
 * Create a grid widget form group.
 *
 * @param id id of the widget
 * @param configuration previous configuration
 * @returns form group
 */
export const createGridWidgetFormGroup = (id: string, configuration: any) => {
  const formGroup = fb.group({
    id,
    title: [get(configuration, 'title', ''), Validators.required],
    resource: [get(configuration, 'resource', null), Validators.required],
    template: [get(configuration, 'template', null)],
    layouts: [get(configuration, 'layouts', []), Validators.required],
    aggregations: [get(configuration, 'aggregations', []), Validators.required],
    actions: createGridActionsFormGroup(configuration),
    floatingButtons: fb.array(
      configuration.floatingButtons && configuration.floatingButtons.length
        ? configuration.floatingButtons.map((x: any) =>
            createButtonFormGroup(x)
          )
        : [createButtonFormGroup(null)]
    ),
    sortFields: new FormArray([]),
    contextFilters: [
      get(configuration, 'contextFilters', DEFAULT_CONTEXT_FILTER),
    ],
    at: get(configuration, 'at', ''),
  });
  return formGroup;
};

/**
 * Creates a form group for the grid settings with the given grid actions configuration
 *
 * @param configuration configuration to build up the grid actions form group
 * @returns form group with the given grid actions configuration
 */
export const createGridActionsFormGroup = (configuration: any) => {
  const formGroup = fb.group({
    delete: [get(configuration, 'actions.delete', true)],
    history: [get(configuration, 'actions.history', true)],
    convert: [get(configuration, 'actions.convert', true)],
    update: [get(configuration, 'actions.update', true)],
    inlineEdition: [get(configuration, 'actions.inlineEdition', true)],
    addRecord: [get(configuration, 'actions.addRecord', false)],
    export: [get(configuration, 'actions.export', true)],
    showDetails: [get(configuration, 'actions.showDetails', true)],
    navigateToPage: [get(configuration, 'actions.navigateToPage', false)],
    navigateSettings: fb.group({
      pageUrl: [get(configuration, 'actions.navigateSettings.pageUrl', '')],
      useRecordId: [
        get(configuration, 'actions.navigateSettings.useRecordId', false),
      ],
      title: [
        get(configuration, 'actions.navigateSettings.title', 'Details view'),
      ],
    }),
  });
  // Set validators ot navigate to page title option, based on other params
  const setValidatorsNavigateToPageTitle = (value: boolean) => {
    if (value) {
      formGroup
        .get('navigateSettings.title')
        ?.setValidators(Validators.required);
    } else {
      formGroup.get('navigateSettings.title')?.clearValidators();
    }
    formGroup.get('navigateSettings.title')?.updateValueAndValidity();
  };
  // Initialize
  setValidatorsNavigateToPageTitle(formGroup.get('navigateToPage')?.value);
  // Subscribe to changes
  formGroup.get('navigateToPage')?.valueChanges.subscribe((value) => {
    setValidatorsNavigateToPageTitle(value);
  });
  return formGroup;
};
