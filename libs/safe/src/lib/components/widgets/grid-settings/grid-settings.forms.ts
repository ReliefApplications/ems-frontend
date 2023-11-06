import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import get from 'lodash/get';
import {
  addNewField,
  createQueryForm,
} from '../../query-builder/query-builder-forms';

/** Default action name */
const DEFAULT_ACTION_NAME = 'Action';

/** Creating a new instance of the FormBuilder class. */
const fb = new UntypedFormBuilder();

/**
 * Floating button form factory.
 *
 * @param value default value ( if any )
 * @returns new form group for the floating button.
 */
export const createButtonFormGroup = (value: any): UntypedFormGroup => {
  const formGroup = fb.group({
    show: [value && value.show ? value.show : false, Validators.required],
    name: [
      value && value.name ? value.name : DEFAULT_ACTION_NAME,
      Validators.required,
    ],
    selectAll: [value && value.selectAll ? value.selectAll : false],
    selectPage: [value && value.selectPage ? value.selectPage : false],
    goToNextStep: [value && value.goToNextStep ? value.goToNextStep : false],
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
              value: [x.value],
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
  return formGroup;
};

/**
 * Create a grid widget form group.
 *
 * @param id id of the widget
 * @param configuration previous configuration
 * @returns form group
 */
export const createGridWidgetFormGroup = (
  id: string,
  configuration: any
): UntypedFormGroup => {
  const formGroup = fb.group({
    id,
    title: [get(configuration, 'title', ''), Validators.required],
    resource: [get(configuration, 'resource', null), Validators.required],
    template: [get(configuration, 'template', null)],
    layouts: [get(configuration, 'layouts', []), Validators.required],
    aggregations: [get(configuration, 'aggregations', []), Validators.required],
    actions: fb.group({
      delete: [get(configuration, 'actions.delete', true)],
      history: [get(configuration, 'actions.history', true)],
      convert: [get(configuration, 'actions.convert', true)],
      update: [get(configuration, 'actions.update', true)],
      inlineEdition: [get(configuration, 'actions.inlineEdition', true)],
      addRecord: [get(configuration, 'actions.addRecord', false)],
      export: [get(configuration, 'actions.export', true)],
      showDetails: [get(configuration, 'actions.showDetails', true)],
    }),
    floatingButtons: fb.array(
      configuration.floatingButtons && configuration.floatingButtons.length
        ? configuration.floatingButtons.map((x: any) =>
            createButtonFormGroup(x)
          )
        : [createButtonFormGroup(null)]
    ),
  });
  return formGroup;
};
