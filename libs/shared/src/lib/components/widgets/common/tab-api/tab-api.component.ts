import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  MenuModule,
  SelectMenuModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CdkTableModule } from '@angular/cdk/table';
import { EmptyModule } from '../../../ui/empty/empty.module';
import { BehaviorSubject } from 'rxjs';

/**
 * API settings for the widget
 */
@Component({
  selector: 'shared-tab-api',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    IconModule,
    MenuModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    BrowserModule,
    TooltipModule,
    CdkTableModule,
    FormWrapperModule,
    SelectMenuModule,
    EmptyModule,
  ],
  templateUrl: './tab-api.component.html',
  styleUrls: ['./tab-api.component.scss'],
})
export class TabApiComponent {
  /** Available widgets */
  @Input() widgets: any;
  /** Sorting fields form array */
  @Input() formArray!: FormArray;
  /** Widget settings form group */
  @Input() formGroup!: FormGroup;

  /** Displayed columns of table */
  public displayedColumnsApps = ['field', 'order', 'label', 'actions'];
  /** To make drag and drop work with table */
  public data!: BehaviorSubject<AbstractControl[]>;

  /** Available ordering */
  public orderList = [
    { value: 'asc', text: this.translate.instant('common.asc') },
    { value: 'desc', text: this.translate.instant('common.desc') },
  ];

  /**
   * Constructor for the widget API settings tab
   *
   * @param fb Angular form builder
   * @param translate Translate service
   */
  constructor(private fb: FormBuilder, private translate: TranslateService) {}

  /**
   * Adds row to the table
   *
   */
  addRow(): void {
    const row = this.fb.group({
      field: [this.widgets[0]?.name ?? '', Validators.required],
      order: [this.orderList[0].value, Validators.required],
      label: ['', Validators.required],
    });
    this.formArray.push(row);
    this.updateView();
  }

  /**
   * Removes row to the table
   *
   * @param itemIndex item index
   */
  removeRow(itemIndex: number): void {
    this.formArray.removeAt(itemIndex);
    this.updateView();
  }

  /**
   * Refreshes the table view
   */
  updateView(): void {
    this.data.next(this.formArray.controls);
  }
}
