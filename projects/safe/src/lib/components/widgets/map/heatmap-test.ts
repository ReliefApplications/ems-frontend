import 'leaflet.heat';
import { merge, get } from 'lodash';
import { haversineDistance } from './utils/haversine';
import { DomService } from '../../../services/dom/dom.service';
import { GroupedPointsPopupComponent } from './grouped-points-popup/grouped-points-popup.component';
import { Feature, Point } from 'geojson';
import { generateRandomFeatures } from './generateFeatureCollection';

declare let L: any;

type HeatMapOptions = {
  minOpacity: number;
  maxZoom: number;
  max: number;
  radius: number;
  blur: number;
  gradient: any;
};

/** Default heatmap options */
const defaultHeatMapOptions: HeatMapOptions = {
  gradient: {
    0: '#08d1d1',
    0.25: '#08d169',
    0.5: '#deba07',
    0.75: '#de6707',
    1: '#de0715',
  },
  max: 1.0,
  radius: 10,
  blur: 15,
  minOpacity: 0.5,
  maxZoom: 18,
};

/**
 * Generates a heatmap layer and adds it to the map
 * Also adds a click event to the map, which calculates the number of points
 * (from the heatmap)in a circle around the clicked point
 *
 * @param map The map to add the heatmap to
 * @param domService The dom service
 * @param options Options for the heatmap
 */
export const generateHeatMap = (
  map: any,
  domService: DomService,
  options?: Partial<HeatMapOptions>
) => {
  const total = 10000;
  const geoJSON = generateRandomFeatures({
    numFeatures: total,
    Point: {
      generateProperties: () => {
        const weight = Math.random();
        const id = Math.random().toString(36).substring(2, 15);
        const title = `point_${id}`;
        const random = Math.random() > 0.5;
        return {
          id,
          weight,
          title,
          'marker-symbol': 'harbor',
          imgSrc: random
            ? 'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg'
            : 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/560px-Saturn_during_Equinox.jpg',
        };
      },
    },
  });
  const heatArray: Feature<Point>[] = [];
  geoJSON.features.forEach((feature) => {
    if (feature.geometry.type === 'Point') {
      heatArray.push(feature as Feature<Point>);
    }
  });

  // Leaflet.heat doesn't support click events, so we have to do it ourselves
  map.on('click', (event: any) => {
    const zoom = map.getZoom();
    const coordinates = event.latlng;

    // there is a problem here, the radius should be different
    // depending on the latitude, because of the distortion of the Mercator projection
    // I couldn't get it to work, so I just used a fixed radius, based on the zoom level alone
    // https://en.wikipedia.org/wiki/Mercator_projection#Scale_factor
    // const mercatorScaleFactor = (latitude: number) => {
    //   const lat = (Math.PI / 180) * latitude;
    //   return (
    //     Math.cos(lat) /
    //     Math.sqrt(1 - Math.pow(Math.sin(lat), 2) * Math.pow(Math.E, 2))
    //   );
    // };

    const radius = 1000 / zoom;

    // checks if the point is within the calculate radius
    const heatMapPoints = heatArray.filter((point) => {
      const heatMapPoint = [
        point.geometry.coordinates[1],
        point.geometry.coordinates[0],
        get(point, 'properties.weight', 1),
      ];
      const distance = haversineDistance(
        coordinates.lat,
        coordinates.lng,
        heatMapPoint[0],
        heatMapPoint[1]
      );

      return distance < radius;
    });

    if (heatMapPoints.length > 0) {
      // create a circle around the point (for debugging)
      const circle = L.circle(coordinates, {
        radius: radius * 1000, // haversineDistance returns km, circle radius is in meters
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
      });
      circle.addTo(map);
      // create a popup that renders the GroupedPointsPopupComponent
      // create div element
      const div = document.createElement('div');
      // create component
      // render the GroupedPointsPopupComponent
      const groupedPopup = domService.appendComponentToBody(
        GroupedPointsPopupComponent,
        div
      );
      const instance: GroupedPointsPopupComponent = groupedPopup.instance;

      // set the points
      instance.points = heatMapPoints;
      instance.template = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; padding: 4px">
          <p style="color: gray">ID</p>
          <p>{{id}}</p>
          <p style="color: gray">Title</p>
          <p>{{title}}</p>
          <p style="color: gray">Marker</p>
          <p>{{marker-symbol}}</p>
          <p style="color: gray">Weight</p>
          <p>{{weight}}</p>
          <p style="color: gray">Title</p>
          <p>{{title}}</p>
          <p style="color: gray">Marker</p>
          <p>{{marker-symbol}}</p>
        </div>
        <img src="{{imgSrc}}" width="100%" />
        `;

      const popup = L.popup({ closeButton: false })
        .setLatLng(coordinates)
        .setContent(div);

      // listen to popup close event
      instance.close.subscribe(() => {
        popup.remove();
      });

      circle.bindPopup(popup);
      popup.on('remove', () => map.removeLayer(circle));
      circle.openPopup();
    }
  });

  const heatMapLayer = L.heatLayer(
    heatArray.map((point) => [
      point.geometry.coordinates[1],
      point.geometry.coordinates[0],
      get(point, 'properties.weight', 1),
    ]),
    merge(defaultHeatMapOptions, options)
  );

  heatMapLayer.addTo(map);
};
