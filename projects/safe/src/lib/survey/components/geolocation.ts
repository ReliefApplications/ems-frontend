declare let L: any;

/** Default marker */
const MARKER_OPTIONS = {
  color: '#0090d1',
  opacity: 0.25,
  weight: 12,
  fillColor: '#0090d1',
  fillOpacity: 1,
  radius: 6,
};

/**
 *
 */
const API_KEY =
  'AAPKf2bae9b3f32943e2a8d58b0b96ffea3fj8Vt8JYDt1omhzN_lONXPRHN8B89umU-pA9t7ze1rfCIiiEVXizYEiFRFiVrl6wg';

/**
 * Inits the users component.
 *
 * @param survey survey class.
 */
export const init = (survey: any): void => {
  const widget = {
    name: 'geolocation',
    title: 'Geolocation',
    category: 'Question Library',
    /**
     *
     */
    widgetIsLoaded: () => true,
    /**
     * @param question
     */
    isFit: (question: any) => question.getType() === 'geolocation',
    /**
     * @param activatedBy
     */
    activatedByChanged: (activatedBy: any) => {
      survey.JsonObject.metaData.addClass('geolocation', [], null, 'text');
      survey.JsonObject.metaData.addProperties('geolocation', [
        { name: 'buttonText', default: 'Click Me' },
      ]);
    },
    isDefaultRender: false,
    htmlTemplate:
      "<div><input /><div id='map' style='height: 500px; margin-top: 7px;'/></div>",
    /**
     * @param question
     * @param el
     */
    afterRender: (question: any, el: any) => {
      const map = L.map('map', {
        zoomControl: false,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true,
      }).setView([0, 0], 3);

      let marker: any = null;
      // map.addLayer(marker);

      // TODO: see if fixable, issue is that it does not work if leaflet not put in html imports
      L.esri.Vector.vectorBasemapLayer('OSM:Standard', {
        apiKey: API_KEY,
      }).addTo(map);

      L.control
        .zoom({
          position: 'bottomleft',
        })
        .addTo(map);

      const searchControl = L.esri.Geocoding.geosearch({
        position: 'topleft',
        placeholder: 'Enter an address or place e.g. 1 York St',
        useMapBounds: false,
        providers: [
          L.esri.Geocoding.arcgisOnlineProvider({
            apikey: API_KEY,
            nearby: {
              lat: -33.8688,
              lng: 151.2093,
            },
          }),
        ],
      }).addTo(map);

      searchControl.on('results', (e: any) => {
        question.value = e.text;
        if (marker) {
          map.removeLayer(marker);
        }
        marker = L.circleMarker(e.latlng, MARKER_OPTIONS);
        marker.addTo(map);
      });

      const text = el.getElementsByTagName('input')[0];
      text.inputType = question.inputType;
      text.placeholder = question.placeHolder;
      const button = el.getElementsByTagName('div')[0];
      map.on('click', (e: any) => {
        const geocodeService = L.esri.Geocoding.geocodeService({
          apikey: API_KEY,
        });
        geocodeService
          .reverse()
          .latlng(e.latlng)
          .run((error: any, result: any) => {
            if (error) {
              return;
            }
            question.value = result.address.Match_addr;
            if (marker) {
              map.removeLayer(marker);
            }
            marker = L.circleMarker(e.latlng, MARKER_OPTIONS);
            marker.addTo(map);
          });
      });
      /**
       *
       */
      text.onchange = () => {
        question.value = text.value;
      };
      /**
       *
       */
      const onValueChangedCallback = () => {
        text.value = question.value ? question.value : '';
      };
      /**
       *
       */
      const onReadOnlyChangedCallback = () => {
        if (question.isReadOnly) {
          text.setAttribute('disabled', 'disabled');
          button.setAttribute('disabled', 'disabled');
        } else {
          text.removeAttribute('disabled');
          button.removeAttribute('disabled');
        }
      };
      question.readOnlyChangedCallback = onReadOnlyChangedCallback;
      question.valueChangedCallback = onValueChangedCallback;
      onValueChangedCallback();
      onReadOnlyChangedCallback();
    },
    /**
     * @param question
     * @param el
     */
    willUnmount: (question: any, el: any) => {},
  };

  survey.CustomWidgetCollection.Instance.addCustomWidget(widget, 'customtype');
};
