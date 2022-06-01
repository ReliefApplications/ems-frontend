import * as L from 'leaflet';

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
      "<div><input /><div id='map' style='height: 500px; margin-top: 7px;' /></div>",
    /**
     * @param question
     * @param el
     */
    afterRender: (question: any, el: any) => {
      const map = L.map('map', { zoomControl: false }).setView([0, 0], 3);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map',
        noWrap: true,
        minZoom: 1,
      }).addTo(map);
      L.control
        .zoom({
          position: 'bottomleft',
        })
        .addTo(map);
      const text = el.getElementsByTagName('input')[0];
      text.inputType = question.inputType;
      text.placeholder = question.placeHolder;
      const button = el.getElementsByTagName('div')[0];
      map.on('click', (e: any) => {
        question.value =
          'lat: ' +
          e.latlng.lat.toFixed(6) +
          ', ' +
          'lng: ' +
          e.latlng.lng.toFixed(6);
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
