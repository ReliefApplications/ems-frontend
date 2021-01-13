import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder.service';

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

  constructor(private queryBuilder: QueryBuilderService) { }

  ngOnInit(): void {
    const selectedFields: string[] = this.form.getRawValue().map(x => x.name);
    this.availableFields = this.fields.slice().filter(x => !selectedFields.includes(x.name));
    this.selectedFields = selectedFields.map(x => this.fields.find(f => f.name === x));
  }

  ngOnChanges(): void {
    const selectedFields: string[] = this.form.getRawValue().map(x => x.name);
    this.availableFields = this.fields.slice().filter(x => !selectedFields.includes(x.name));
    this.selectedFields = selectedFields.map(x => this.fields.find(f => f.name === x));
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      if (this.selectedFields === event.container.data) {
        const fieldTomove = this.form.at(event.previousIndex);
        this.form.removeAt(event.previousIndex);
        this.form.insert(event.currentIndex, fieldTomove);
      }
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
        this.form.insert(event.currentIndex, this.queryBuilder.addNewField(this.selectedFields[event.currentIndex], true));
      }
    }
  }

  public onCloseField(): void {
    this.fieldForm = null;
  }

  public onEdit(index: number): void {
    this.fieldForm = this.form.at(index) as FormGroup;
  }
}
