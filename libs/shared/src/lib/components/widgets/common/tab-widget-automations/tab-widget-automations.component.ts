import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { Dialog } from '@angular/cdk/dialog';
import { isNil } from 'lodash';
import { createAutomationForm } from '../../../../forms/automation.forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Tab for widget automation rules.
 */
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
    TooltipModule,
    CdkTableModule,
    FormWrapperModule,
    SelectMenuModule,
    EmptyModule,
  ],
  templateUrl: './tab-widget-automations.component.html',
  styleUrls: ['./tab-widget-automations.component.scss'],
})
export class TabWidgetAutomationsComponent implements OnInit {
  /** Rules form array */
  @Input() formArray!: FormArray<ReturnType<typeof createAutomationForm>>;

  /** Displayed columns of table */
  public displayedColumnsApps = ['name', 'id', 'actions'];
  /** List of rules */
  public data: any[] = [];
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Tab for widget automation rules.
   *
   * @param fb Angular form builder
   * @param dialog Angular CDK Dialog service
   */
  constructor(private fb: FormBuilder, private dialog: Dialog) {}

  ngOnInit() {
    this.updateRuleList();
  }

  /**
   * Update list of automation rules.
   */
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
    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
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
