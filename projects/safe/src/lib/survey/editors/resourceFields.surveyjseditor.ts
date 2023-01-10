import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import {
  JsonObjectProperty,
  Question,
  Serializer,
  CustomWidgetCollection,
} from 'survey-core';
import { PropertyGridEditorCollection } from 'survey-creator-core';
import { ConfigDisplayGridFieldsModalComponent } from '../../components/config-display-grid-fields-modal/config-display-grid-fields-modal.component';
import {
  GetResourceByIdQueryResponse,
  GET_RESOURCE_BY_ID,
} from '../graphql/queries';

/**
 * Inits the resource fields widget
 *
 * @param apollo Apollo client
 * @param formBuilder form builder service
 * @param dialog dialog service
 * @param environment injected environment
 */
export const init = (
  apollo: Apollo,
  formBuilder: FormBuilder,
  dialog: MatDialog,
  environment: any
): void => {
  const widget = {
    name: 'resource-fields',
    title: 'Resource fields',
    isFit: (question: Question) => question.getType() === 'resource-fields',
    init: () => {
      // Register resource-fields type using the empty question as the base.
      Serializer.addClass('resource-fields', [], undefined, 'empty');

      // Hide the resource-fields type from the toolbox.
      CustomWidgetCollection.Instance.getCustomWidgetByName(
        'resource-fields'
      ).showInToolbox = false;
    },
    afterRender: (question: Question, htmlElement: HTMLElement): void => {
      const btn = document.createElement('button');
      btn.innerText = 'Available grid fields';
      btn.style.width = '100%';
      btn.style.border = 'none';
      btn.style.padding = '10px';
      btn.style.backgroundColor = environment.theme.primary;
      btn.style.color = 'white';
      htmlElement.appendChild(btn);
      btn.onclick = () => {
        getResourceById({ id: question.resource }).subscribe((response) => {
          if (response.data.resource && response.data.resource.name) {
            const nameTrimmed = response.data.resource.name
              .replace(/\s/g, '')
              .toLowerCase();
            const dialogRef = dialog.open(
              ConfigDisplayGridFieldsModalComponent,
              {
                data: {
                  form: !question.value
                    ? null
                    : convertFromRawToFormGroup(question.value),
                  resourceName: nameTrimmed,
                },
              }
            );
            dialogRef.afterClosed().subscribe((res: any) => {
              if (res && res.value.fields) question.value = res.getRawValue();
            });
          }
        });
      };
    },
  };

  const convertFromRawToFormGroup = (
    gridSettingsRaw: any
  ): FormGroup | null => {
    if (!gridSettingsRaw.fields) {
      return null;
    }
    const auxForm = formBuilder.group(gridSettingsRaw);
    auxForm.controls.fields.setValue(gridSettingsRaw.fields);
    return auxForm;
  };

  const getResourceById = (data: {
    id: string;
    filters?: { field: string; operator: string; value: string }[];
  }) =>
    apollo.query<GetResourceByIdQueryResponse>({
      query: GET_RESOURCE_BY_ID,
      variables: {
        id: data.id,
        filter: data.filters,
      },
    });

  // registers custom widget as type
  CustomWidgetCollection.Instance.add(widget, 'customtype');

  // registers custom property editor
  PropertyGridEditorCollection.register({
    fit: (prop: JsonObjectProperty) => prop.type === 'resource-fields',
    getJSON: () => ({
      type: 'resource-fields',
    }),
  });
};
