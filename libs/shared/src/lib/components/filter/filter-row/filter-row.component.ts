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
import { convertToMinutes } from '../../../utils/parser/utils';

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
  /** Available fields */
  @Input() fields: any[] = [];
  /** Can use context variables */
  @Input() canUseContext = false;
  /** Email Notification Check */
  @Input() isEmailNotification = false;
  /** Delete filter event emitter */
  @Output() delete = new EventEmitter();
  /** Text field editor template */
  @ViewChild('textEditor', { static: false }) textEditor!: TemplateRef<any>;
  /** Boolean field editor template */
  @ViewChild('booleanEditor', { static: false })
  booleanEditor!: TemplateRef<any>;
  /** Select field editor template */
  @ViewChild('selectEditor', { static: false }) selectEditor!: TemplateRef<any>;
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
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ];

  /** @returns value form field as form control. */
  get valueControl(): UntypedFormControl {
    return this.form.get('value') as UntypedFormControl;
  }

  /**
   * Composite filter row.
   *
   * @param emailService
   */
  constructor(public emailService: EmailService) {
    super();
  }

  ngOnInit(): void {
    this.form
      .get('field')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // remove value
        this.form.get('value')?.setValue(null);
        this.setField(value, true);
      });
    this.form
      .get('operator')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.setHideEditor(value);
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
  }

  /**
   * Set field.
   *
   * @param name field name
   * @param init is new field or not
   */
  private setField(name: string, init?: true) {
    // get field, and operators
    const nameFragments =
      name.startsWith('{{attributes.') && name.endsWith('}}')
        ? [name]
        : name.split('.');
    let fields = clone(this.fields);
    let field = null;
    // Loop over name fragments to find correct field
    for (const fragment of nameFragments) {
      field = fields.find((x) => x.name === fragment);
      fields = clone(field.fields);
    }
    if (field) {
      this.field = field;
      const type = {
        ...FIELD_TYPES.find(
          (x) =>
            x.editor === this.field.editor &&
            !!this.field.multiSelect === !!x.multiSelect
        ),
        ...this.field.filter,
      };
      this.operators = FILTER_OPERATORS.filter((x) =>
        type?.operators?.includes(x.value)
      );
      if (init) {
        /** If type undefined, use as default 'eq' operator and not undefined. */
        this.form
          .get('operator')
          ?.setValue(type?.defaultOperator ?? FILTER_OPERATORS[0].value, {
            emitEvent: false,
          });
      } else {
        this.form
          .get('operator')
          ?.setValue(this.form.value.operator, { emitEvent: false });
      }
      this.setHideEditor(this.form.get('operator')?.value);
      // set operator template
      this.setEditor(this.field);
    }
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
    } else if (
      typeof value === 'string' &&
      value.startsWith('{{context.') &&
      !this.contextEditorIsActivated
    ) {
      this.editor = this.contextEditor;
      this.contextEditorIsActivated = true;
    } else {
      switch (field.editor) {
        case 'text': {
          this.editor = this.textEditor;
          break;
        }
        case 'boolean': {
          this.editor = this.booleanEditor;
          break;
        }
        case 'attribute':
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
    }
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
}
