import { QuestionText } from 'survey-angular';
import { SafeGeospatialMapComponent } from '../../components/geospatial-map/geospatial-map.component';
import { DomService } from '../../services/dom/dom.service';

/**
 * Inits the geospatial component.
 *
 * @param Survey Survey library.
 * @param domService DOM service.
 */
export const init = (Survey: any, domService: DomService): void => {
  const component = {
    name: 'geospatial',
    title: 'Geospatial',
    questionJSON: {
      name: 'geospatial',
      type: 'text',
    },
    category: 'Custom Questions',
    onAfterRender: (question: QuestionText, el: HTMLElement): void => {
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

      // updates the question value when the map changes
      instance.mapChange.subscribe((res) => {
        question.value = res;
      });
    },
  };
  Survey.ComponentCollection.Instance.add(component);
};
