import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from './avatar/avatar.module';
import { ButtonModule } from './button/button.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { FlyoutMenuModule } from './flyout-menu/flyout-menu.module';
import { IconModule } from './icon/icon.module';
import { SelectModule } from './select/select.module';
import { ToggleModule } from './toggle/toggle.module';
import { DividerModule } from './divider/divider.module';
import { TextareaModule } from './textarea/textarea.module';

/**
 * UI Library Module
 */
@NgModule({
  imports: [CommonModule],
  exports: [
    AvatarModule,
    ButtonModule,
    CheckboxModule,
    FlyoutMenuModule,
    IconModule,
    SelectModule,
    ToggleModule,
    DividerModule,
    TextareaModule,
  ],
})
export class UiModule {}
