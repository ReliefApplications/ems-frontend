import { NgModule } from "@angular/core";
import { SafeSummaryCardSettingsComponent } from "./summary-card-settings.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from "@progress/kendo-angular-layout";
import { SafeButtonModule } from "../../ui/button/button.module";


/** Module for scheduler  component */
@NgModule({
  declarations: [SafeSummaryCardSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    LayoutModule,
    SafeButtonModule
  ],
  exports: [SafeSummaryCardSettingsComponent],
})
export class SafeSummaryCardSettingsModule {}
