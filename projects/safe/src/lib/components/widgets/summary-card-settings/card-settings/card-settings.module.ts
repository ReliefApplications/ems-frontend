import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SafeButtonModule } from "../../../ui/button/button.module";
import { SafeCardSettingsComponent } from "./card-settings.component";
import {MatTooltipModule} from '@angular/material/tooltip';


/** Module for scheduler  component */
@NgModule({
  declarations: [SafeCardSettingsComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    TranslateModule,
    MatTooltipModule
  ],
  exports: [SafeCardSettingsComponent],
})
export class SafeCardSettingsModule {}
