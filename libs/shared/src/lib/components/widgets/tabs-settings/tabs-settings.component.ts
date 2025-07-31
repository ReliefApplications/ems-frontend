import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { createTabsWidgetFormGroup } from './tabs-settings.form';
import get from 'lodash/get';
import { WidgetSettings } from '../../../models/dashboard.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule, TooltipModule, TabsModule } from '@oort-front/ui';
import { TabMainModule } from './tab-main/tab-main.module';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Settings of tabs widget.
 * Open in a modal.
 * todo: better types
 */
@Component({
  selector: 'shared-tabs-settings',
  templateUrl: './tabs-settings.component.html',
  styleUrls: ['./tabs-settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    DisplaySettingsComponent,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    TabMainModule,
  ],
})
export class TabsSettingsComponent
  implements OnInit, WidgetSettings<typeof extendWidgetForm>
{
  /** Widget definition */
  @Input() widget: any;
  /** Emit the applied change */
  @Output() formChange: EventEmitter<ReturnType<typeof extendWidgetForm>> =
    new EventEmitter();
  /** Widget form group */
  public widgetFormGroup!: ReturnType<typeof extendWidgetForm>;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (!this.widgetFormGroup) {
      this.buildSettingsForm();
    }
    this.widgetFormGroup.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
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
      createTabsWidgetFormGroup(this.widget.id, this.widget.settings),
      get(this.widget, 'settings.widgetDisplay'),
      {
        usePadding: new FormControl(
          get<boolean>(this.widget.settings, 'widgetDisplay.usePadding', true)
        ),
      }
    );
  }
}
