import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * Series Display Settings component
 */
@Component({
  selector: 'shared-series-settings',
  templateUrl: './series-settings.component.html',
  styleUrls: ['./series-settings.component.css'],
})
export class SeriesSettingsComponent implements OnInit, OnChanges {
  /** Form array */
  @Input() formArray!: FormArray;
  /** Form group */
  public formGroup?: FormGroup;

  /** Fill types */
  public fillTypes = ['solid', 'gradient'];
  /** Interpolation types */
  public interpolationTypes = ['linear', 'cubic', 'step'];
  /** Step interpolation types */
  public stepInterpolationTypes = ['before', 'after', 'middle'];

  /** Selected serie */
  selectedSerie = new FormControl<string | undefined>(undefined);

  ngOnInit(): void {
    this.selectedSerie.valueChanges.subscribe((value) => {
      if (this.formArray.value.length > 0) {
        this.formGroup = this.formArray.controls.find(
          (x) => x.value.serie === value
        ) as FormGroup;
      }
    });
  }

  ngOnChanges(): void {
    if (this.formArray.value.length > 0) {
      if (!this.selectedSerie.value) {
        this.formGroup = this.formArray.at(0) as FormGroup;
        this.selectedSerie.setValue(this.formGroup.value.serie, {
          emitEvent: false,
        });
      } else {
        const index = (this.formArray.value as any[]).indexOf(
          (x: any) => x.serie === this.selectedSerie
        );
        if (index >= 0) {
          this.formGroup = this.formArray.at(index) as FormGroup;
        } else {
          this.formGroup = this.formArray.at(0) as FormGroup;
          this.selectedSerie.setValue(this.formGroup.value.serie, {
            emitEvent: false,
          });
        }
      }
    } else {
      this.formGroup = undefined;
      this.selectedSerie.setValue(undefined, { emitEvent: false });
    }
  }
}
