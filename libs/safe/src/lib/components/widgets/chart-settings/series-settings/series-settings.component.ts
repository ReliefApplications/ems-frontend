import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * Series Display Settings component
 */
@Component({
  selector: 'safe-series-settings',
  templateUrl: './series-settings.component.html',
  styleUrls: ['./series-settings.component.css'],
})
export class SafeSeriesSettingsComponent implements OnInit, OnChanges {
  @Input() formArray!: FormArray;
  @Input() chartType!: any;
  public formGroup?: FormGroup;

  public fillTypes = ['solid', 'gradient'];
  public interpolationTypes = ['linear', 'cubic', 'step'];
  public stepInterpolationTypes = ['before', 'after', 'middle'];

  selectedSerie = new FormControl<string | undefined>(undefined);

  ngOnInit(): void {
    this.selectedSerie.valueChanges.subscribe((value) => {
      if (this.formArray.value.length > 0) {
        if(['pie', 'polar', 'donut', 'radar'].includes(this.chartType)){
          let seriesFormArray = this.formArray.controls[0] as FormGroup
          seriesFormArray = seriesFormArray.controls.categories as FormGroup
          
          let i = 0;
          while(seriesFormArray.controls[i] != undefined){
            if(seriesFormArray.controls[i].value.category === value){
              this.formGroup = seriesFormArray.controls[i] as FormGroup;
              break;
            }
            i++;
          }
        }else{
          this.formGroup = this.formArray.controls.find(
            (x) => {
              x.value.serie === value;
            }) as FormGroup;
        }
      }      
    });
  }

  ngOnChanges(): void {
    if (this.formArray.value.length > 0) {
      if (!this.selectedSerie.value) {
        if(['pie', 'polar', 'donut', 'radar'].includes(this.chartType)){
          let seriesFormArray = this.formArray.controls[0] as FormGroup
          seriesFormArray = seriesFormArray.controls.categories as FormGroup
          this.formGroup = seriesFormArray.controls[0] as FormGroup;
          this.selectedSerie.setValue(this.formGroup.value.category, {
            emitEvent: false,
          });
        }else{
          this.formGroup = this.formArray.at(0) as FormGroup;
          this.selectedSerie.setValue(this.formGroup.value.serie, {
            emitEvent: false,
          });
        }
      } else {
        if(['pie', 'polar', 'donut', 'radar'].includes(this.chartType)){
          let seriesFormArray = this.formArray.controls[0] as FormGroup
          seriesFormArray = seriesFormArray.controls.categories as FormGroup
          
          const index = (seriesFormArray.value as any[]).indexOf(
            (x:any) => x.category === this.selectedSerie
          );
          if(index >= 0){
            this.formGroup = seriesFormArray.controls[index] as FormGroup;
          }else{
            this.formGroup = seriesFormArray.controls[0] as FormGroup;
            this.selectedSerie.setValue(this.formGroup.value.category, {
              emitEvent: false,
            });
          }
        }else{
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
      }
    } else {
      this.formGroup = undefined;
      this.selectedSerie.setValue(undefined, { emitEvent: false });
    }
  }
}
