import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from './avatar/avatar.module';
import { ButtonModule } from './button/button.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { FlyoutMenuModule } from './flyout-menu/flyout-menu.module';
import { IconModule } from './icon/icon.module';
import { SelectModule } from './select/select.module';
import { AvatarGroupModule } from './avatar-group/avatar-group.module';
import { ToggleModule } from './toggle/toggle.module';
import { DividerModule } from './divider/divider.module';
import { SliderModule } from './slider/slider.module';
import { FormsModule } from '@angular/forms';

/**
 * UI Library Module
 */
@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [
    AvatarModule,
    ButtonModule,
    AvatarGroupModule,
    CheckboxModule,
    FlyoutMenuModule,
    IconModule,
    SelectModule,
    ToggleModule,
    DividerModule,
    SliderModule,
    FormsModule,
  ],
})
export class UiModule {}
