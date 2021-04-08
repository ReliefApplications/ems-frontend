import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ComponentFactory, Input, OnChanges, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder.service';

@Component({
  selector: 'who-tab-fields',
  templateUrl: './tab-fields.component.html',
  styleUrls: ['./tab-fields.component.scss']
})
export class WhoTabFieldsComponent implements OnInit, OnChanges {

  @Input() form: FormArray = new FormArray([]);
  @Input() fields: any[] = [];
  // === TEMPLATE REFERENCE ===
  @Input() factory?: ComponentFactory<any>;
  @ViewChild('childTemplate', { read: ViewContainerRef }) childTemplate?: ViewContainerRef;

  public availableFields: any[] = [];
  public selectedFields: any[] = [];
  public fieldForm: FormGroup = new FormGroup({});

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
          this.fieldForm = new FormGroup({});
        }
        this.form.removeAt(event.previousIndex);
      } else {
        this.form.insert(event.currentIndex, this.queryBuilder.addNewField(this.selectedFields[event.currentIndex], true));
      }
    }
  }

  public onCloseField(): void {
    this.fieldForm = new FormGroup({});
  }

  public onEdit(index: number): void {
    this.fieldForm = this.form.at(index) as FormGroup;
    if (this.fieldForm.value.kind !== 'SCALAR') {
      if (this.childTemplate && this.factory) {
        const componentRef = this.childTemplate.createComponent(this.factory);
        componentRef.instance.form = this.fieldForm;
        componentRef.instance.canExpand = this.fieldForm.value.kind === 'LIST';
        componentRef.instance.closeField.subscribe(() => {
          this.onCloseField();
          componentRef.destroy();
        });
      }
    }
  }
}
