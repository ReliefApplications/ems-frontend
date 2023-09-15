import {
  ComponentCollection,
  JsonMetadata,
  Serializer,
  SvgRegistry,
} from 'survey-core';
import { SafeQuestion } from '../types';
import { GeospatialMapComponent } from '../../components/geospatial-map/geospatial-map.component';
import { DomService } from '../../services/dom/dom.service';
import { CustomPropertyGridComponentTypes } from './property-grid-components/components.enum';
import { registerCustomPropertyEditor } from './property-grid-components/component-register';
import { getGeoFields } from './utils/get-geospatial-fields';

/**
 * Inits the geospatial component.
 *
 * @param domService DOM service.
 * @param componentCollectionInstance ComponentCollection
 */
export const init = (
  domService: DomService,
  componentCollectionInstance: ComponentCollection
): void => {
  // registers icon-geospatial in the SurveyJS library
  SvgRegistry.registerIconFromSvg(
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
    onInit: (): void => {
      const serializer: JsonMetadata = Serializer;
      // Geospatial type
      serializer.addProperty('geospatial', {
        name: 'geometry',
        type: 'dropdown',
        category: 'general',
        required: true,
        default: 'Point',
        choices: ['Point'],
      });
      // Display geofields
      serializer.addProperty('geospatial', {
        name: 'geoFields',
        category: 'Map Properties',
        type: CustomPropertyGridComponentTypes.geospatialListbox,
        visibleIndex: 2,
        // dependsOn: ['geometry'],
        // visibleIf: (obj: null | any) => !!obj && obj.geometry === 'POINT',
      });
      // Tagbox
      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.geospatialListbox
      );
    },
    onAfterRender: (question: SafeQuestion, el: HTMLElement): void => {
      // hides the input element
      const element = el.getElementsByTagName('input')[0].parentElement;
      if (element) element.style.display = 'none';

      // render the GeospatialMapComponent
      const map = domService.appendComponentToBody(GeospatialMapComponent, el);
      const instance: GeospatialMapComponent = map.instance;

      // inits the map with the value of the question
      if (question.value) instance.data = question.value;

      // Set geo fields
      instance.fields = getGeoFields(question);

      // Listen to change on geofields
      question.registerFunctionOnPropertyValueChanged('geoFields', () => {
        instance.fields = question.geoFields;
      });

      // updates the question value when the map changes
      instance.mapChange.subscribe((res) => {
        question.value = res;
      });
    },
  };
  componentCollectionInstance.add(component);
};
