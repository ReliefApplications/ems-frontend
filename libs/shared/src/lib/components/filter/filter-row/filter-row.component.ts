import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { clone, get } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { FIELD_TYPES, FILTER_OPERATORS } from '../filter.const';

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
  /** Current field */
  public field?: any;
  /** Template reference to the editor */
  public editor?: TemplateRef<any>;
  /** Should hide editor or not */
  public hideEditor = false;
  /** Available operators */
  public operators: any[] = [];

  /** @returns value form field as form control. */
  get valueControl(): UntypedFormControl {
    return this.form.get('value') as UntypedFormControl;
  }

  /**
   * Composite filter row.
   */
  constructor() {
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
      });
  }

  ngAfterViewInit(): void {
    const initialField = this.form.get('field')?.value;
    if (initialField && this.fields.length > 0) {
      this.setField(initialField);
    }
  }

  ngOnChanges(): void {
    const initialField = this.form.get('field')?.value;
    if (initialField && this.fields.length > 0) {
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
    if (get(field, 'filter.template', null)) {
      this.editor = field.filter.template;
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
          this.editor = this.dateEditor;
          break;
        }
        default: {
          this.editor = this.textEditor;
        }
      }
    }
  }
}
