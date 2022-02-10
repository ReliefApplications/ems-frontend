import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'safe-series-mapping',
  templateUrl: './series-mapping.component.html',
  styleUrls: ['./series-mapping.component.scss'],
})
export class SafeSeriesMappingComponent implements OnInit {
  // === DATA ===
  @Input() fields$!: Observable<any[]>;
  public availableFields: any[] = [];
  // === REACTIVE FORM ===
  @Input() mappingForm!: AbstractControl;
  public controlNames: string[] = [];

  get mappingGroup() {
    return this.mappingForm as FormGroup;
  }

  constructor() {}

  ngOnInit(): void {
    this.controlNames = Object.keys(this.mappingGroup.controls);
    this.fields$.subscribe((fields: any[]) => {
      this.availableFields = [...fields];
    });
  }

  public fieldsFor(controlName: string): any[] {
    const excludedFields: string[] = [];
    for (const control of this.controlNames) {
      if (control !== controlName && this.mappingForm.get(control)?.valid) {
        excludedFields.push(this.mappingForm.get(control)?.value);
      }
    }
    return this.availableFields.filter(
      (field) => !excludedFields.includes(field.name)
    );
  }
}
