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
 * Inits the users component.
 *
 * @param survey survey class.
 * @param esriApiKey
 */
export const init = (survey: any, esriApiKey: string): void => {
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
    },
    isDefaultRender: false,
    htmlTemplate:
      "<div class='surveyjs-geolocation'>" +
      "<div class='container'>" +
      "<div class='left'>" +
      '<span>Address</span>' +
      '<input />' +
      '<span>Latitude</span>' +
      '<input />' +
      '<span>Longitude</span>' +
      '<input />' +
      '</div>' +
      "<div class='right'>" +
      "<div id='map'/>" +
      '</div>' +
      '</div>' +
      '</div>',
    /**
     * Initializes the map and sets up all the logic that it needs
     *
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

      L.esri.Vector.vectorBasemapLayer('OSM:Standard', {
        apiKey: esriApiKey,
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
            apikey: esriApiKey,
            nearby: {
              lat: -33.8688,
              lng: 151.2093,
            },
          }),
        ],
      }).addTo(map);

      const setValues = (adrs: string, lat: any, lng: any) => {
        question.value = adrs + ', lat: ' + lat + ', lng: ' + lng;
      };

      const address = el.getElementsByTagName('input')[0];
      const latitude = el.getElementsByTagName('input')[1];
      const longitude = el.getElementsByTagName('input')[2];

      searchControl.on('results', (e: any) => {
        setValues(e.text, e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
      });

      latitude.addEventListener('input', () => {
        L.esri.Geocoding.geocodeService({
          apikey: esriApiKey,
        })
          .reverse()
          .latlng({ lat: latitude.value, lng: longitude.value })
          .run((error: any, result: any) => {
            if (error) {
              return;
            }
            setValues(
              result.address.Match_addr,
              latitude.value,
              longitude.value
            );
          });
      });

      longitude.addEventListener('input', () => {
        L.esri.Geocoding.geocodeService({
          apikey: esriApiKey,
        })
          .reverse()
          .latlng({ lat: latitude.value, lng: longitude.value })
          .run((error: any, result: any) => {
            if (error) {
              return;
            }
            setValues(
              result.address.Match_addr,
              latitude.value,
              longitude.value
            );
          });
      });

      map.on('click', (e: any) => {
        L.esri.Geocoding.geocodeService({
          apikey: esriApiKey,
        })
          .reverse()
          .latlng(e.latlng)
          .run((error: any, result: any) => {
            if (error) {
              return;
            }
            setValues(
              result.address.Match_addr,
              e.latlng.lat.toFixed(6),
              e.latlng.lng.toFixed(6)
            );
          });
      });
      /**
       * Sets all the values with the updated data
       */
      const onValueChangedCallback = () => {
        address.value = question.value.slice(
          0,
          question.value.indexOf(', lat: ')
        );
        latitude.value = question.value.slice(
          question.value.indexOf(', lat: ') + 7,
          question.value.indexOf(', lng: ')
        );
        longitude.value = question.value.slice(
          question.value.indexOf(', lng: ') + 7
        );
        if (marker) {
          map.removeLayer(marker);
        }
        marker = L.circleMarker(
          { lat: latitude.value, lng: longitude.value },
          MARKER_OPTIONS
        );
        marker.addTo(map);
        map.setView({ lat: latitude.value, lng: longitude.value });
      };
      /**
       * Disable all inputs in readOnly mode
       */
      const onReadOnlyChangedCallback = () => {
        if (question.isReadOnly) {
          address.setAttribute('disabled', 'disabled');
          latitude.setAttribute('disabled', 'disabled');
          longitude.setAttribute('disabled', 'disabled');
        } else {
          address.removeAttribute('disabled');
          latitude.removeAttribute('disabled');
          longitude.removeAttribute('disabled');
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
