import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import get from 'lodash/get';
import {
  addNewField,
  createQueryForm,
} from '../../query-builder/query-builder-forms';

/** Default action name */
const DEFAULT_ACTION_NAME = 'Action';

/** Creating a new instance of the FormBuilder class. */
const fb = new FormBuilder();

/**
 * Floating button form factory.
 *
 * @param value default value ( if any )
 * @returns new form group for the floating button.
 */
export const createButtonFormGroup = (value: any): FormGroup => {
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
    bodyFields: fb.array(
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
): FormGroup => {
  const formGroup = fb.group({
    id,
    title: [
      configuration && configuration.title ? configuration.title : '',
      Validators.required,
    ],
    query: fb.group({
      name: [
        configuration.query ? configuration.query.name : '',
        Validators.required,
      ],
      template: [configuration.query ? configuration.query.template : '', null],
    }),
    layouts: [configuration?.layouts || [], Validators.required],
    resource: [
      configuration && configuration.resource ? configuration.resource : null,
    ],
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
