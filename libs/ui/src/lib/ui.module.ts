import { NgModule } from '@angular/core';
import { AvatarModule } from './avatar/avatar.module';
import { ButtonModule } from './button/button.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { IconModule } from './icon/icon.module';
import { TableModule } from './table/table.module';
import { TooltipModule } from './tooltip/tooltip.module';
import { SpinnerModule } from './spinner/spinner.module';
import { PaginatorModule } from './paginator/paginator.module';
import { AvatarGroupModule } from './avatar-group/avatar-group.module';
import { ToggleModule } from './toggle/toggle.module';
import { DividerModule } from './divider/divider.module';
import { AutocompleteModule } from './autocomplete/autocomplete.module';
import { SelectMenuModule } from './select-menu/select-menu.module';
import { SelectOptionModule } from './select-menu/components/select-option.module';
import { ExpansionPanelModule } from './expansion-panel/expansion-panel.module';
import { SliderModule } from './slider/slider.module';
import { TextareaModule } from './textarea/textarea.module';
import { RadioModule } from './radio/radio.module';
import { SidenavContainerModule } from './sidenav/sidenav-container.module';
import { ChipModule } from './chip/chip.module';
import { FormWrapperModule } from './form-wrapper/form-wrapper.module';
import { DialogModule } from './dialog/dialog.module';
import { TabsModule } from './tabs/tabs.module';
import { SnackbarModule } from './snackbar/snackbar.module';
import { AlertModule } from './alert/alert.module';
import { DatePickerModule } from './date/date-picker/date-picker.module';
import { DateRangeModule } from './date/date-range/date-range.module';
import { GraphQLSelectModule } from './graphql-select/graphql-select.module';
import { ErrorMessageModule } from './error-message/error-message.module';
import { FixedWrapperModule } from './fixed-wrapper/fixed-wrapper.module';

/**
 * UI Library Module
 */
@NgModule({
  exports: [
    AvatarModule,
    ButtonModule,
    AvatarGroupModule,
    CheckboxModule,
    IconModule,
    TableModule,
    TooltipModule,
    SpinnerModule,
    PaginatorModule,
    ToggleModule,
    DividerModule,
    AutocompleteModule,
    SelectMenuModule,
    SelectOptionModule,
    ExpansionPanelModule,
    SliderModule,
    TextareaModule,
    RadioModule,
    SidenavContainerModule,
    ChipModule,
    FormWrapperModule,
    DialogModule,
    TabsModule,
    SnackbarModule,
    AlertModule,
    DatePickerModule,
    DateRangeModule,
    GraphQLSelectModule,
    ErrorMessageModule,
    FixedWrapperModule,
  ],
})
export class UiModule {}
