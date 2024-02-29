import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import {
  TableModule,
  MenuModule,
  TooltipModule,
  FormWrapperModule,
  SelectMenuModule,
  IconModule,
  ButtonModule,
} from '@oort-front/ui';
import { EmptyModule } from '../../../ui/empty/empty.module';
import { takeUntil } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { isNil } from 'lodash';
import { createAutomationForm } from '../../../../forms/automation.forms';

@Component({
  selector: 'shared-tab-widget-automations',
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
  templateUrl: './tab-widget-automations.component.html',
  styleUrls: ['./tab-widget-automations.component.scss'],
})
export class TabWidgetAutomationsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Rules form array */
  @Input() formArray!: FormArray<ReturnType<typeof createAutomationForm>>;

  /** Displayed columns of table */
  public displayedColumnsApps = ['name', 'id', 'actions'];
  /** List of rules */
  public data: any[] = [];

  /**
   * Tab for widget automation
   *
   * @param fb Angular form builder
   * @param dialog Angular CDK Dialog service
   */
  constructor(private fb: FormBuilder, private dialog: Dialog) {
    super();
  }

  ngOnInit() {
    this.updateRuleList();
  }

  private updateRuleList() {
    this.data = this.formArray.value;
  }

  /**
   * Removes row to the table
   *
   * @param itemIndex item index
   */
  removeRow(itemIndex: number): void {
    this.formArray.removeAt(itemIndex);
    this.updateRuleList();
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
    const { WidgetAutomationComponent } = await import(
      '../widget-automation/widget-automation.component'
    );
    const dialogRef = this.dialog.open(WidgetAutomationComponent, {
      data: selectedRule?.value,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        if (!isNil(itemIndex)) {
          this.formArray.removeAt(itemIndex);
          this.formArray.insert(itemIndex, createAutomationForm(value));
        } else {
          this.formArray.push(createAutomationForm(value));
        }
        this.updateRuleList();
      }
    });
  }
}
