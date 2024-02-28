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
import { isNil } from 'lodash';
import { WidgetAutomationEvent } from 'libs/shared/src/lib/models/automation.model';

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
})
export class TabApiComponent extends UnsubscribeComponent implements OnInit {
  /** Rules form array */
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
    if (!isNil(itemIndex)) {
      selectedRule = this.formArray.at(itemIndex);
    }
    const { TabApiEditorComponent } = await import(
      './tab-api-editor/tab-api-editor.component'
    );
    const dialogRef = this.dialog.open(TabApiEditorComponent, {
      data: selectedRule?.value,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        const row = this.fb.group({
          name: [value.name],
          id: [!isNil(itemIndex) ? value.id : uuidv4()],
          events: this.fb.array(
            value.events.map((event: WidgetAutomationEvent) =>
              this.fb.group({
                targetWidget: [event.targetWidget],
                layers: [event.layers],
                event: [event.event],
              })
            )
          ),
        });
        if (!isNil(itemIndex)) {
          this.formArray.removeAt(itemIndex);
          this.formArray.insert(itemIndex, row);
        } else {
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
