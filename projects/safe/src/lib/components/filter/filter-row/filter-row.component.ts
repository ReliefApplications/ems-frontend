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
import { FormControl, FormGroup } from '@angular/forms';
import { clone, get } from 'lodash';
import { FIELD_TYPES, FILTER_OPERATORS } from '../filter.const';

/**
 * Composite filter row.
 */
@Component({
  selector: 'safe-filter-row',
  templateUrl: './filter-row.component.html',
  styleUrls: ['./filter-row.component.scss'],
})
export class FilterRowComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() form!: FormGroup;
  @Output() delete = new EventEmitter();
  @Input() fields: any[] = [];

  public field?: any;
  public editor?: TemplateRef<any>;

  /** @returns value form field as form control. */
  get valueControl(): FormControl {
    return this.form.get('value') as FormControl;
  }

  @ViewChild('textEditor', { static: false }) textEditor!: TemplateRef<any>;
  @ViewChild('booleanEditor', { static: false })
  booleanEditor!: TemplateRef<any>;
  @ViewChild('selectEditor', { static: false }) selectEditor!: TemplateRef<any>;
  @ViewChild('numericEditor', { static: false })
  numericEditor!: TemplateRef<any>;
  @ViewChild('dateEditor', { static: false }) dateEditor!: TemplateRef<any>;

  public operators: any[] = [];

  ngOnInit(): void {
    this.form.get('field')?.valueChanges.subscribe((value) => {
      // remove value
      this.form.get('value')?.setValue(null);
      this.setField(value, true);
    });
    this.form.get('operator')?.valueChanges.subscribe((value) => {
      const operator = this.operators.find((x) => x.value === value);
      if (operator?.disableValue) {
        this.form.get('value')?.disable();
      } else {
        this.form.get('value')?.enable();
      }
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
    const nameFragments = name.split('.');
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
        ...FIELD_TYPES.find((x) => x.editor === this.field.editor),
        ...this.field.filter,
      };
      this.operators = FILTER_OPERATORS.filter((x) =>
        type?.operators.includes(x.value)
      );
      if (init) {
        this.form.get('operator')?.setValue(type?.defaultOperator);
      } else {
        this.form.get('operator')?.setValue(this.form.value.operator);
      }
      // set operator template
      this.setEditor(this.field);
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
