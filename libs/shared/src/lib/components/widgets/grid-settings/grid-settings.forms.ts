import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import get from 'lodash/get';
import { LocalizedString } from '../../../models/localized-string.model';
import { localizedRequired } from '../../../utils/validators/localizedRequired.validator';
import {
  addNewField,
  createFilterGroup,
  createQueryForm,
} from '../../query-builder/query-builder-forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { ActionButton } from '../grid/action-button.type';
import { Role } from '../../../models/user.model';
import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationService } from '../../../services/application/application.service';
import { Subject, takeUntil } from 'rxjs';

/** Default action name */
const DEFAULT_ACTION_NAME = 'Action';

/** TODO: Replace once we have UI */
const DEFAULT_CONTEXT_FILTER = `{
  "logic": "and",
  "filters": []
}`;

/**
 * Grid settings form factory
 */
export class GridSettingsFormFactory {
  /** Roles from current application */
  public roles: Role[];
  /** Form Builder */
  private fb!: FormBuilder;
  /** Application Service */
  private applicationService!: ApplicationService;
  /** Translate Service */
  private translate!: TranslateService;

  /**
   * Grid settings form factory
   *
   * @param injector Angular injector
   * @param destroy$ Destroy reference
   */
  constructor(private injector: Injector, public destroy$: Subject<boolean>) {
    this.fb = this.injector.get(FormBuilder);
    this.applicationService = this.injector.get(ApplicationService);
    this.translate = this.injector.get(TranslateService);
    this.roles = this.applicationService.application.value?.roles || [];
  }

