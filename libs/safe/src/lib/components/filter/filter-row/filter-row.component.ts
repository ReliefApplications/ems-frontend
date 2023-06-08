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
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { FIELD_TYPES, FILTER_OPERATORS } from '../filter.const';
import { ContextService } from '../../../services/context/context.service';
import { SafeEditorService } from '../../../services/editor/editor.service';
import { INLINE_EDITOR_CONFIG } from '../../../const/tinymce.const';

/**
 * Composite filter row.
 */
@Component({
  selector: 'safe-filter-row',
  templateUrl: './filter-row.component.html',
  styleUrls: ['./filter-row.component.scss'],
})
export class FilterRowComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() form!: UntypedFormGroup;
  @Output() delete = new EventEmitter();
  @Input() fields: any[] = [];

  public field?: any;
  public editor?: TemplateRef<any>;

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
  @ViewChild('filterEditor', { static: false }) filterEditor!: TemplateRef<any>;

  editorConfig = INLINE_EDITOR_CONFIG;
  isFilterEnable = false;
  isFilterEditorOnView = false;

  public operators: any[] = [];

  /**
   * Constructor of filter row
   *
   * @param contextService Context service
   * @param editorService Editor service
   */
  constructor(
    private contextService: ContextService,
    private editorService: SafeEditorService
  ) {
    super();
    // Set the editor base url based on the environment file
    this.editorConfig.base_url = editorService.url;
    // Set the editor language
    this.editorConfig.language = editorService.language;
  }

  ngOnInit(): void {
    this.contextService.isFilterEnable$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isFilterEnable: boolean) => {
          this.isFilterEnable = isFilterEnable;
          const availableFilterFields =
            this.contextService.availableFilterFields;
          if (isFilterEnable && availableFilterFields) {
            this.editorService.addCalcAndKeysAutoCompleter(
              this.editorConfig,
              Object.keys(availableFilterFields).map(
                (key: string) => `{{filter.${key}}}`
              )
            );
          }
        },
      });

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
    const value = this.form.get('value')?.value;
    if (get(field, 'filter.template', null)) {
      this.editor = field.filter.template;
    } else if (
      this.isFilterEnable &&
      typeof value === 'string' &&
      value.startsWith('{{filter.')
    ) {
      this.editor = this.filterEditor;
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

  /** Toggles filter editor */
  public toggleFilterEditor() {
    this.form.get('value')?.setValue(null);
    if (this.editor === this.filterEditor) {
      this.setEditor(this.field);
      this.isFilterEditorOnView = false;
    } else {
      this.editor = this.filterEditor;
      this.isFilterEditorOnView = true;
    }
  }
}
