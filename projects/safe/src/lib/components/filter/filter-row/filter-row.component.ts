import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FIELD_TYPES, FILTER_OPERATORS } from '../filter.const';

@Component({
  selector: 'safe-filter-row',
  templateUrl: './filter-row.component.html',
  styleUrls: ['./filter-row.component.scss'],
})
export class FilterRowComponent implements OnInit {
  @Input() form!: FormGroup;
  @Output() delete = new EventEmitter();
  @Input() fields = [
    {
      name: 'text',
      label: 'Text Field',
      editor: 'text',
    },
    {
      name: 'boolean',
      label: 'Boolean Field',
      editor: 'boolean',
    },
    {
      name: 'numeric',
      label: 'numeric Field',
      editor: 'numeric',
    },
    {
      name: 'select',
      label: 'select Field',
      editor: 'select',
    },
    {
      name: 'date',
      label: 'date Field',
      editor: 'date',
    },
  ];

  public field?: any;
  public editor?: TemplateRef<any>;

  @ViewChild('textEditor', { static: false }) textEditor!: TemplateRef<any>;
  @ViewChild('booleanEditor', { static: false })
  booleanEditor!: TemplateRef<any>;
  @ViewChild('selectEditor', { static: false }) selectEditor!: TemplateRef<any>;
  @ViewChild('numericEditor', { static: false })
  numericEditor!: TemplateRef<any>;
  @ViewChild('dateEditor', { static: false }) dateEditor!: TemplateRef<any>;

  public operators: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.form.get('field')?.valueChanges.subscribe((value) => {
      // remove value
      this.form.get('value')?.setValue(null);
      // get field, and operators
      this.field = this.fields.find((x) => x.name === value);
      const type = FIELD_TYPES.find((x) => x.editor === this.field.editor);
      this.form.get('operator')?.setValue(type?.defaultOperator);
      this.operators = FILTER_OPERATORS.filter((x) =>
        type?.operators.includes(x.value)
      );
      // set operator template
      this.setEditor(this.field);
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

  private setEditor(field: any) {
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
