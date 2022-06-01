import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

/**
 * Map Clorophlet form component.
 */
@Component({
  selector: 'safe-tab-clorophlet',
  templateUrl: './tab-clorophlet.component.html',
  styleUrls: ['./tab-clorophlet.component.scss'],
})
export class SafeTabClorophletComponent implements OnInit {
  @Input() form: FormArray = new FormArray([]);
  @Input() fields: any[] = [];
  @Input() selectedFields: any[] = [];
  @Input() settings: any;

  geoJSONfields: any[] = [];
  selectableFields: any[] = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.selectedFields.map((selectedField: any) => {
      this.fields.map((field: any) => {
        if (selectedField.label.toLowerCase() === field.name.toLowerCase()) {
          this.selectableFields.push(field);
        }
      });
    });
    for (let i = 0; this.form.controls[i]; i++) {
      this.updateGeoJSONfields(
        (this.form.controls[i] as any).controls.geoJSON.value,
        i
      );
    }
  }

  /**
   * Creates a new clorophlet.
   */
  public newClorophlet(): void {
    this.form.push(
      this.formBuilder.group({
        name: ['', [Validators.required]],
        geoJSON: ['', [Validators.required]],
        geoJSONname: ['', [Validators.required]],
        geoJSONfield: ['', [Validators.required]],
        opacity: [100],
        place: ['', [Validators.required]],
        divisions: this.formBuilder.array([]),
      })
    );
    this.geoJSONfields.push([]);
  }

  /**
   * Removes a clorophlet from the list.
   *
   * @param index index of clorophlet.
   */
  public removeClorophlet(index: number): void {
    this.form.removeAt(index);
    this.geoJSONfields.splice(index, 1);
  }

  /**
   * Adds a new division.
   *
   * @param form
   */
  public newDivision(form: any): void {
    form.controls.divisions.push(
      this.formBuilder.group({
        label: [''],
        color: ['#ffffff'],
        filter: this.formBuilder.group({
          logic: ['and'],
          filters: this.formBuilder.array([]),
        }),
      })
    );
  }

  /**
   * Removes a division in target form.
   *
   * @param form
   * @param index
   */
  public removeDivision(form: any, index: number): void {
    form.controls.divisions.removeAt(index);
  }

  public async uploadGeoJSON(i: number): Promise<void> {
    const file = document.getElementById('file' + i) as HTMLInputElement;

    if (file) {
      if (file.files && file.files.length > 0) {
        (this.form.controls[i] as any).controls.geoJSONname.setValue(
          file.files[0].name
        );
        (this.form.controls[i] as any).controls.geoJSON.setValue(
          await file.files[0].text()
        );
        this.updateGeoJSONfields(
          (this.form.controls[i] as any).controls.geoJSON.value,
          i
        );
      }
    }
  }

  private updateGeoJSONfields(geoJSON: string, i: number): void {
    const parsed = JSON.parse(geoJSON);
    this.geoJSONfields[i] = [];
    for (const property of Object.keys(parsed.features[0].properties)) {
      this.geoJSONfields[i].push(property);
    }
  }
}
