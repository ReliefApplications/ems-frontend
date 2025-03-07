import { Component, Input, OnInit } from '@angular/core';
import { Resource } from '../../../../models/resource.model';
import { Layout } from '../../../../models/layout.model';
import { get } from 'lodash';
import { GridLayoutService } from '../../../../services/grid-layout/grid-layout.service';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { ReferenceData } from '../../../../models/reference-data.model';
import { ReferenceDataService } from '../../../../services/reference-data/reference-data.service';
import { createEditorForm } from '../editor-settings.forms';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormWrapperModule,
  SelectMenuModule,
  SelectOptionModule,
  ButtonModule,
  TabsModule,
  TooltipModule,
  IconModule,
  CheckboxModule,
  RadioModule,
  DividerModule,
  ToggleModule,
  SpinnerModule,
} from '@oort-front/ui';
import { EditorModule } from '@tinymce/tinymce-angular';
import {
  ResourceSelectComponent,
  ReferenceDataSelectComponent,
} from '../../../controls/public-api';
import { CoreGridModule } from '../../../ui/core-grid/core-grid.module';
import { DisplaySettingsComponent } from '../../common/display-settings/display-settings.component';
import { TabWidgetAutomationsComponent } from '../../common/tab-widget-automations/tab-widget-automations.component';
import { TemplateAggregationsComponent } from '../../common/template-aggregations/template-aggregations.component';

/** Component for the record selection in the editor widget settings */
@Component({
  selector: 'shared-record-selection-tab',
  templateUrl: './record-selection-tab.component.html',
  styleUrls: ['./record-selection-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TranslateModule,
    DisplaySettingsComponent,
    CoreGridModule,
    EditorModule,
    SelectMenuModule,
    SelectOptionModule,
    ButtonModule,
    TabsModule,
    TooltipModule,
    IconModule,
    CheckboxModule,
    RadioModule,
    DividerModule,
    ToggleModule,
    ResourceSelectComponent,
    ReferenceDataSelectComponent,
    SpinnerModule,
    TemplateAggregationsComponent,
    // todo: rename ( remove s )
    TabWidgetAutomationsComponent,
  ],
})
export class RecordSelectionTabComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Widget form group */
  @Input() form!: ReturnType<typeof createEditorForm>;
  /** Current resource */
  @Input() referenceData: ReferenceData | null = null;
  /** Current resource */
  @Input() resource: Resource | null = null;
  /** Current layout */
  @Input() layout: Layout | null = null;
  /** Current record id */
  public selectedRecordID: string | null = null;
  /** Available reference data elements  */
  public refDataElements: any[] = [];
  /** Handles manual selection display */
  public manualControl = new FormControl<boolean>(false);
  /** Handles expression builder display */
  public expressionControl = new FormControl<boolean>(false);

  /**
   * Component for the record selection in the editor widget settings
   *
   * @param dialog Dialog service
   * @param gridLayoutService Shared layout service
   * @param referenceDataService Shared reference data service
   */
  constructor(
    private dialog: Dialog,
    private gridLayoutService: GridLayoutService,
    private referenceDataService: ReferenceDataService
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectedRecordID = this.form.get('record')?.value || null;
    // Automation on manual / expression selection
    this.manualControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.expressionControl.setValue(false);
          this.form.get('recordExpression')?.setValue(null);
        }
      });
    this.expressionControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.manualControl.setValue(false);
          this.form.get('record')?.setValue(null);
          this.selectedRecordID = null;
        }
      });
    if (this.form.get('record')?.value) {
      this.manualControl.setValue(true);
    }
    if (this.form.get('recordExpression')?.value) {
      this.expressionControl.setValue(true);
    }

    // Automation on reference data selection
    if (this.form.get('referenceData')?.value) {
      this.referenceDataService
        .cacheItems(this.form.get('referenceData')?.value as string)
        .then(({ items }) => {
          if (items) {
            this.refDataElements = items;
          }
        });
    }
    this.form.controls.referenceData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.referenceDataService
            .cacheItems(this.form.get('referenceData')?.value as string)
            .then(({ items }) => {
              if (items) {
                this.refDataElements = items;
              }
            });
        } else {
          this.refDataElements = [];
        }
      });
  }

  /** Opens modal for layout selection/creation */
  public async addLayout() {
    if (!this.resource) {
      return;
    }
    const { AddLayoutModalComponent } = await import(
      '../../../grid-layout/add-layout-modal/add-layout-modal.component'
    );
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.resource,
        hasLayouts: get(this.resource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.form.get('layout')?.setValue(value);
        } else {
          this.form.get('layout')?.setValue((value as any).id);
        }
      }
    });
  }

  /**
   * Edit chosen layout, in a modal. If saved, update it.
   */
  public async editLayout(): Promise<void> {
    const { EditLayoutModalComponent } = await import(
      '../../../grid-layout/edit-layout-modal/edit-layout-modal.component'
    );
    const dialogRef = this.dialog.open(EditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout: this.layout,
        queryName: this.resource?.queryName,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.layout) {
        this.gridLayoutService
          .editLayout(this.layout, value, this.resource?.id)
          .subscribe(() => {
            if (this.form.get('layout')) {
              this.form
                .get('layout')
                ?.setValue(this.form.get('layout')?.value || null);
            }
          });
      }
    });
  }

  /** Handles deselect current layout */
  public deselectLayout(): void {
    this.form.get('layout')?.setValue(null);
    this.form.get('record')?.setValue(null);
  }

  /**
   * Updates the selected record when the selected row is changed.
   *
   * @param event selection event
   */
  onSelectionChange(event: any) {
    if (event.selectedRows.length > 0) {
      this.form.get('record')?.setValue(event.selectedRows[0].dataItem.id);
      this.selectedRecordID = event.selectedRows[0].dataItem.id;
    } else {
      this.form.get('record')?.setValue(null);
      this.selectedRecordID = null;
    }
  }

  /**
   * Reset given form field value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param formField Current form field
   * @param event click event
   */
  clearFormField(formField: string, event: Event) {
    if (this.form.get(formField)?.value) {
      this.form.get(formField)?.setValue(null);
    }
    event.stopPropagation();
  }
}
