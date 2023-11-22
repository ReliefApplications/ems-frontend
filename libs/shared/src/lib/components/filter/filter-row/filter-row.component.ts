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
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
import { GET_FIELD_DETAILS } from '../graphql/queries';
import { DatePipe } from '../../../pipes/date/date.pipe';

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
  /** records form id*/
  @Input() resourceId = '';
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
  /** Tooltips values for filters */
  public tooltips: { [key: string]: number | string | null } = {};
  /** Scalar fields types with available tooltips hints */
  public availableFilterHints = ['date', 'time', 'text', 'numeric'];

  /** @returns value form field as form control. */
  get valueControl(): UntypedFormControl {
    return this.form.get('value') as UntypedFormControl;
  }

  /**
   * Composite filter row.
   *
   * @param apollo apollo service
   * @param datePipe shared Date pipe
   */
  constructor(private apollo: Apollo, private datePipe: DatePipe) {
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
      this.setTooltip(field);
      console.log(field, this.tooltips, !this.tooltips[field.name]);
      this.editor = field.filter.template;
    } else {
      switch (field.editor) {
        case 'text': {
          this.editor = this.textEditor;
          this.setTooltip(field);
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
          this.setTooltip(field);
          break;
        }
        case 'datetime':
        case 'time': {
          this.editor = this.textEditor;
          this.setTooltip(field);
          break;
        }
        case 'date': {
          this.editor = this.dateEditor;
          this.setTooltip(field);
          break;
        }
        default: {
          this.editor = this.textEditor;
        }
      }
    }
  }

  /**
   * Get the used values for a field from the database
   *
   * @param field field to get the tooltip from
   */
  setTooltip(field: any) {
    console.log('should send');
    if (!this.tooltips[field.name]) {
      firstValueFrom(
        this.apollo.query<any>({
          query: GET_FIELD_DETAILS,
          variables: {
            resource: this.resourceId,
            field: field,
          },
        })
      ).then((data) => {
        switch (field.type) {
          case 'text':
            this.tooltips[field.name] = data.data.fieldDetails;
            break;
          case 'time':
            this.tooltips[field.name] = data.data.fieldDetails
              .map((time: string) => this.datePipe.transform(time, 'shortTime'))
              .join(' & ');
            break;
          case 'date':
            this.tooltips[field.name] = data.data.fieldDetails
              .map((date: string) => this.datePipe.transform(date, 'shortDate'))
              .join(' & ');
            break;
          case 'numeric':
            this.tooltips[field.name] = data.data.fieldDetails.join(' & ');
            break;
          default:
            this.tooltips[field.name] = data.data.fieldDetails;
        }
      });
    }
  }
}
