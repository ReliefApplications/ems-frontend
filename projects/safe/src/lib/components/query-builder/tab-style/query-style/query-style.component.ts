import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ComponentFactory,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

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
  public wholeRow!: FormControl;

  @Output() closeEdition = new EventEmitter<any>();

  public fieldsFormControl: FormArray = new FormArray([]);

  constructor() {}

  ngOnInit(): void {
    const fields = this.form.get('fields')?.value || [];
    if (fields.length > 0) {
      this.wholeRow = new FormControl(false);
    } else {
      this.wholeRow = new FormControl(true);
    }
    this.wholeRow.valueChanges.subscribe((value) => {
      if (value) {
        this.fieldsFormControl.clear();
      }
    });
    this.fieldsFormControl.valueChanges.subscribe((res) => {
      const rawValue = this.fieldsFormControl.getRawValue();
      const value = this.getFieldsValue(rawValue);
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

  private setFieldsValue(fields: any[])

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
