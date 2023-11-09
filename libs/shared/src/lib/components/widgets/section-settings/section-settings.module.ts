import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionSettingsComponent } from './section-settings.component';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionModule } from '../section/section.module';

/**
 * Section widget settings module.
 */
@NgModule({
  declarations: [SectionSettingsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    DisplaySettingsComponent,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    SectionModule,
    TabsModule,
  ],
  exports: [SectionSettingsComponent],
})
export class SectionSettingsModule {}
