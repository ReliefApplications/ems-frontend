import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { startWith, delay } from 'rxjs/operators';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/**
 * Mapping of series parameters ( category / field ).
 */
@Component({
  selector: 'safe-series-mapping',
  templateUrl: './series-mapping.component.html',
  styleUrls: ['./series-mapping.component.scss'],
})
export class SafeSeriesMappingComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnChanges
{
  // === DATA ===
  @Input() availableFields: any[] = [];
  public fieldsByControl: any = {};
  // === REACTIVE FORM ===
  @Input() formGroup!: AbstractControl;
  public controlNames: string[] = [];

  /**
   * Mapping of series parameters ( category / field ).
   */
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setControlListeners();
  }

  ngOnChanges(): void {
    this.setControlListeners();
  }

  /**
   * Set control listeners on form controls
   */
  private setControlListeners(): void {
    this.controlNames = Object.keys(
      (this.formGroup as UntypedFormGroup).controls
    );
    // Remove fields from other controls list when selected
    merge(
      ...this.controlNames.map(
        (controlName) => this.formGroup.get(controlName)?.valueChanges || 0
      )
    )
      .pipe(startWith(null), delay(100))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        for (const controlName of this.controlNames) {
          const excludedFields: string[] = [];
          for (const control of this.controlNames) {
            if (control !== controlName && this.formGroup.get(control)?.valid) {
              excludedFields.push(this.formGroup.get(control)?.value);
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
              if (field.name) {
                fields.push(field);
              }
              return fields;
            },
            []
          );
        }
      });
  }
}
