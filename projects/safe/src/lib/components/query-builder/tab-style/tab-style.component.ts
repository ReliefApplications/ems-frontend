import { Component, ComponentFactory, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'safe-tab-style',
  templateUrl: './tab-style.component.html',
  styleUrls: ['./tab-style.component.scss'],
})
export class SafeTabStyleComponent implements OnInit {
  @Input() factory?: ComponentFactory<any>;
  @Input() form: FormGroup = new FormGroup({});
  @Input() fields: any[] = [];
  @Input() settings: any;
  @Input() metaFields: any = {};
  @Input() canDelete = false;
  @Output() delete: EventEmitter<any> = new EventEmitter();

  get styles$(): FormArray {
    return this.form.get('style') as FormArray;
  }

  get styleControlsArray() : FormGroup[] {
    return this.styles$?.controls as FormGroup[]
  }

  public stylesList: any[] = [];

  constructor(    
    private formBuilder: FormBuilder,
    ) {}

  ngOnInit(): void {
    console.log("this.form ) ", this.form);
    console.log("style = ", this.styles$);
    console.log("styleControlsArray = ", this.styleControlsArray);
  }

  onAddStyle(): void {
    const style = this.formBuilder.group({
      title: [`New style ${ this.styles$ ? this.styles$.length : 0 }`, Validators.required],
      backgroundColor: null,
      textColor: null,
      textStyle: null,
      styleAppliedTo: null,
      preview: null,
    });
    this.styles$.push(style);
  }

  onDeleteStyle(index: number): void {
    this.styles$.removeAt(index);
    this.stylesList.splice(index, 1);
  }
}
