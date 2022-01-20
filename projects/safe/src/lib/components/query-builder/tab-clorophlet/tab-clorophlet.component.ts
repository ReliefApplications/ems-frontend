import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'safe-tab-clorophlet',
  templateUrl: './tab-clorophlet.component.html',
  styleUrls: ['./tab-clorophlet.component.scss']
})
export class TabClorophletComponent implements OnInit {

  @Input() form: FormArray = new FormArray([]);
  @Input() fields: any[] = [];

  test = this.formBuilder.group({name: ['']});

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log(this.form);
  }

  public newClorophlet(): void {
    this.form.push(this.formBuilder.group({name: ['', [Validators.required]]}));
  }

  public removeClorophlet(index: number): void {
    this.form.removeAt(index);
  }

}
