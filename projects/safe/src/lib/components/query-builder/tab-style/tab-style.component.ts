import {
  Component,
  ComponentFactory,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'safe-tab-style',
  templateUrl: './tab-style.component.html',
  styleUrls: ['./tab-style.component.scss'],
})
export class SafeTabStyleComponent implements OnInit {
  @Input() factory?: ComponentFactory<any>;
  @Input() form: FormGroup = new FormGroup({});
  @Input() styleForm: FormGroup = new FormGroup({});
  @Input() availableFields: any[] = [];
  @Input() scalarFields: any[] = [];
  @Input() settings: any;
  @Input() metaFields: any = {};
  @Input() canDelete = false;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @ViewChild('childTemplate', { read: ViewContainerRef })
  childTemplate?: ViewContainerRef;

  get styles$(): FormArray {
    return this.form.get('style') as FormArray;
  }

  public isEdited = false;
  public stylesList: any[] = [];
  public fieldForm: FormGroup | null = null;
  public styleIndex: any | null = null;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.updateStylesList();
    // selected columns to fix
    // change validators when switching from whole row to selected columns
  }

  public updateStylesList(): void {
    this.stylesList = this.styles$.getRawValue();
  }
  public onEditStyle(index: number): void {
    this.isEdited = true;
    this.styleIndex = index;
    this.fieldForm = this.styles$.at(index) as FormGroup;
    if (this.childTemplate && this.factory) {
      const componentRef = this.childTemplate.createComponent(this.factory);
      componentRef.instance.setForm(this.fieldForm);
      componentRef.instance.canExpand = false;
      componentRef.instance.closeField.subscribe(() => {
        this.onCloseField();
        componentRef.destroy();
      });
    }
  }

  public onAddStyle(): void {
    const style = this.formBuilder.group({
      title: [
        `New rule ${this.stylesList ? this.stylesList.length : 0}`,
        Validators.required,
      ],
      backgroundColor: '',
      textColor: '',
      textStyle: 'default',
      styleAppliedTo: 'selected-row',
      fields: this.formBuilder.array([], Validators.required),
      filters: this.formBuilder.group({
        field: '',
        operator: 'and',
        value: null,
      }),
    });
    this.styles$.push(style);
    this.updateStylesList();
  }

  public onDeleteStyle(index: number): void {
    this.styles$.removeAt(index);
    this.stylesList.splice(index, 1);
  }

  public onCloseField(): void {
    this.fieldForm = null;
    this.isEdited = false;
    this.styleIndex = null;
    this.updateStylesList();
  }
}
