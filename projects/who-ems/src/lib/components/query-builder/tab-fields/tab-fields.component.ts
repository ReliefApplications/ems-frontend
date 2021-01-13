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
  public fieldForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.availableFields = this.fields.slice();
  }

  ngOnChanges(): void {
    this.availableFields = this.fields.slice();
    this.selectedFields = [];
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      if (this.selectedFields === event.previousContainer.data) {
        if (this.fieldForm === this.form.at(event.previousIndex) as FormGroup) {
          this.fieldForm = null;
        }
        this.form.removeAt(event.previousIndex);
      } else {
        this.form.insert(event.currentIndex, this.newField(this.selectedFields[event.currentIndex]));
      }
    }
  }

  public onCloseField(): void {
    this.fieldForm = null;
  }

  public onEdit(index: number): void {
    this.fieldForm = this.form.at(index) as FormGroup;
  }

  private newField(field: any): FormGroup {
    switch (field.type.kind) {
      case 'LIST': {
        return this.formBuilder.group({
          name: [{value: field.name, disabled: true }],
          type: [field.type.ofType.name],
          kind: field.type.kind,
          fields: this.formBuilder.array([], Validators.required),
          sort: this.formBuilder.group({
            field: [''],
            order: ['asc']
          }),
          filter: this.formBuilder.group({})
        });
      }
      case 'OBJECT': {
        return this.formBuilder.group({
          name: [{value: field.name, disabled: true }],
          type: [field.name],
          kind: field.type.kind,
          fields: this.formBuilder.array([], Validators.required)
        });
      }
      default: {
        return this.formBuilder.group({
          name: [{value: field.name, disabled: true }],
          type: [{value: field.type.name, disabled: true }],
          kind: field.type.kind,
          label: [field.name, Validators.required]
        });
      }
    }
  }
}
