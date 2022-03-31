import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridSettings } from '../ui/core-grid/models/grid-settings.model';
import { Layout } from '../../models/layout.model';
import {
  createDisplayForm,
  createQueryForm,
} from '../query-builder/query-builder-forms';

const DEFAULT_GRID_SETTINGS = {
  actions: {
    delete: false,
    history: true,
    convert: false,
    update: false,
    inlineEdition: false,
  },
};

interface DialogData {
  layout?: Layout;
}

@Component({
  selector: 'safe-layout-modal',
  templateUrl: './layout-modal.component.html',
  styleUrls: ['./layout-modal.component.scss'],
})
export class SafeLayoutModalComponent implements OnInit {
  @Input() layout: any;
  public form?: FormGroup;
  private queryName = '';
  public templates: any[] = [];
  public gridSettings: GridSettings = DEFAULT_GRID_SETTINGS;
  private pageSize?: number;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeLayoutModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [this.data.layout?.name, Validators.required],
      query: createQueryForm(this.data.layout?.query),
      display: createDisplayForm(this.data.layout?.display),
    });
    this.queryName = this.form.get('query')?.value.name;
    this.form.get('query')?.valueChanges.subscribe((value) => {
      this.gridSettings = {
        ...this.form?.getRawValue(),
        ...DEFAULT_GRID_SETTINGS,
      };
    });
  }

  /**
   * Updates layout parameters.
   *
   * @param value new value
   */
  onGridLayoutChange(value: any): void {
    this.form?.get('display')?.setValue(value);
  }

  /**
   * Updates pageSize parameter.
   *
   * @param value new value
   */
  onPageSizeChange(value: any): void {
    this.pageSize = value;
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    if (this.pageSize) {
      this.form?.get('query')?.patchValue({ pageSize: this.pageSize });
    }
    this.dialogRef.close(this.form?.getRawValue());
  }
}
