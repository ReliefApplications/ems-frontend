import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { Question, JsonMetadata } from 'survey-angular';
import { SurveyPropertyEditorFactory } from 'survey-creator';
import { SafeGeospatialMapComponent } from '../../components/geospatial-map/geospatial-map.component';
import { DomService } from '../../services/dom/dom.service';

/**
 * Inits the geospatial component.
 *
 * @param Survey Survey library.
 * @param domService DOM service.
 */
export const init = (Survey: any, domService: DomService): void => {
  // registers icon-geospatial in the SurveyJS library
  Survey.SvgRegistry.registerIconFromSvg(
    'geospatial',
    '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"> <path d="M0 0h24v24H0V0z" fill="none" /> <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z" /></svg>'
  );

  const component = {
    name: 'geospatial',
    title: 'Geospatial',
    iconName: 'icon-geospatial',
    questionJSON: {
      name: 'geospatial',
      type: 'text',
    },
    category: 'Custom Questions',
    onAfterRender: (question: Question, el: HTMLElement): void => {
      // hides the input element
      const element = el.getElementsByTagName('input')[0].parentElement;
      if (element) element.style.display = 'none';

      // render the SafeGeospatialMapComponent
      const map = domService.appendComponentToBody(
        SafeGeospatialMapComponent,
        el
      );
      const instance: SafeGeospatialMapComponent = map.instance;

      // inits the map with the value of the question
      if (question.value) instance.data = question.value;

      // inits and keep updated the useGeocoding boolean
      // to get and store the address of points on the map
      instance.useGeocoding = question.useGeocoding;
      question.registerFunctionOnPropertyValueChanged('useGeocoding', () => {
        instance.useGeocoding = question.useGeocoding;
      });

      // inits and keep updated the geoFields array
      // to know what address info to display
      instance.geoFields = question.geoFields ?? [];
      question.registerFunctionOnPropertyValueChanged('geoFields', () => {
        instance.geoFields = question.geoFields;
      });

      // updates the question value when the map changes
      instance.mapChange.subscribe((res) => {
        question.value = res;
      });
    },
    /** Initiate the geospatial question component */
    onInit: (): void => {
      const serializer: JsonMetadata = Survey.Serializer;
      serializer.addProperty('geospatial', {
        name: 'useGeocoding',
        category: 'Map Proprieties',
        type: 'boolean',
        visibleIndex: 1,
        required: true,
      });
      serializer.addProperty('geospatial', {
        name: 'geoFields',
        category: 'Map Proprieties',
        type: 'addressFieldsTagBox',
        visibleIndex: 2,
        dependsOn: ['useGeocoding'],
        visibleIf: (obj: null | any) => !!obj && !!obj.useGeocoding,
      });

      // Tagbox
      const addressEditor = {
        render: (editor: any, htmlElement: HTMLElement) => {
          const question = editor.object;
          const tagbox = domService.appendComponentToBody(
            MultiSelectComponent,
            htmlElement
          );
          const instance: MultiSelectComponent = tagbox.instance;
          instance.value = question.geoFields;
          instance.data = [
            'Street',
            'City',
            'Country',
            'District',
            'Region',
            'Coordinates',
          ];

          instance.registerOnChange(
            (event: any) => (question.geoFields = event)
          );
        },
      };

      SurveyPropertyEditorFactory.registerCustomEditor(
        'addressFieldsTagBox',
        addressEditor
      );
    },
  };
  Survey.ComponentCollection.Instance.add(component);
};
