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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  public newClorophlet(): void {
    this.form.push(this.formBuilder.group({
      name: ['', [Validators.required]],
      place: ['', [Validators.required]],
      divisions: [this.formBuilder.array([])]
    }));
  }

  public removeClorophlet(index: number): void {
    this.form.removeAt(index);
  }

  public newDivision(form: any): void {
    form.controls.divisions.push(this.formBuilder.group({
      color: [''],
      filters: [this.formBuilder.group({
        logic: 'and',
        filters: this.formBuilder.array([])})]
    }));
    console.log(this.form);
  }

  public removeDivision(form: any, index: number): void {
    form.controls.divisions.removeAt(index);
  }

}
