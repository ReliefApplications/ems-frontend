import { QuestionText } from 'survey-angular';
// Leaflet
declare let L: any;

/**
 * Inits the geospatial component.
 *
 * @param Survey Survey library.
 */
export const init = (Survey: any): void => {
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

      // creates the map container
      const div = document.createElement('div');
      div.style.height = '500px';
      el.appendChild(div);

      // creates layer
      const layer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );

      // creates map, adds it to the container
      // and created layer to it
      const map = L.map(div, {
        center: [0, 0],
        zoom: 2,
        pmIgnore: false,
      }).addLayer(layer);

      const getMapFeatures = () => ({
        type: 'FeatureCollection',
        features: map.pm.getGeomanLayers().map((l: any) => {
          const json = l.toGeoJSON();
          if (l instanceof L.Circle) {
            json.properties.radius = l.getRadius();
          }
          return json;
        }),
      });

      // init layers from question value
      if (question.value) {
        L.geoJSON(question.value, {
          // Circles are not supported by geojson
          // We abstract them as markers with a radius property
          pointToLayer: (feature: any, latlng: any) => {
            if (feature.properties.radius) {
              return new L.Circle(latlng, feature.properties.radius);
            } else {
              return new L.Marker(latlng);
            }
          },
        })
          .addTo(map)
          .eachLayer((l: any) => {
            l.on('pm:change', () => {
              question.value = getMapFeatures();
            });
          });
      }

      // add geoman tools
      map.pm.addControls({
        position: 'topright',
        drawText: false,
        drawCircleMarker: false,
      });

      // updates question value on adding new shape
      map.on('pm:create', (l: any) => {
        question.value = getMapFeatures();
        console.log(l);

        // subscribe to changes on the created layers
        l.layer.on('pm:change', () => {
          question.value = getMapFeatures();
        });
      });

      // updates question value on removing shapes
      map.on('pm:remove', () => {
        question.value = getMapFeatures();
      });
    },
  };
  Survey.ComponentCollection.Instance.add(component);
};
