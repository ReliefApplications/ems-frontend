import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { clone, get, isEqual } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { FIELD_TYPES, FILTER_OPERATORS } from '../filter.const';
import { EmailService } from '../../email/email.service';
import convertToMinutes from '../../../utils/convert-to-minutes';
import { CommonServicesService } from '../../../services/common-services/common-services.service';
import { firstValueFrom } from 'rxjs';

/** Operators that keep attribute comparisons tied to another record field. */
const ATTRIBUTE_FIELD_OPERATORS = ['eq', 'neq', 'in', 'notin'];

/** Attribute operators that let the user choose field or text input. */
const ATTRIBUTE_SWITCHABLE_OPERATORS = ['eq', 'neq', 'in', 'notin'];

/** Operators that compare an attribute against a literal value. */
const ATTRIBUTE_LITERAL_OPERATORS = [
  'eq',
  'neq',
  'in',
  'notin',
  'contains',
  'doesnotcontain',
  'startswith',
  'endswith',
  'isnull',
  'isnotnull',
  'isempty',
  'isnotempty',
];

/**
 * Composite filter row.
 */
@Component({
  selector: 'shared-filter-row',
  templateUrl: './filter-row.component.html',
  styleUrls: ['./filter-row.component.scss'],
})
export class FilterRowComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges, AfterViewInit
{
  /** Filter form group */
  @Input() form!: UntypedFormGroup;
  /** Is disabled */
  @Input() disabled = false;
  /** Available fields */
  @Input() fields: any[] = [];
  /** Can use context variables */
  @Input() canUseContext = false;
  /** Email Notification Check */
  @Input() isEmailNotification = false;
  /** Enables attribute filters to switch editor mode based on operator. */
  @Input() enableAttributeValueSource = false;
  /** Delete filter event emitter */
  @Output() delete = new EventEmitter();
  /** Text field editor template */
  @ViewChild('textEditor', { static: false }) textEditor!: TemplateRef<any>;
  /** Boolean field editor template */
  @ViewChild('booleanEditor', { static: false })
  booleanEditor!: TemplateRef<any>;
  /** Select field editor template */
  @ViewChild('selectEditor', { static: false }) selectEditor!: TemplateRef<any>;
  /** Attribute editor template */
  @ViewChild('attributeEditor', { static: false })
  attributeEditor!: TemplateRef<any>;
  /** Numeric field editor template */
  @ViewChild('numericEditor', { static: false })
  numericEditor!: TemplateRef<any>;
  /** Date field editor template */
  @ViewChild('dateEditor', { static: false }) dateEditor!: TemplateRef<any>;
  /** Reference to context editor template */
  @ViewChild('contextEditor', { static: false })
  contextEditor!: TemplateRef<any>;
  /** In the last operator editor template */
  @ViewChild('inTheLastEditor', { static: false })
  inTheLastEditor!: TemplateRef<any>;
  /** Current field */
  public field?: any;
  /** Template reference to the editor */
  public editor?: TemplateRef<any>;
  /** Should hide editor or not */
  public hideEditor = false;
  /** Available operators */
  public operators: any[] = [];
  /** Is context editor used */
  public contextEditorIsActivated = false;
  /** Time units for filtering. */
  public timeUnits = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ];
  /** Show loading sign */
  public loading = false;

  /** @returns value form field as form control. */
  get valueControl(): UntypedFormControl {
    return this.form.get('value') as UntypedFormControl;
  }

  /** @returns the attribute value source form control if available. */
  get valueSourceControl(): UntypedFormControl | null {
    return (this.form.get('valueSource') as UntypedFormControl) || null;
  }

  /** @returns whether the attribute value source dropdown should be shown. */
  get attributeShowsValueSourceSwitch(): boolean {
    return (
      !!this.enableAttributeValueSource &&
      this.field?.editor === 'attribute' &&
      ATTRIBUTE_SWITCHABLE_OPERATORS.includes(this.form.get('operator')?.value)
    );
  }

  /** @returns whether attribute filters should use the field dropdown. */
  get attributeUsesFieldEditor(): boolean {
    const operator = this.form.get('operator')?.value;

    if (ATTRIBUTE_SWITCHABLE_OPERATORS.includes(operator)) {
      return this.valueSourceControl?.value !== 'literal';
    }

    return false;
  }

  /**
   * Composite filter row.
   *
   * @param emailService email notifications helper functions
   * @param cs Common Services connection
   */
  constructor(
    public emailService: EmailService,
    private cs: CommonServicesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form
      .get('field')
      ?.valueChanges?.pipe(takeUntil(this.destroy$))
      .subscribe(async (value) => {
        // remove value
        const selectedField = this.fields.filter((x: any) => x.name == value);
        if (
          selectedField?.[0]?.isCommonService &&
          selectedField?.[0]?.editor === 'select'
        ) {
          await this.getCsData(value, selectedField[0]);
        }
        if (this.form?.get('operator')?.value) {
          this.setField(value);
        } else {
          this.form.get('value')?.setValue(null);
          this.setField(value, true);
        }
      });
    this.form
      .get('operator')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.setHideEditor(value);
        if (
          this.field?.editor === 'attribute' &&
          this.enableAttributeValueSource
        ) {
          this.form.get('value')?.setValue(null);
          this.setEditor(this.field);
        }
        // Checks for in the last operator
        if (value === 'inthelast') {
          // Replaces the date editor with in the last
          this.setEditor(this.field);
          // Subscribes to in the last value changes
          this.form
            .get('inTheLast')
            ?.valueChanges.subscribe((inTheLastValues) => {
              if (this.form.get('operator')?.value === 'inthelast') {
                if (
                  inTheLastValues.number !== 1 ||
                  inTheLastValues.unit !== 'days'
                ) {
                  // Sets value of inTheLast
                  this.form
                    .get('value')
                    ?.setValue(
                      convertToMinutes(
                        inTheLastValues.number,
                        inTheLastValues.unit
                      )
                    );
                } else {
                  // Sets default value if not changed
                  this.form.get('value')?.setValue(convertToMinutes(1, 'days'));
                }
              }
            });
        }
      });
    this.valueSourceControl?.valueChanges
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.attributeShowsValueSourceSwitch) {
          this.form.get('value')?.setValue(null);
          this.setEditor(this.field);
        }
      });
    if (this.disabled) {
      this.form.disable();
    }

    // Maps key to label so the field appears in filter field dropdown
    if (
      this.fields?.filter((x: any) => x?.isCommonService)?.length > 0 &&
      this.form.get('field') &&
      this.fields
        ?.map((x: any) => x?.graphQLFieldName)
        .filter((x: any) => x?.label === this.form?.getRawValue()?.field)
        ?.length > 0
    ) {
      this.form
        .get('field')
        ?.setValue(
          this.fields
            .map((x) => x.graphQLFieldName)
            .filter((x) => x.label === this.form.getRawValue().field)?.[0]?.key
        );
    }

    //Calling the common service function for getting value for Select type of data
    if (this.field?.isCommonService) {
      this.field.options = this.getCsData(this.field?.name, this.field);
    }
  }

  /**
   * Returns an array of numbers from 1 to 90
   * for the "In the last" dropdown.
   *
   * @returns an array of numbers from 1 to 90.
   */
  getNumbersArray(): number[] {
    return Array.from({ length: 90 }, (_, i) => i + 1);
  }

  ngAfterViewInit(): void {
    const initialField = this.form.get('field')?.value;
    if (initialField && this.fields.length > 0) {
      this.setField(initialField);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const initialField = this.form.get('field')?.value;
    if (
      initialField &&
      this.fields.length > 0 &&
      !isEqual(changes.fields?.previousValue, changes.fields?.currentValue)
    ) {
      this.setField(initialField);
    }

    if (
      changes['disabled'] &&
      changes['disabled'].previousValue !== changes['disabled'].currentValue
    ) {
      if (this.disabled) {
        this.form?.disable();
      } else {
        this.form?.enable();
      }
    }
  }

  /**
   * Set field.
   *
   * @param name field name
   * @param init is new field or not
   */
  private setField(name: string, init = false) {
    // get field, and operators
    const nameFragments =
      name.startsWith('{{attributes.') && name.endsWith('}}')
        ? [name]
        : name.startsWith('$attribute.')
        ? // Attribute keys can contain dots (e.g. 'country.iso2code'), so
          // only split on the group prefix
          ['$attribute', name.substring('$attribute.'.length)]
        : name.split('.');
    let fields = clone(this.fields);
    let field = null;
    // Loop over name fragments to find correct field
    for (const fragment of nameFragments) {
      field = fields.find((x) => x.name === fragment);
      fields = clone(field?.fields);
    }
    if (field) {
      this.field = field;
      this.updateFieldOperators(this.field, init);
      // set operator template
      this.setEditor(this.field);
    }
  }

  /**
   * Gets the operator configuration for the selected field.
   *
   * @param field selected field
   * @returns field operator configuration
   */
  private getFieldConfig(field: any) {
    if (field.editor === 'attribute' && this.enableAttributeValueSource) {
      const fieldOperators = field.fieldOperators || ATTRIBUTE_FIELD_OPERATORS;
      const literalOperators =
        field.literalOperators || ATTRIBUTE_LITERAL_OPERATORS;

      return {
        defaultOperator: field.fieldDefaultOperator || 'eq',
        operators: Array.from(
          new Set([...fieldOperators, ...literalOperators])
        ),
      };
    }

    return {
      ...FIELD_TYPES.find(
        (x) =>
          x.editor === field.editor && !!field.multiSelect === !!x.multiSelect
      ),
      ...field.filter,
    };
  }

  /**
   * Updates the operator list for the selected field.
   *
   * @param field selected field
   * @param init is new field or not
   */
  private updateFieldOperators(field: any, init = false): void {
    const type = this.getFieldConfig(field);
    const nextOperator =
      init || !type?.operators?.includes(this.form.get('operator')?.value)
        ? type?.defaultOperator ?? FILTER_OPERATORS[0].value
        : this.form.get('operator')?.value;

    this.operators = FILTER_OPERATORS.filter((x) =>
      type?.operators?.includes(x.value)
    );
    this.form.get('operator')?.setValue(nextOperator, { emitEvent: false });
    this.setHideEditor(nextOperator);
  }

  /**
   * Set hide editor.
   *
   * @param key operator value
   */
  private setHideEditor(key: string): void {
    const operator = this.operators.find((x) => x.value === key);
    if (operator?.disableValue) {
      this.form.get('value')?.disable();
      this.hideEditor = true;
    } else {
      this.form.get('value')?.enable();
      this.hideEditor = false;
    }
  }

  /**
   * Set field editor.
   *
   * @param field filter field
   */
  private setEditor(field: any) {
    const value = this.form.get('value')?.value;
    this.contextEditorIsActivated = false;
    // let editorSet = false;
    // const value = this.form.get('value')?.value;
    // this.isFilterEditorOnView = false;
    if (
      get(field, 'filter.template', null) &&
      this.form?.get('operator')?.value !== 'inthelast'
    ) {
      this.editor = field.filter.template;
    } else if (this.isDynamicPlaceholderValue(value)) {
      this.editor = this.contextEditor;
      this.contextEditorIsActivated = true;
    } else {
      switch (field.editor) {
        case 'attribute': {
          if (this.enableAttributeValueSource) {
            this.editor = this.attributeUsesFieldEditor
              ? this.selectEditor
              : this.attributeEditor;
            break;
          }
          this.editor = this.selectEditor;
          break;
        }
        case 'text': {
          this.editor = this.textEditor;
          break;
        }
        case 'boolean': {
          this.editor = this.booleanEditor;
          break;
        }
        case 'select': {
          this.editor = this.selectEditor;
          break;
        }
        case 'numeric': {
          this.editor = this.numericEditor;
          break;
        }
        case 'datetime':
        case 'date': {
          if (this.form?.get('operator')?.value === 'inthelast') {
            this.editor = this.inTheLastEditor;
          } else {
            this.editor = this.dateEditor;
          }
          break;
        }
        default: {
          this.editor = this.textEditor;
        }
      }
      if (this.disabled || this.hideEditor) {
        this.form.get('value')?.disable();
      } else {
        this.form.get('value')?.enable();
      }
    }
  }

  /**
   * Detects placeholder-based values that should stay in the dynamic editor.
   *
   * @param value current filter value
   * @returns whether the value uses a supported dynamic placeholder
   */
  private isDynamicPlaceholderValue(value: unknown): value is string {
    return (
      typeof value === 'string' &&
      ['{{context.', '{{filter.', '{{user.'].some((prefix) =>
        value.startsWith(prefix)
      )
    );
  }

  /** Toggles filter editor */
  // public toggleFilterEditor() {
  //   this.form.get('value')?.setValue(null);
  //   if (this.editor === this.dashboardFilterEditor) {
  //     this.setEditor(this.field);
  //     this.isFilterEditorOnView = false;
  //   } else {
  //     this.editor = this.dashboardFilterEditor;
  //     this.isFilterEditorOnView = true;
  //   }
  // }

  /** Toggles context editor */
  public toggleContextEditor() {
    this.form.get('value')?.setValue(null);
    if (this.editor === this.contextEditor) {
      this.setEditor(this.field);
    } else {
      this.editor = this.contextEditor;
      this.contextEditorIsActivated = true;
    }
  }

  /**
   * Get CS Data
   *
   * @param key selected key name
   * @param selectedField selected field object
   */
  async getCsData(key: string, selectedField: any) {
    if (
      this.emailService?.userTableFields?.filter((x) => x === key).length === 0
    ) {
      this.loading = true;
      await firstValueFrom(this.cs.restRequest(key))
        .then((data) => {
          this.loading = false;
          selectedField.options =
            data?.value.map((x: any) => ({
              text: x?.Name,
              value: x?.Name,
            })) || [];
        })
        .catch((error) => {
          console.error(`Error while fetching reference data ${key}:`, error);
        });
    }
  }
}
