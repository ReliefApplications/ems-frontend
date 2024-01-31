import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  IconModule,
  TooltipModule,
  ButtonModule,
  AlertModule,
} from '@oort-front/ui';
import { EmptyModule } from '../../../ui/empty/empty.module';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ReferenceData } from '../../../../models/reference-data.model';
import { gql } from '@apollo/client';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';

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
    ButtonModule,
    AlertModule,
    ResizableModule,
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
    formatOnPaste: true,
    automaticLayout: true,
  };
  /** size style of editor */
  public style: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    // if the mapping is already loaded
    if (changes['referenceData'] && !changes['control']) {
      // if the reference data doesn't change
      if (
        changes.referenceData.currentValue?.id ==
        changes.referenceData.previousValue?.id
      ) {
        return;
      }
      this.refresh(true);
    } else {
      // init the mapping
      this.refresh();
    }
  }

  /**
   * Refresh editor, updating template & variables if needed.
   *
   * @param restoreTemplate boolean to indicate if should restore variables template
   * @param keepVariables boolean to indicate if should keep used variables
   */
  public refresh(restoreTemplate?: boolean, keepVariables?: boolean): void {
    if (this.referenceData?.type !== 'graphql') {
      this.availableQueryVariables = [];
      return;
    }

    try {
      const query = gql(this.referenceData.query ?? '');
      const definition = query.definitions?.[0];
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

      // Checks if the variable mapping is null or if should restore template
      if (
        (!this.control.value && this.control.value !== '') ||
        restoreTemplate
      ) {
        // If so, generate a template with the variables being keys of a json object.
        const template = JSON.stringify(
          availableVariables.reduce((acc, curr) => {
            acc[curr] = null;
            return acc;
          }, {} as Record<string, any>),
          null,
          2
        );
        // if should restore variables keep the current variables and add the deleted ones
        if (keepVariables) {
          this.control.setValue(
            JSON.stringify(
              {
                ...JSON.parse(template ?? '{}'),
                ...JSON.parse(this.control.value ? this.control.value : '{}'),
              },
              null,
              2
            )
          );
        } else {
          this.control.setValue(template);
        }
      }
      this.availableQueryVariables = availableVariables;
    } catch (_) {
      console.error('Error while building available graphql variables', _);
      this.availableQueryVariables = [];
    }
  }

  /**
   * On resizing action
   *
   * @param event resize event
   */
  onResizing(event: ResizeEvent): void {
    this.style = {
      // width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
  }

  /**
   * Check if resize event is valid
   *
   * @param event resize event
   * @returns boolean
   */
  validate(event: ResizeEvent): boolean {
    const minHeight = 300;
    if (event.rectangle.height && event.rectangle.height < minHeight) {
      return false;
    } else {
      return true;
    }
  }
}
