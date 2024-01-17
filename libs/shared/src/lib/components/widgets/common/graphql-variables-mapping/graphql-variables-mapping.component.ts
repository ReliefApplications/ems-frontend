import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule, TooltipModule } from '@oort-front/ui';
import { EmptyModule } from '../../../ui/empty/empty.module';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ReferenceData } from '../../../../models/reference-data.model';
import { gql } from '@apollo/client';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Graphql variables mapping, for widgets using graphql reference data.
 */
@Component({
  selector: 'shared-graphql-variables-mapping',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    TooltipModule,
    EmptyModule,
    MonacoEditorModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './graphql-variables-mapping.component.html',
  styleUrls: ['./graphql-variables-mapping.component.scss'],
})
export class GraphqlVariablesMappingComponent implements OnChanges {
  /** Reference data */
  @Input() referenceData!: ReferenceData;
  /** Form control storing variables mapping */
  @Input() control!: FormControl;
  /** List of available variables to inject data */
  public availableQueryVariables: string[] = [];
  /** Monaco editor configuration, for raw edition */
  public editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    fixedOverflowWidgets: true,
  };

  ngOnChanges(): void {
    this.setAvailableQueryVariables();
  }

  /** Parses que refData query and gets the available variable names, excluding the pagination ones */
  private setAvailableQueryVariables(): void {
    if (this.referenceData?.type !== 'graphql') {
      this.availableQueryVariables = [];
      return;
    }

    try {
      const query = gql(this.referenceData.query ?? '');
      const definition = query.definitions[0];
      if (definition?.kind !== 'OperationDefinition') {
        this.availableQueryVariables = [];
        return;
      }

      const variableDefinitions = (definition.variableDefinitions ?? []).map(
        (variable) => variable.variable.name.value
      );

      const { cursorVar, offsetVar, pageVar, pageSizeVar } =
        (this.referenceData.pageInfo as any) ?? {};

      // Do not show pagination variables
      const availableVariables = variableDefinitions.filter(
        (v) => ![cursorVar, offsetVar, pageVar, pageSizeVar].includes(v)
      );

      console.log(availableVariables);

      console.log(this.control);

      // Checks if the variable mapping is null or empty.
      if (!this.control.value) {
        // If so, generate a template with the variables being keys of a json object.
        const template = JSON.stringify(
          availableVariables.reduce((acc, curr) => {
            acc[curr] = null;
            return acc;
          }, {} as Record<string, any>),
          null,
          2
        );
        this.control.setValue(template);
      }
      this.availableQueryVariables = availableVariables;
    } catch (_) {
      this.availableQueryVariables = [];
    }
  }
}
