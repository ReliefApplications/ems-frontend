import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { SafeMapComponent } from '../../map/map.component';
import { HeatmapSettingsI } from '../map-forms';

/**
 * Create heatmap gradient form from value
 *
 * @param steps heatmap gradient steps
 * @returns new form group
 */
const createHeatmapGradientForm = (steps: HeatmapSettingsI['gradient']) => {
  const form = new FormArray([]);
  for (const step of steps) {
    form.push(
      new FormGroup({
        intensity: new FormControl(step.intensity, [Validators.required]),
        color: new FormControl(step.color, [Validators.required]),
        legend: new FormControl(step.legend),
      })
    );
  }

  return form;
};

/** Component for the heatmap configuration */
@Component({
  selector: 'safe-map-heatmap',
  templateUrl: './map-heatmap.component.html',
  styleUrls: ['./map-heatmap.component.scss'],
})
export class MapHeatmapComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() form!: FormGroup;

  public gradientForm!: FormArray;

  /** @returns an array of form groups */
  get gradientSteps(): FormGroup[] {
    return this.gradientForm.controls as FormGroup[];
  }

  // map component
  @ViewChild(SafeMapComponent) previewMap!: SafeMapComponent;
  public mapSettings!: {
    basemap: string;
    zoom: number;
    centerLat: number;
    centerLong: number;
    heatmap: HeatmapSettingsI;
  };

  /** @returns the heatmap form */
  get heatmapForm(): FormGroup {
    return this.form.get('heatmap') as FormGroup;
  }
  /** Component for the heatmap configuration */
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.gradientForm = createHeatmapGradientForm(
      this.form.value.heatmap.gradient
    );

    // reflect changes when the gradient form changes
    this.gradientForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.form.patchValue({
          heatmap: {
            ...this.form.value.heatmap,
            gradient: value,
          },
        });
      });

    this.mapSettings = {
      basemap: this.form.value.basemap,
      zoom: this.form.value.zoom,
      centerLat: this.form.value.centerLat,
      centerLong: this.form.value.centerLong,
      heatmap: this.form.value.heatmap,
    };

    this.form
      .get('heatmap')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.previewMap.setupHeatmap(value);
      });
  }

  /**
   * Removes a gradient step
   *
   * @param index index of the gradient
   */
  public removeGradient(index: number): void {
    const gradient = this.heatmapForm.get('gradient') as FormGroup;
    gradient.removeControl(index.toString());
  }

  /** Adds a gradient step */
  public addGradient(): void {
    const gradient = this.heatmapForm.get('gradient') as FormArray;
    gradient.push(
      new FormGroup({
        color: new FormControl('#000000'),
        intensity: new FormControl(1),
        legend: new FormControl(''),
      })
    );
  }
}
