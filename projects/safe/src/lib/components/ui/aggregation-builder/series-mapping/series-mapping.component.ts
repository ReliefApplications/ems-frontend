import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { merge, Observable } from 'rxjs';
import { startWith, delay } from 'rxjs/operators';

/**
 * Mapping of series parameters ( category / field ).
 */
@Component({
  selector: 'safe-series-mapping',
  templateUrl: './series-mapping.component.html',
  styleUrls: ['./series-mapping.component.scss'],
})
export class SafeSeriesMappingComponent implements OnInit {
  // === DATA ===
  @Input() fields$!: Observable<any[]>;
  public availableFields: any[] = [];
  public fieldsByControl: any = {};
  // === REACTIVE FORM ===
  @Input() mappingForm!: AbstractControl;
  public controlNames: string[] = [];

  /**
   * Mapping of series parameters ( category / field ).
   */
  constructor() {}

  /**
   * Gets the control names from the inputs.
   * Sets the available fields.
   */
  ngOnInit(): void {
    this.controlNames = Object.keys((this.mappingForm as UntypedFormGroup).controls);
    this.fields$.subscribe((fields: any[]) => {
      this.availableFields = [...fields];
    });
    // Remove fields from other controls list when selected
    merge(
      ...this.controlNames.map(
        (controlName) => this.mappingForm.get(controlName)?.valueChanges || 0
      ),
      this.fields$
    )
      .pipe(startWith(null), delay(100))
      .subscribe(() => {
        for (const controlName of this.controlNames) {
          const excludedFields: string[] = [];
          for (const control of this.controlNames) {
            if (
              control !== controlName &&
              this.mappingForm.get(control)?.valid
            ) {
              excludedFields.push(this.mappingForm.get(control)?.value);
            }
          }
          // Filter fields AND subfields
          this.fieldsByControl[controlName] = this.availableFields.reduce(
            (fields, field) => {
              if (excludedFields.includes(field.name)) {
                return fields;
              }
              if (field.fields && field.fields.length) {
                for (const subField of field.fields) {
                  if (
                    excludedFields.includes(`${field.name}.${subField.name}`)
                  ) {
                    const newField = { ...field };
                    newField.fields = field.fields.filter(
                      (x: any) => x.name !== subField.name
                    );
                    fields.push(newField);
                    return fields;
                  }
                }
              }
              fields.push(field);
              return fields;
            },
            []
          );
        }
      });
  }
}
