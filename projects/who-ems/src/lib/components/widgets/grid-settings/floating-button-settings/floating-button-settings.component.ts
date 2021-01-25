import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

const DISABLED_FIELDS = ['id', 'createdAt'];

@Component({
  selector: 'who-floating-button-settings',
  templateUrl: './floating-button-settings.component.html',
  styleUrls: ['./floating-button-settings.component.scss']
})
export class FloatingButtonSettingsComponent implements OnInit {

  @Input() buttonForm: FormGroup;
  @Input() fields: any[];

  get scalarFields(): any[] {
    return this.fields.filter(x => x.type.kind === 'SCALAR' && !DISABLED_FIELDS.includes(x.name));
  }

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  compareFields(field1: any, field2: any): boolean {
    if (field2) {
      return field1.name === field2.name;
    } else {
      return false;
    }
  }

  get modificationsArray(): FormArray {
    return this.buttonForm.get('modifications') as FormArray;
  }

  onDeleteModification(index: number): void {
    this.modificationsArray.removeAt(index);
  }

  onAddModification(): void {
    this.modificationsArray.push(this.formBuilder.group({
      field: ['', Validators.required],
      value: ['', Validators.required]
    }));
  }
}
