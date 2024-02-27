import { Component, Input, OnInit } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CdkTableModule } from '@angular/cdk/table';
import { EmptyModule } from '../../../ui/empty/empty.module';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { v4 as uuidv4 } from 'uuid';

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
export class TabApiComponent extends UnsubscribeComponent implements OnInit {
  /** Sorting fields form array */
  @Input() formArray!: FormArray;
  /** Widget settings form group */
  @Input() formGroup!: FormGroup;

  /** Displayed columns of table */
  public displayedColumnsApps = ['name', 'actions'];
  /** To make drag and drop work with table */
  public data!: BehaviorSubject<AbstractControl[]>;

  /**
   * Constructor for the widget API settings tab
   *
   * @param fb Angular form builder
   * @param dialog Angular CDK Dialog service
   */
  constructor(private fb: FormBuilder, private dialog: Dialog) {
    super();
  }

  ngOnInit() {
    this.data = new BehaviorSubject<AbstractControl[]>(this.formArray.controls);
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
   * Removes row to the table
   *
   * @param itemIndex item index
   */
  async addEditRule(itemIndex?: number): Promise<void> {
    let selectedRule = null;
    if (itemIndex) {
      selectedRule = this.formArray.at(itemIndex);
    }
    const { TabApiEditorComponent } = await import(
      './tab-api-editor/tab-api-editor.component'
    );
    const dialogRef = this.dialog.open(TabApiEditorComponent, {
      data: selectedRule,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        if (itemIndex) {
          this.formArray.at(itemIndex).setValue(value);
        } else {
          const row = this.fb.group({
            name: [value.name],
            id: [uuidv4()],
            targetWidget: [value.targetWidget],
            event: [value.event],
          });
          this.formArray.push(row);
        }
        this.updateView();
      }
    });
  }

  /**
   * Refreshes the table view
   */
  updateView(): void {
    this.data.next(this.formArray.controls);
  }
}
