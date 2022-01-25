import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'safe-tab-clorophlet',
  templateUrl: './tab-clorophlet.component.html',
  styleUrls: ['./tab-clorophlet.component.scss']
})
export class TabClorophletComponent implements OnInit {

  @Input() form: FormArray = new FormArray([]);
  @Input() fields: any[] = [];
  @Input() settings: any;

  geoJSONfields: any[] = [];
  formatedFields: any[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    for (let i = 0; this.fields[i]; i++) {
      this.formatedFields.push({name: this.fields[i].label[0].toLowerCase() + this.fields[i].label.slice(1)});
    }
    for (let i = 0; this.form.controls[i]; i++) {
      this.updateGeoJSONfields((this.form.controls[i] as any).controls.geoJSON.value, i);
    }
  }

  public newClorophlet(): void {
    this.form.push(this.formBuilder.group({
      name: ['', [Validators.required]],
      geoJSON: ['', [Validators.required]],
      geoJSONname: ['', [Validators.required]],
      geoJSONfield: ['', [Validators.required]],
      place: ['', [Validators.required]],
      divisions: this.formBuilder.array([])
    }));
    this.geoJSONfields.push([]);
  }

  public removeClorophlet(index: number): void {
    this.form.removeAt(index);
    this.geoJSONfields.splice(index, 1);
  }

  public newDivision(form: any): void {
    form.controls.divisions.push(this.formBuilder.group({
      color: [''],
      filter: this.formBuilder.group({
        logic: ['and'],
        filters: this.formBuilder.array([])
      })
    }));
  }

  public removeDivision(form: any, index: number): void {
    form.controls.divisions.removeAt(index);
  }

  public async uploadGeoJSON(i: number): Promise<void> {
    const file = document.getElementById('file' + i) as HTMLInputElement;

    if (file) {
      if (file.files && file.files.length > 0) {
        (this.form.controls[i] as any).controls.geoJSONname.setValue(file.files[0].name);
        (this.form.controls[i] as any).controls.geoJSON.setValue(await file.files[0].text());
        this.updateGeoJSONfields((this.form.controls[i] as any).controls.geoJSON.value, i);
      }
    }
  }

  private updateGeoJSONfields(geoJSON: string, i: number): void {
    const parsed = JSON.parse(geoJSON);
    this.geoJSONfields[i] = [];
    for (const property in parsed.features[0].properties) {
      if (parsed.features[0].hasOwnProperty(property)) {
        this.geoJSONfields[i].push(property);
      }
    }
  }
}
