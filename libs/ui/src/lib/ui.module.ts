import { NgModule } from '@angular/core';
import { AvatarModule } from './avatar/avatar.module';
import { ButtonComponent } from './button/button.component';
import { CheckboxModule } from './checkbox/checkbox.module';
import { IconModule } from './icon/icon.module';
import { TooltipModule } from './tooltip/tooltip.module';
import { SpinnerModule } from './spinner/spinner.module';
import { PaginatorModule } from './paginator/paginator.module';
import { AvatarGroupModule } from './avatar-group/avatar-group.module';
import { ToggleModule } from './toggle/toggle.module';
import { DividerModule } from './divider/divider.module';
import { DatePickerModule } from './date/date-picker/date-picker.module';
import { DateRangeModule } from './date/date-range/date-range.module';
import { TextareaModule } from './textarea/textarea.module';
import { RadioModule } from './radio/radio.module';

/**
 * UI Library Module
 */
@NgModule({
  exports: [
    ButtonComponent,
    AvatarModule,
    AvatarGroupModule,
    CheckboxModule,
    IconModule,
    TooltipModule,
    SpinnerModule,
    PaginatorModule,
    ToggleModule,
    DividerModule,
    DatePickerModule,
    DateRangeModule,
    TextareaModule,
    RadioModule,
  ],
})
export class UiModule {}
