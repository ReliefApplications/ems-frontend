import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-categories-settings',
  templateUrl: './categories-settings.component.html',
  styleUrls: ['./categories-settings.component.css']
})
export class CategoriesSettingsComponent implements OnInit, OnChanges{
  @Input() formArray!: FormArray;

  public formGroup?: FormGroup;
  selectedCategory = new FormControl<string | undefined>(undefined);

  ngOnInit(): void {
    this.selectedCategory.valueChanges.subscribe((value) => {
      if (this.formArray.value.length > 0) {
        this.formGroup = this.formArray.controls.find(
          (x) => x.value.category === value
        ) as FormGroup;
      }
    })
  }

  ngOnChanges(): void {
    if (this.formArray.value.length > 0) {
      if (!this.selectedCategory.value) {
        console.log(this.formArray.value);
        this.formGroup = this.formArray.at(0) as FormGroup;
        this.selectedCategory.setValue(this.formGroup.value.category, {
          emitEvent: false,
        });
      }else{
        console.log(this.formArray.value);
        const index = (this.formArray.value as any[]).indexOf(
          (x: any) => x.category === this.selectedCategory
        );
        if (index >= 0) {
          this.formGroup = this.formArray.at(index) as FormGroup;
        } else {
          this.formGroup = this.formArray.at(0) as FormGroup;
          this.selectedCategory.setValue(this.formGroup.value.category, {
            emitEvent: false,
          });
        }
      }
    } else {
      this.formGroup = undefined;
      this.selectedCategory.setValue(undefined, { emitEvent: false });
    }
  }
}
