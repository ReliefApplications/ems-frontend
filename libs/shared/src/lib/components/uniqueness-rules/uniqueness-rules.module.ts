import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { UniquenessRulesComponent } from './uniqueness-rules.component';
import { EditUniquenessRulesComponent } from './edit-uniqueness-rules/edit-uniqueness-rules.component';

/**
 * Module used to manage the components related to scoped uniqueness rules.
 */
@NgModule({
  declarations: [UniquenessRulesComponent, EditUniquenessRulesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    FormWrapperModule,
    IconModule,
    SelectMenuModule,
    TooltipModule,
  ],
  exports: [UniquenessRulesComponent, EditUniquenessRulesComponent],
})
export class UniquenessRulesModule {}
