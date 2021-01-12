import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'who-tab-fields',
  templateUrl: './tab-fields.component.html',
  styleUrls: ['./tab-fields.component.scss']
})
export class WhoTabFieldsComponent implements OnInit, OnChanges {

  @Input() form: FormArray;
  @Input() fields: any[] = [];
  public availableFields: any[] = [];
  public selectedFields: any[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.availableFields = this.fields.slice();
  }

  ngOnChanges(): void {
    this.availableFields = this.fields.slice();
    this.selectedFields = [];
  }

  drop(event: CdkDragDrop<string[]>): void {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      if (this.selectedFields === event.previousContainer.data) {
        this.form.removeAt(event.previousIndex);
      } else {
        this.form.insert(event.currentIndex, this.newField(this.selectedFields[event.currentIndex]));
      }
    }
  }

  private newField(field: any): FormGroup {
    if (field.type.kind === 'SCALAR') {
      return this.formBuilder.group({
        name: field.name,
        type: field.type.kind,
        label: field.name
      });
    } else {
      return this.formBuilder.group({
        name: ['', Validators.required],
        type: field.type.kind,
        fields: this.formBuilder.array([]),
        sort: this.formBuilder.group({
          field: [''],
          order: ['asc']
        }),
        filter: this.formBuilder.group({})
      });
    }
  }
}
