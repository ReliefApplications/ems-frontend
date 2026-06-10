import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import get from 'lodash/get';
import { GridSettingsFormFactory } from '../grid-settings/grid-settings.forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import isNil from 'lodash/isNil';
import { mutuallyExclusive } from '../../../utils/validators/mutuallyExclusive.validator';
import { createAutomationForm } from '../../../forms/automation.forms';
import { Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalizedString } from '../../../models/localized-string.model';

// todo: put in common
/** Default context filter value. */
const DEFAULT_CONTEXT_FILTER = `{
  "logic": "and",
  "filters": []
}`;

/**
 * Factory for creating summary card settings forms
 */
export class SummaryCardSettingsFormFactory {
  /** Form Builder */
  private fb!: FormBuilder;

  /**
   * Factory for creating summary card settings forms
   *
   * @param injector Angular injector
   * @param destroy$ Destroy reference
   */
  constructor(private injector: Injector, public destroy$: Subject<boolean>) {
    this.fb = this.injector.get(FormBuilder);
  }

  /**
   * Create a summary card form from definition
   *
   * @param id id of the widget
   * @param configuration Widget configuration
   * @returns Summary card widget form
   */
  public createSummaryCardForm = (id: string, configuration: any) => {
    const gridFactory = new GridSettingsFormFactory(
      this.injector,
      this.destroy$
    );
    const formGroup = this.fb.group(
      {
        id,
        title: get<LocalizedString>(configuration, 'title', ''),
        card: this.createCardForm(get(configuration, 'card', null)),
        sortFields: new FormArray<any>([]),
        contextFilters: get<string>(
          configuration,
          'contextFilters',
          DEFAULT_CONTEXT_FILTER
        ),
        actions: gridFactory.createGridActionsFormGroup(configuration),
        at: get<string>(configuration, 'at', ''),
        // Automation
        automationRules: this.fb.array<ReturnType<typeof createAutomationForm>>(
          get(configuration, 'automationRules', []).map((rule: any) =>
            createAutomationForm(rule)
          )
        ),
      },
      {
        validators: [this.templateRequiredWhenAddRecord],
      }
    );

    const isUsingAggregation = !!get(configuration, 'card.aggregation', null);
    const searchable = isUsingAggregation
      ? false
      : get<boolean>(configuration, 'widgetDisplay.searchable', false);

    const extendedForm = extendWidgetForm(
      formGroup,
      configuration?.widgetDisplay,
      {
        searchable: new FormControl(searchable),
        usePagination: new FormControl(
          get<boolean>(configuration, 'widgetDisplay.usePagination', false)
        ),
        usePadding: new FormControl(
          get<boolean>(configuration, 'widgetDisplay.usePadding', true)
        ),
        exportable: new FormControl(
          get<boolean>(configuration, 'widgetDisplay.exportable', true)
        ),
        gridMode: new FormControl(
          get<boolean>(configuration, 'widgetDisplay.gridMode', true)
        ),
      }
    );

    // disable searchable if aggregation is selected
    if (isUsingAggregation)
      extendedForm.get('widgetDisplay.searchable')?.disable();

    return extendedForm;
  };

  /**
   * Create new card form group
   *
   * @param value initial value
   * @returns Form Group
   */
  private createCardForm = (value?: any) => {
    const formGroup = this.fb.group(
      {
        title: get<LocalizedString>(value, 'title', 'New Card'),
        referenceData: get<string | null>(value, 'referenceData', null),
        referenceDataVariableMapping: [
          get<string | null>(value, 'referenceDataVariableMapping', null),
        ],
        resource: get<string | null>(value, 'resource', null),
        template: get<string | null>(value, 'template', null),
        layout: get<string | null>(value, 'layout', null),
        aggregation: get<string | null>(value, 'aggregation', null),
        html: get<LocalizedString | null>(value, 'html', null),
        showDataSourceLink: [
          {
            value: get<boolean>(value, 'showDataSourceLink', false),
            disabled: !isNil(get<string | null>(value, 'referenceData', null)),
          },
        ],
        useStyles: get<boolean>(value, 'useStyles', true),
        wholeCardStyles: get<boolean>(value, 'wholeCardStyles', false),
        usePadding: get<boolean>(value, 'usePadding', true),
      },
      {
        validators: [
          mutuallyExclusive({
            required: true,
            fields: ['resource', 'referenceData'],
          }),
        ],
      }
    );
    if (formGroup.value.resource) {
      formGroup.addValidators(
        mutuallyExclusive({
          required: true,
          fields: ['layout', 'aggregation'],
        })
      );
    }
    formGroup.controls.resource.valueChanges.subscribe((value) => {
      if (value) {
        formGroup.addValidators(
          mutuallyExclusive({
            required: true,
            fields: ['layout', 'aggregation'],
          })
        );
      } else {
        formGroup.setValidators([
          mutuallyExclusive({
            required: true,
            fields: ['resource', 'referenceData'],
          }),
        ]);
      }
      formGroup.updateValueAndValidity();
    });
    return formGroup;
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
    const templateControl = group.get('card.template');
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
}
