import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  // SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { clone, get } from 'lodash';
// import { clone, get, isEqual } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { FIELD_TYPES, FILTER_OPERATORS } from '../filter.const';
// import { ContextService } from '../../../services/context/context.service';

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
  @Input() form!: UntypedFormGroup;
  @Output() delete = new EventEmitter();
  @Input() fields: any[] = [];

  public field?: any;
  /** Template reference to the editor */
  public editor?: TemplateRef<any>;
  /** Should hide editor or not */
  public hideEditor = false;

  /** @returns value form field as form control. */
  get valueControl(): UntypedFormControl {
    return this.form.get('value') as UntypedFormControl;
  }

  @ViewChild('textEditor', { static: false }) textEditor!: TemplateRef<any>;
  @ViewChild('booleanEditor', { static: false })
  booleanEditor!: TemplateRef<any>;
  @ViewChild('selectEditor', { static: false }) selectEditor!: TemplateRef<any>;
  @ViewChild('numericEditor', { static: false })
  numericEditor!: TemplateRef<any>;
  @ViewChild('dateEditor', { static: false }) dateEditor!: TemplateRef<any>;
  // @ViewChild('dashboardFilterEditor', { static: false })
  // dashboardFilterEditor!: TemplateRef<any>;

  // isFilterEnable = false;
  // isFilterEditorOnView = false;
  // availableFilterFields: { name: string; value: string }[] = [];

  public operators: any[] = [];

  /**
   * Constructor of filter row
   */
  constructor(/*private contextService: ContextService*/) {
    super();
  }

  ngOnInit(): void {
    // this.contextService.isFilterEnabled$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (isFilterEnable: boolean) => {
    //       this.isFilterEnable = isFilterEnable;
    //       const availableFilterFields =
    //         this.contextService.availableFilterFields;
    //       if (isFilterEnable && availableFilterFields.length) {
    //         this.availableFilterFields =
    //           this.contextService.availableFilterFields.map((field) => ({
    //             name: field.name,
    //             value: `{{filter.${field.value}}}`,
    //           }));
    //       }
    //     },
    //   });

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
        const operator = this.operators.find((x) => x.value === value);
        if (operator?.disableValue) {
          this.form.get('value')?.disable();
          this.hideEditor = true;
        } else {
          this.form.get('value')?.enable();
          this.hideEditor = false;
        }
      });
  }

  ngAfterViewInit(): void {
    const initialField = this.form.get('field')?.value;
    if (initialField && this.fields.length > 0) {
      this.setField(initialField);
    }
  }

  ngOnChanges(/*changes: SimpleChanges*/): void {
    const initialField = this.form.get('field')?.value;
    if (
      initialField &&
      this.fields.length > 0 /*&&
      !isEqual(changes.fields?.previousValue, changes.fields?.currentValue)*/
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
        const operator = this.operators.find(
          (x) => x.value === this.form.get('operator')?.value
        );
        this.hideEditor = operator?.disableValue ?? false;
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
    // let editorSet = false;
    // const value = this.form.get('value')?.value;
    // this.isFilterEditorOnView = false;
    if (get(field, 'filter.template', null)) {
      this.editor = field.filter.template;
    } else {
      //   editorSet = true;
      // } else if (typeof value === 'string' && value.startsWith('{{filter.')) {
      //   if (this.isFilterEnable) {
      //     this.editor = this.dashboardFilterEditor;
      //     this.isFilterEditorOnView = true;
      //     editorSet = true;
      //   } else {
      //     this.form.get('value')?.setValue(null);
      //     this.isFilterEditorOnView = false;
      //   }
      // }
      // if (!editorSet) {
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
}
