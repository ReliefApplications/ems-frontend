import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { takeUntil } from 'rxjs';
import { createFileExplorerWidgetFormGroup } from './file-explorer-forms';
import get from 'lodash/get';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileExplorerFoldersTabComponent } from './file-explorer-folders-tab/file-explorer-folders-tab.component';
import { ContextualFiltersSettingsComponent } from '../common/contextual-filters-settings/contextual-filters-settings.component';

/**
 * File explorer widget settings.
 */
@Component({
  selector: 'shared-file-explorer-widget-settings',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    DisplaySettingsComponent,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    TooltipModule,
    FileExplorerFoldersTabComponent,
    ContextualFiltersSettingsComponent,
  ],
  templateUrl: './file-explorer-widget-settings.component.html',
  styleUrls: ['./file-explorer-widget-settings.component.scss'],
})
export class FileExplorerWidgetSettingsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Widget definition */
  @Input() widget: any;
  /** Emit the applied change */
  @Output() formChange: EventEmitter<ReturnType<typeof extendWidgetForm>> =
    new EventEmitter();
  /** Widget form group */
  public widgetFormGroup!: ReturnType<typeof extendWidgetForm>;

  // settings
  ngOnInit(): void {
    if (!this.widgetFormGroup) {
      this.buildSettingsForm();
    }
    this.widgetFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.widgetFormGroup.markAsDirty({ onlySelf: true });
        this.formChange.emit(this.widgetFormGroup);
      });
  }

  /**
   * Create form group, and extend it to get display settings ( such as borderless )
   */
  public buildSettingsForm() {
    this.widgetFormGroup = extendWidgetForm(
      createFileExplorerWidgetFormGroup(this.widget.id, this.widget.settings),
      get(this.widget, 'settings.widgetDisplay')
    );
  }
}
