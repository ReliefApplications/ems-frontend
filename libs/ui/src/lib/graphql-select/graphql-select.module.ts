import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphQLSelectComponent } from './graphql-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from '../spinner/spinner.module';
import { ButtonModule } from '../button/button.module';
import { SelectMenuModule } from '../select-menu/select-menu.module';
import { TooltipModule } from '../tooltip/tooltip.module';

/**
 * Select module for GraphQL queries.
 */
@NgModule({
  declarations: [GraphQLSelectComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    ButtonModule,
    SelectMenuModule,
    TooltipModule,
  ],
  exports: [GraphQLSelectComponent],
})
export class GraphQLSelectModule {}
