import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ComponentFactory,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-query-style',
  templateUrl: './query-style.component.html',
  styleUrls: ['./query-style.component.scss'],
})
export class SafeQueryStyleComponent implements OnInit {
  @Input() factory?: ComponentFactory<any>;
  @Input() fields: any[] = [];
  public selectedFields: any[] = [];
  @Input() form!: FormGroup;
  @Input() scalarFields: any[] = [];

  @Output() closeEdition = new EventEmitter<any>();

  public fieldsFormControl: FormArray = new FormArray([]);

  constructor() {}

  ngOnInit(): void {
    this.fieldsFormControl.valueChanges.subscribe(() => {
      const rawValue = this.fieldsFormControl.getRawValue();
      const value = this.getFieldsValue(rawValue);
      console.log(value);
      this.form.get('fields')?.setValue(value);
    });
  }

  private flatDeep(arr: any[]): any[] {
    return arr.reduce(
      (acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val),
      []
    );
  }

  private getFieldsValue(fields: any[], prefix?: string): string[] {
    const flatFields = this.flatDeep(fields);
    return this.flatDeep(
      fields.map((f) => {
        switch (f.kind) {
          case 'OBJECT': {
            return this.getFieldsValue(f.fields, f.name);
          }
          default: {
            return prefix ? `${prefix}.${f.name}` : f.name;
          }
        }
      })
    );
  }

  /**
   * Toggles boolean controls.
   *
   * @param controlName name of form control.
   */
  onToggle(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(!control.value);
    }
  }
}