  /**
   * Create Grid Action.
   *
   * @param value default value ( if any )
   * @returns Grid Action Form Group
   */
  createGridActionFormGroup = (value: any) => {
    const formGroup = this.fb.group({
      show: [value && value.show ? value.show : false, Validators.required],
      name: [
        (value && value.name
          ? value.name
          : DEFAULT_ACTION_NAME) as LocalizedString,
        localizedRequired,
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
      closeWorkflow: [
        value && value.closeWorkflow ? value.closeWorkflow : false,
      ],
      confirmationText: [
        value && value.confirmationText ? value.confirmationText : '',
        value && value.closeWorkflow ? Validators.required : null,
      ],
      autoSave: [value && value.autoSave ? value.autoSave : false],
      modifySelectedRows: [value ? value.modifySelectedRows : false],
      modifications: this.fb.array(
        value && value.modifications && value.modifications.length
          ? value.modifications.map((x: any) =>
              this.fb.group({
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
        value && value.sendMail && !value.sendSeparateEmail
          ? Validators.required
          : null,
      ],
      templates: [
        get(value, 'templates', []),
        value && value.sendMail ? Validators.required : null,
      ],
      export: [value && value.export ? value.export : false],
      bodyFields: this.fb.array(
        value && value.bodyFields
          ? value.bodyFields.map((x: any) => addNewField(x))
          : [],
        value && value.sendMail ? Validators.required : null
      ),
      sendSeparateEmail: [get(value, 'sendSeparateEmail', false)],
      separateEmailFields: this.fb.array(
        (get(value, 'separateEmailFields', []) as any[]).map((x: any) =>
          addNewField(x)
        )
      ),
      navigateToPage: [
        value && value.navigateToPage ? value.navigateToPage : false,
      ],
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
  public createGridWidgetFormGroup = (id: string, configuration: any) => {
    const formGroup = this.fb.group(
      {
        id,
        title: [
          get(configuration, 'title', '') as LocalizedString,
          localizedRequired,
        ],
        resource: [get(configuration, 'resource', null), Validators.required],
        template: [get(configuration, 'template', null)],
        layouts: [get(configuration, 'layouts', []), Validators.required],
        aggregations: [
          get(configuration, 'aggregations', []),
          Validators.required,
        ],
        actions: this.createGridActionsFormGroup(configuration),
        floatingButtons: this.fb.array(
          configuration.floatingButtons && configuration.floatingButtons.length
            ? configuration.floatingButtons.map((x: any) =>
                this.createGridActionFormGroup(x)
              )
            : [this.createGridActionFormGroup(null)]
        ) as FormArray<FormControl<typeof this.createGridActionFormGroup>>,
        customRowActions: this.fb.array<
          ReturnType<typeof this.createCustomRowActionFormGroup>
        >(
          (configuration.customRowActions || []).map((x: any) =>
            this.createCustomRowActionFormGroup(x)
          )
        ),
        sortFields: new FormArray<any>([]),
        contextFilters: [
          get(configuration, 'contextFilters', DEFAULT_CONTEXT_FILTER),
        ],
        at: get(configuration, 'at', ''),
      },
      {
        validators: [this.templateRequiredWhenAddRecord],
      }
    );
    const extendedForm = extendWidgetForm(
      formGroup,
      configuration?.widgetDisplay
    );
    return extendedForm;
  };

  /**
   * Validators for checking that a template is selected when configuring "add record" action.
   *
   * @param group form group
   * @returns validation errors
   */
  templateRequiredWhenAddRecord = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const templateControl = group.get('template');
    const addRecordControl = group.get('actions.addRecord');

    if (templateControl && addRecordControl) {
      const templateValue = templateControl.value;
      const addRecordValue = addRecordControl.value;

      if (addRecordValue && !templateValue) {
        addRecordControl.setErrors({
          missingTemplate: true,
        });
        return {
          actions: {
            addRecord: {
              missingTemplate: true,
            },
          },
        };
      } else {
        addRecordControl.setErrors(null);
      }
    }
    return null;
  };

  /**
   * Creates a form group for the grid settings with the given grid actions configuration
   *
   * @param configuration configuration to build up the grid actions form group
   * @returns form group with the given grid actions configuration
   */
  createGridActionsFormGroup = (configuration: any) => {
    const formGroup = this.fb.group({
      delete: [get(configuration, 'actions.delete', true)],
      history: [get(configuration, 'actions.history', true)],
      convert: [get(configuration, 'actions.convert', true)],
      update: [get(configuration, 'actions.update', true)],
      inlineEdition: [get(configuration, 'actions.inlineEdition', true)],
      readOnlyFields: [get(configuration, 'actions.readOnlyFields', [])],
      addRecord: [get(configuration, 'actions.addRecord', false)],
      export: [get(configuration, 'actions.export', true)],
      import: [get(configuration, 'actions.import', false)],
      showDetails: [get(configuration, 'actions.showDetails', true)],
      navigateToPage: [get(configuration, 'actions.navigateToPage', false)],
      navigateSettings: this.fb.group({
        pageUrl: [get(configuration, 'actions.navigateSettings.pageUrl', '')],
        field: [get(configuration, 'actions.navigateSettings.field', '')],
        title: [
          get(
            configuration,
            'actions.navigateSettings.title',
            this.translate.instant(
              'components.widget.settings.grid.actions.goTo.column.defaultTitle'
            )
          ) as LocalizedString,
        ],
      }),
    });
    // Set validators ot navigate to page title option, based on other params
    const setValidatorsNavigateToPageTitle = (value: boolean) => {
      if (value) {
        formGroup
          .get('navigateSettings.title')
          ?.setValidators(localizedRequired);
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

  /**
   * Creates a form group for a custom row action, this is the model we save in the database
   *
   * @param value initial value
   * @returns Form group
   */
  public createCustomRowActionFormGroup = (value: ActionButton) => {
    const form = this.fb.group({
      columnLabel: [
        get(value, 'columnLabel', '') as LocalizedString,
        localizedRequired,
      ],
      text: [get(value, 'text', '') as LocalizedString, localizedRequired],
      hasRoleRestriction: [
        get(value, 'hasRoleRestriction', false),
        Validators.required,
      ],
      roles: [get(value, 'roles', [])],
      category: [get(value, 'category', 'secondary')],
      variant: [get(value, 'variant', 'primary')],
      previousPage: [get(value, 'previousPage', false)],
      href: [get(value, 'href', '')],
      openInNewTab: [get(value, 'openInNewTab', true)],
      ...(!!get(value, 'editRecord', false) && {
        editRecord: this.fb.group({
          template: [get(value, 'editRecord.template', '')],
        }),
      }),
      ...(!!get(value, 'cloneRecord', false) && {
        cloneRecord: this.fb.group({
          template: [get(value, 'cloneRecord.template', '')],
          onSave: this.fb.group({
            ...((!!get(
              value,
              'cloneRecord.onSave.navigateTo.targetUrl.href',
              false
            ) ||
              !!get(
                value,
                'cloneRecord.onSave.navigateTo.targetPage.pageUrl',
                false
              )) && {
              navigateTo: this.fb.group({
                ...(!!get(
                  value,
                  'cloneRecord.onSave.navigateTo.targetUrl.href',
                  false
                ) && {
                  targetUrl: this.fb.group({
                    href: [
                      get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetUrl.href',
                        ''
                      ),
                    ],
                    openInNewTab: [
                      get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetUrl.openInNewTab',
                        true
                      ),
                    ],
                  }),
                }),
                ...(!!get(
                  value,
                  'cloneRecord.onSave.navigateTo.targetPage.pageUrl',
                  false
                ) && {
                  targetPage: this.fb.group({
                    pageUrl: [
                      get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetPage.pageUrl',
                        ''
                      ),
                    ],
                    field: [
                      get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetPage.field',
                        ''
                      ),
                    ],
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
      filter: createFilterGroup(get(value, 'filter', null)),
    });
    return form;
  };

  /**
   * Create new custom row action form group, optimized for edition modal
   *
   * @param value initial value
   * @returns Form group
   */
  public createCustomRowActionFormGroupForEdition = (value: ActionButton) => {
    const form = this.fb.group({
      general: this.fb.group({
        columnLabel: [
          get(value, 'columnLabel', '') as LocalizedString,
          localizedRequired,
        ],
        buttonText: [
          get(value, 'text', '') as LocalizedString,
          localizedRequired,
        ],
        hasRoleRestriction: [
          get(value, 'hasRoleRestriction', false),
          Validators.required,
        ],
        roles: [
          get(
            value,
            'roles',
            this.roles.map((role) => role.id || '')
          ),
        ],
        category: [get(value, 'category', 'secondary')],
        variant: [get(value, 'variant', 'primary')],
      }),
      action: this.fb.group(
        {
          navigateTo: this.fb.group(
            {
              enabled: [
                !!get(value, 'href', false) || get(value, 'previousPage'),
              ],
              previousPage: [get(value, 'previousPage', false)],
              targetUrl: this.fb.group({
                enabled: [!!get(value, 'href', false)],
                href: [get(value, 'href', '')],
                openInNewTab: [get(value, 'openInNewTab', true)],
              }),
            },
            { validator: this.navigateToValidator }
          ),
          editRecord: this.fb.group({
            enabled: [!!get(value, 'editRecord', false)],
            template: [get(value, 'editRecord.template', '')],
            autoReload: [get(value, 'editRecord.autoReload', false)],
          }),
          cloneRecord: this.fb.group({
            enabled: [!!get(value, 'cloneRecord', false)],
            template: [get(value, 'cloneRecord.template', '')],
            autoReload: [get(value, 'cloneRecord.autoReload', false)],
            onSave: this.fb.group({
              navigateTo: this.fb.group(
                {
                  // Enabled if one of the two navigateTo options is set
                  enabled: [
                    !!get(
                      value,
                      'cloneRecord.onSave.navigateTo.targetUrl.href',
                      false
                    ) ||
                      !!get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetPage.pageUrl',
                        false
                      ),
                  ],
                  targetUrl: this.fb.group({
                    enabled: [
                      !!get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetUrl.href',
                        false
                      ),
                    ],
                    href: [
                      get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetUrl.href',
                        ''
                      ),
                    ],
                    openInNewTab: [
                      get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetUrl.openInNewTab',
                        true
                      ),
                    ],
                  }),
                  targetPage: this.fb.group({
                    enabled: [
                      !!get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetPage.pageUrl',
                        false
                      ),
                    ],
                    pageUrl: [
                      get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetPage.pageUrl',
                        ''
                      ),
                    ],
                    field: [
                      get(
                        value,
                        'cloneRecord.onSave.navigateTo.targetPage.field',
                        ''
                      ),
                    ],
                  }),
                },
                { validator: this.cloneRecordNavigateToValidator }
              ),
            }),
          }),
        },
        { validator: this.actionValidator }
      ),
      filter: createFilterGroup(get(value, 'filter', null)),
    });

    // Set up mutual exclusivity
    // Between action controls
    this.setupMutualExclusivity([
      form.get('action.navigateTo.enabled'),
      form.get('action.editRecord.enabled'),
      form.get('action.cloneRecord.enabled'),
    ] as AbstractControl[]);
    // Between navigateTo controls
    this.setupMutualExclusivity([
      form.get('action.navigateTo.previousPage'),
      form.get('action.navigateTo.targetUrl.enabled'),
    ] as AbstractControl[]);
    // Between navigateTo controls of clone record action
    this.setupMutualExclusivity([
      form.get('action.cloneRecord.onSave.navigateTo.targetPage.enabled'),
      form.get('action.cloneRecord.onSave.navigateTo.targetUrl.enabled'),
    ] as AbstractControl[]);
    return form;
  };

  /**
   * Utility function to set up mutual exclusivity for a set of controls
   *
   * @param controls Array of controls to set up mutual exclusivity for
   */
  private setupMutualExclusivity = (controls: AbstractControl[]) => {
    controls.forEach((control, index) => {
      control?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: boolean | null) => {
          if (value) {
            controls.forEach((otherControl, otherIndex) => {
              if (index !== otherIndex) {
                otherControl?.setValue(false, { emitEvent: false });
              }
            });
          }
        });
    });
  };

  /**
   * Validator to ensure that at least one action is enabled
   *
   * @param control form group
   * @returns validation errors
   */
  private actionValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const actions = control.value;
    if (actions) {
      const atLeastOneEnabled =
        actions.navigateTo?.enabled ||
        actions.editRecord?.enabled ||
        actions.cloneRecord?.enabled;

      return atLeastOneEnabled ? null : { atLeastOneRequired: true };
    }
    return { atLeastOneRequired: true };
  };

  /**
   * Validator to ensure that at least one navigateTo action is enabled
   *
   * @param control form group
   * @returns validation errors
   */
  private navigateToValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const navigateTo = control.value;
    if (navigateTo?.enabled) {
      const atLeastOneEnabled =
        navigateTo.previousPage || navigateTo.targetUrl?.enabled;
      const hrefValid =
        !navigateTo.targetUrl?.enabled ||
        (navigateTo.targetUrl.enabled && navigateTo.targetUrl.href);
      if (!atLeastOneEnabled) return { atLeastOneRequired: true };
      if (!hrefValid) return { hrefRequired: true };
    }
    return null;
  };

  /**
   * Validator to ensure that at least one clone record navigateTo action is enabled
   *
   * @param control form group
   * @returns validation errors
   */
  private cloneRecordNavigateToValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const navigateTo = control.value;
    if (navigateTo?.enabled) {
      const atLeastOneEnabled =
        navigateTo.targetPage?.enabled || navigateTo.targetUrl?.enabled;
      const hrefValid =
        !navigateTo.targetUrl?.enabled ||
        (navigateTo.targetUrl.enabled && navigateTo.targetUrl.href);
      const pageUrlValid =
        !navigateTo.targetPage?.enabled ||
        (navigateTo.targetPage.enabled && navigateTo.targetPage.pageUrl);
      if (!atLeastOneEnabled) return { atLeastOneRequired: true };
      if (!hrefValid) return { hrefRequired: true };
      if (!pageUrlValid) return { pageUrlRequired: true };
    }
    return null;
  };
}
