import { Feature, FeatureCollection } from 'geojson';

/** Point test layer */
export const pointGeoJSON: Feature = {
  type: 'Feature',
  properties: {
    name: 'Coors Field',
    amenity: 'Baseball Stadium',
    popupContent: 'This is where the Rockies play!',
  },
  geometry: {
    type: 'Point',
    coordinates: [-104.99404, 39.75621],
  },
};

/** Complex test layer */
export const complexGeoJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [40.11348234228487, 23.758349944054757],
            [48.178129828595445, 24.533783435928683],
            [48.95401786039133, 45.045564528935415],
            [13.062267296081501, 36.89381558821758],
            [2.6529027332038595, 20.097026832317425],
            [40.11348234228487, 23.758349944054757],
          ],
        ],
        type: 'Polygon',
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-10.678803329804113, 71.0956513897849],
            [-18.780437979309838, 70.80282337169189],
            [-26.286730413630412, 69.95171399996924],
            [-32.787106173651416, 68.61373205093005],
            [-38.11646512811643, 66.88076004353798],
            [-42.29910322611946, 64.84399614154184],
            [-45.45843033300752, 62.58256785670003],
            [-47.74828372922428, 60.16052133186617],
            [-49.31617157730951, 57.6281665998982],
            [-50.28892098616937, 55.024823361176736],
            [-50.76998537782785, 52.38154896562948],
            [-50.84160204300386, 49.723377241134585],
            [-50.56839202238398, 47.07101538274504],
            [-50.000957840490685, 44.442084613254636],
            [-49.17898320131562, 41.852013009747274],
            [-48.13374362140686, 39.31467356342077],
            [-46.89008639731479, 36.84283781905132],
            [-45.467978289277326, 34.44849531233756],
            [-43.88371698765218, 32.143073640639514],
            [-42.150886597460975, 29.937582982305297],
            [-40.281119450323786, 27.842701267862033],
            [-38.28471050674364, 25.86881111174781],
            [-36.17111742567099, 24.025996354252168],
            [-33.949368961192846, 22.324004154377203],
            [-31.6283963277107, 20.772177672111855],
            [-29.217296204912962, 19.379364226587256],
            [-26.725529887243887, 18.153804199691695],
            [-24.16306057079944, 17.1030066674131],
            [-21.540429810938978, 16.2336185701481],
            [-18.868774654130593, 15.551294955885483],
            [-16.15978864426623, 15.06057822855633],
            [-13.425632502339134, 14.764794221049296],
            [-10.678803329804117, 14.665972165330578],
            [-7.931974157269099, 14.764794221049296],
            [-5.197818015342005, 15.060578228556325],
            [-2.4888320054776396, 15.55129495588548],
            [0.18282315133072966, 16.2336185701481],
            [2.8054539111912082, 17.1030066674131],
            [5.3679232276356625, 18.1538041996917],
            [7.859689545304728, 19.379364226587253],
            [10.27078966810247, 20.77217767211185],
            [12.591762301584627, 22.324004154377214],
            [14.813510766062748, 24.025996354252154],
            [16.927103847135403, 25.868811111747803],
            [18.923512790715552, 27.842701267862033],
            [20.793279937852752, 29.937582982305297],
            [22.526110328043952, 32.1430736406395],
            [24.11037162966911, 34.44849531233756],
            [25.532479737706552, 36.84283781905131],
            [26.776136961798635, 39.31467356342077],
            [27.821376541707394, 41.852013009747274],
            [28.643351180882448, 44.44208461325463],
            [29.210785362775763, 47.07101538274505],
            [29.483995383395634, 49.723377241134585],
            [29.412378718219617, 52.38154896562947],
            [28.931314326561147, 55.024823361176736],
            [27.958564917701285, 57.62816659989819],
            [26.390677069616075, 60.16052133186617],
            [24.10082367339929, 62.58256785670003],
            [20.941496566511255, 64.84399614154184],
            [16.758858468508198, 66.88076004353798],
            [11.429499514043261, 68.61373205093003],
            [4.929123754022222, 69.95171399996924],
            [-2.5771686802983944, 70.80282337169189],
            [-10.678803329804113, 71.0956513897849],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [20.656248412805127, 51.35178942845491],
        type: 'Point',
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [-8.286059052766632, 46.18632287935097],
        type: 'Point',
      },
    },
  ],
};

/**
 *
 */
export const cornerGeoJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [201.02489895637564, 85.05112877980659],
            [149.4806218104489, 57.54444012030291],
            [175.57192434274083, 34.173334189735414],
            [225.70022802261695, 23.473301462277234],
            [259.7876915326606, 51.33853487542737],
            [201.02489895637564, 85.05112877980659],
          ],
        ],
        type: 'Polygon',
      },
    },
  ],
};

/** Heat map test layer */
export const heatMapGeoJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8182823132986423,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86526, 53.72319],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.693346443996882,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81488, 53.72553],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6926488308573235,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81488, 53.72553],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8565193926186294,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81303, 53.72535],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2791657078425922,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81488, 53.72553],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.35856764618461057,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.82432, 53.67823],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.40764356841916416,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.82704, 53.73413],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9707240151603667,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88225, 53.76786],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.806674648711601,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88225, 53.76786],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22635919961420203,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83213, 53.71],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5360507770663601,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87035, 53.72926],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.10962245064527099,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87035, 53.72926],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.16611835054925916,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81138, 53.72574],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.048412556927682315,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83627, 53.73216],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22792097494104557,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.82969, 53.72865],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5137173347422856,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88116, 53.74324],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.10126710643106662,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88116, 53.74324],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5099077664078238,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83492, 53.68126],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.031221890402274077,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83917, 53.6778],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.37409745749123235,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83917, 53.6778],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5096804891583886,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83917, 53.6778],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8403584959099364,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.56426750815212,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.087421444835315,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.03334961639102474,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85916, 53.72205],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5387543033568927,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87665, 53.74066],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5097098094460899,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87908, 53.75291],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9110521421376883,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88045, 53.72284],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.01398554043607625,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88286, 53.72251],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09309384177121394,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89527, 53.72374],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.709294989537343,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90069, 53.72329],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.16918221209538942,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85879, 53.73213],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3578976642694478,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81488, 53.72553],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7199813190168471,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81488, 53.72553],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6368685198360082,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84486, 53.72298],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.27407736436436325,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86477, 53.72206],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7932185321416967,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.96075, 53.73023],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8686143569059541,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.82997, 53.7399],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.058433276230827946,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.82997, 53.7399],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5504514017213391,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.38124127264878216,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81069, 53.7201],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7289147038221016,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88409, 53.72712],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.18895180476859585,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87918, 53.72094],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.06656168026622167,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88283, 53.74337],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5708602256699289,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88465, 53.74456],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8425634072955619,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8791, 53.7161],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.611907307340499,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8791, 53.7161],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7507984088861706,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8791, 53.7161],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4254277112976339,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83707, 53.6849],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5695651503499588,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83692, 53.68478],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7402297323087392,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83633, 53.6845],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.0879276278698633,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83707, 53.6849],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.013336592923134383,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9922966541051577,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9622161865044492,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8130700533530137,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.359327198959968,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22437892587209385,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3130289384286955,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9783678348151543,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87467, 53.75605],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7178185264577521,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86785, 53.71881],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.27986249341105385,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86785, 53.71881],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1458295879267173,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88106, 53.6874],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5696464931051226,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8175, 53.73228],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5581630400376805,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81409, 53.72894],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3014291188341214,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85853, 53.71906],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.30049460673397954,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86358, 53.73624],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4777918644747241,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85248, 53.72913],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9733485248981966,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87738, 53.73706],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.728742688265984,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88398, 53.74374],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6124668023858133,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.44130330520629824,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87076, 53.72116],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4102199419807073,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83963, 53.68933],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6915554141598379,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88076, 53.7254],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9182033970666461,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8728, 53.72455],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.014438582802833944,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8728, 53.72455],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9955339082737411,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8728, 53.72455],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.127973585417954,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85894, 53.72251],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1670683541687188,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87579, 53.72651],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9068474811779579,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85567, 53.72792],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.45479272439176666,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88141, 53.71527],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7085721657046198,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88141, 53.71527],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7226543593986994,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88141, 53.71527],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.061033170351438626,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88141, 53.71527],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.166097123893995,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84072, 53.68563],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3313419417981882,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83753, 53.68448],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3625259166648722,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83826, 53.68401],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11989641099386228,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83826, 53.68401],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5624953670364701,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84072, 53.68563],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2161518809890035,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89145, 53.72987],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6730116520694109,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85344, 53.70594],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.19993239516144223,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88259, 53.72517],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.16754653400985808,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83756, 53.68363],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3795468307774055,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8099196551876366,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85589, 53.70625],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.894622456674401,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85751, 53.71763],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9447310118591368,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84468, 53.68604],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6080000904663116,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84468, 53.68604],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3196105152189628,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84468, 53.68604],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5377574320500109,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84468, 53.68604],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.42490885938952294,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2686512758745738,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.17631829809722532,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7097329572768805,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9525791236684771,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7690969998734121,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9967676063049393,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6767119253661114,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.48507464775532183,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9002358179022016,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9935395395756836,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4937968542613984,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8943792166505049,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3716495831025606,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.20344981079263236,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87381, 53.75854],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7473027144890785,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87381, 53.75854],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7990349786328872,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89072, 53.71936],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.14553781621579365,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83005, 53.69094],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.540496909622195,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81989, 53.74032],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6782486575194502,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8091, 53.75646],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.14969596828383103,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.80579, 53.75723],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6455436688972214,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86273, 53.72319],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3280694514216782,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86826, 53.72438],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6784030745256819,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86278, 53.72242],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5553002308090769,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86526, 53.72319],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5780268355700235,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86885, 53.73545],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.15181885322300115,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86635, 53.72101],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.21486501570562289,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86635, 53.72101],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3731392974998946,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86635, 53.72101],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9703418496298086,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90183, 53.76164],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.17627006583576343,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.9067, 53.7625],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3303944471945581,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83213, 53.71],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6612695917724984,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7826046323474796,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4518434789788488,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6243380701656618,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5759060347318534,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4724318977934785,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.82432, 53.67823],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8090182631547151,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88036, 53.72108],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8919468358952891,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83035, 53.72863],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4291448403177889,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81138, 53.72574],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8511221395870681,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81138, 53.72574],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.43738172254244634,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81138, 53.72574],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9431568623142659,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87696, 53.72414],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6298631320940913,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84722, 53.72902],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6052351469445252,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89426, 53.72677],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4159625224769321,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4898059155248313,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86716, 53.7372],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.957629479904377,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3161668852073083,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7915742618223909,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83354, 53.6832],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7751457842681173,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.49864505621282995,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.99222, 53.6959],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.44253970269949594,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86269, 53.70279],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7142969888105282,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8786, 53.7432],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.34195317739423614,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0132, 53.74164],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8296534410785472,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0132, 53.74164],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.381528952527161,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01203, 53.74578],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.34012884066899307,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91118, 53.70849],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6756447632805727,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91118, 53.70849],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.749881418081733,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91118, 53.70849],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8104840508357767,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91118, 53.70849],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.580135309080072,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.93823, 53.70531],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8084427199071691,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09992, 53.69256],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2836230942255962,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10263, 53.70981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9835253488862392,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10263, 53.70981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7853047108051849,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.098, 53.71316],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7737767726453046,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89789, 53.71049],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9886803441518399,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89789, 53.71049],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.24868430834515598,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83238, 53.73857],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3187956426715388,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83156, 53.70844],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8569759747038923,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89387, 53.74853],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5368747723883014,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01147, 53.74169],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8657845657391974,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98201, 53.72949],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.14600463468562808,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01263, 53.74382],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5616307667620279,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7965847985952166,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6803604943520363,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6982239251387639,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7329971306165157,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.13982001556369306,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94041, 53.67395],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.03844345400706328,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01422, 53.74107],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.642081746924724,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87353, 53.73921],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.999490128124324,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85991, 53.72357],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.716303070817883,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87379, 53.73603],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.10579073037859343,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87379, 53.73603],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9258007010872777,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87741, 53.74152],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.040891929583096065,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87736, 53.74203],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.05597170643826943,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87736, 53.74203],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.03594171745166008,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87736, 53.74203],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9725201756231374,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86785, 53.71881],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6158312112973912,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10191, 53.71115],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.17037016064384436,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10335, 53.69552],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.881042683874981,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10263, 53.70981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.18999436682229365,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10263, 53.70981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8617512534605878,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09779, 53.68768],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9658570434595364,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91636, 53.70325],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.16515695897040983,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91329, 53.70747],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.08582147468791512,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91423, 53.70666],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8564031154599059,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91449, 53.70588],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2960532242855567,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91423, 53.70666],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9559664787203856,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88093, 53.71678],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.525704051083349,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88169, 53.71981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7041903612034977,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88169, 53.71981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5926988743445833,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88159, 53.72476],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3345028744328187,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88093, 53.71678],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4104267340838843,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89836, 53.76278],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.796254174280842,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98183, 53.73068],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3828222854823886,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97568, 53.73022],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9718436187052157,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97568, 53.73022],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.20666079573685714,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11113187810923453,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91387, 53.7052],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.04312144904955506,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.23398264793774093,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88768, 53.73901],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.770088798185409,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90251, 53.73635],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6466592856784854,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90251, 53.73635],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.0959725685083459,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8505, 53.70715],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7466715170924454,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91253, 53.70728],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1267783310291246,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5370311498079363,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8625686050576344,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10035, 53.71226],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6073491254376622,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.06209, 53.71916],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3722053076786853,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09188, 53.71309],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.337863842430127,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90804, 53.70922],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9826766204681894,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90804, 53.70922],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6461199050055466,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90804, 53.70922],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.19501811065565122,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01767, 53.7406],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3710322622230462,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01767, 53.7406],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.010277509571952725,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01592, 53.74121],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7015629765835609,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.92645, 53.69991],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.30991636209709617,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88146, 53.7257],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.46692584281985305,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88159, 53.72476],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5799527684057617,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88151, 53.67213],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5132354512179302,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87916, 53.71847],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.13348235455326218,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87916, 53.71847],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.16809389128236618,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87916, 53.71847],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8678747515922414,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90804, 53.70922],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7764967055592387,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90804, 53.70922],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9556881549441785,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09477, 53.7179],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8496335623438385,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09581, 53.71737],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5317511445957208,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90574, 53.70979],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5859062432894653,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.11665, 53.70586],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.42511235799328606,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.11316, 53.70479],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.13247335852776687,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81241, 53.75529],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.84896557038955,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81466, 53.754],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.35403474640019006,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01186, 53.74109],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09765124987103824,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01316, 53.74431],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7327539202731324,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.04671, 53.73233],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.06193397180205862,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.96398, 53.65626],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2697303111581635,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.30249897184091457,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91387, 53.7052],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.20459038985538358,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90283, 53.71024],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9011953691166874,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91387, 53.7052],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4350027557771565,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87522, 53.72729],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.030853964767307618,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87522, 53.72729],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9804402109872696,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09924, 53.71869],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9218584147762536,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09924, 53.71869],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4000430197067453,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09708, 53.71419],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2807568884737741,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11773418343352371,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5151754223085725,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07262892392329978,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.42821978617092293,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.11813, 53.72591],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7899698369735111,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91108, 53.70848],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8540398384233634,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94256, 53.67368],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6661558519777888,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94256, 53.67368],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.41221363994653815,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86844, 53.72615],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.06871590552076845,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8553, 53.68828],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.835245654927651,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81032, 53.72552],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.763744453008655,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79977, 53.72553],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.04896309171037072,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86924, 53.72074],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.19531881413110908,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77639, 53.72463],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6480313317445476,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77512, 53.69835],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.27943524324457547,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78524, 53.69782],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3601078698325584,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78337, 53.69877],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3748268327596409,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78807, 53.71496],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5286192575737758,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.80195, 53.71583],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9526472954271201,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.80195, 53.71583],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.27060159949857443,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09744, 53.71436],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09501967615623519,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09708, 53.71576],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7028381380375384,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09824, 53.71683],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8743974001784682,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.13411, 53.73204],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7928333472028042,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.11995, 53.72629],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7107205826646028,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.11995, 53.72629],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.05380911141539202,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.11813, 53.72591],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2388604583291698,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.12248, 53.72714],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.24297188063023234,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09708, 53.71419],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.31656867519651133,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10793, 53.70423],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3732762415759783,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87888, 53.72175],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9155509504293466,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85956, 53.72108],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.006065107920048662,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85956, 53.72108],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.31462109394816484,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.016, 53.74122],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.37450151641029605,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.016, 53.74122],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7851327556648242,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01698, 53.74138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.18540767390073443,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97987, 53.7321],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.795694711019336,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94902, 53.66526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4165051914840938,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94902, 53.66526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7010164927315685,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78114, 53.70808],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5047118312551948,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78169, 53.70136],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.19372706015342156,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78258, 53.69982],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7625687486571329,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77954, 53.7041],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9747185002517156,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77422, 53.70213],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9665020886720277,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77145, 53.70109],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6596467359538598,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0927, 53.71399],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4786629260270012,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09635, 53.71384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9725273149802334,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09635, 53.71384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8252997779058544,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09553, 53.71368],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.041733933969150705,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09553, 53.71368],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.612397967978239,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.08987, 53.71451],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.33322023918481314,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90132, 53.76648],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.30138321383894917,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90361, 53.68149],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8561552086595827,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86411, 53.68596],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2941870647696412,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86411, 53.68596],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.26245500332906446,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85505, 53.68655],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7430804893416396,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90012, 53.72306],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9985380202935727,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88466, 53.71138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6491890926336898,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97987, 53.7321],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2787955562566735,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97987, 53.7321],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8776399000556507,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.7722, 53.69709],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.38824472293490575,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.7722, 53.69709],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.950111160172664,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78336, 53.71212],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.34828573224028747,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79134, 53.69084],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5721380965021021,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79134, 53.69084],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.746905802454733,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79489, 53.71539],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6288778462138032,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79489, 53.71539],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4283958222002271,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77695, 53.70079],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6800837324487543,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77695, 53.70079],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.059894383134107665,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78277, 53.69769],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07348603784177787,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77594, 53.69138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.14225638131874563,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09511, 53.71345],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.30063477504999425,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.08489, 53.71638],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.47710423243196853,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.06137, 53.71358],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8733449668647753,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10327, 53.72237],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.24942435183583167,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.08202, 53.71719],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7239591204743807,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.13958, 53.73389],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7802659251491577,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97342, 53.72961],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.583691366175908,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91041, 53.70715],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.18500309679120597,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89817, 53.69977],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5999299580665667,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.96056, 53.66952],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5746096436094992,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90395, 53.70972],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.06632547426433,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91089, 53.70902],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.006907106521984119,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86411, 53.68596],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.549307698436432,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89595, 53.72974],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6921718583763925,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89595, 53.72974],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07980712767386455,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89595, 53.72974],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9258514847352177,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78063, 53.70214],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.44001168352858766,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78063, 53.70214],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5670174318893189,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78063, 53.70214],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3430785177140403,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78141, 53.70229],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7481347921360755,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.826, 53.68807],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.21308901180522977,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.826, 53.68807],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.05380673879525988,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83031, 53.68677],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09738020136166736,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78141, 53.70229],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.0073873563208159965,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.99222, 53.6959],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1556266776439168,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.99222, 53.6959],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8180382828883559,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98268, 53.7296],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5646036558667189,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77442, 53.69857],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.24279284691631298,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81307, 53.69869],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.778485063905785,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83342, 53.68496],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6137908070663436,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8645, 53.72065],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9886604337434803,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86407, 53.72184],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3411743310493396,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86446, 53.72134],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.21666179492341398,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86407, 53.72184],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7076121339504928,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94367, 53.71695],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8701475846544133,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8539, 53.70743],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7229855765173645,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8539, 53.70743],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6926087118308482,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8539, 53.70743],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.35551612029745483,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88336, 53.71616],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09878235538334379,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88336, 53.71616],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5159776193886478,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88494, 53.71631],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.23118498671304377,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.93388, 53.6952],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8040531700712521,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86258, 53.70914],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6533441117840331,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87347, 53.71443],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5315489064873,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.92094, 53.68333],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4391152546388277,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85548, 53.71562],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7114092721624417,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85548, 53.71562],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.38854292307671456,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86655, 53.71977],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7136697324673218,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86631, 53.71951],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.13758219970310614,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86631, 53.71951],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8356480866559262,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81756, 53.68329],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6917836610732526,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78254, 53.70306],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9839563084591165,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84468, 53.68604],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8957901895858229,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.9438, 53.72117],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.28269335859304245,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.93807, 53.71317],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7554908956532396,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.93807, 53.71317],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3306208010989298,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89896, 53.71914],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09799741347268842,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.82324, 53.74796],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09457600402889188,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81811, 53.73935],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07659021822382339,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.99729, 53.75612],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7883946368891801,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01056, 53.74239],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7414306181287476,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98163, 53.72773],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.04817516323475557,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87918, 53.72643],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.768724166765071,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86894, 53.73936],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5002961692563712,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87192, 53.73702],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.43969972274472324,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85446, 53.71424],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6123418106446663,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.80023, 53.71409],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5245537509087976,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.80279, 53.7147],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22459231346713238,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79608, 53.71066],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8113749313753955,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78048, 53.70126],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7623212419225156,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8556, 53.68701],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.695279653275169,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8556, 53.68701],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22760124824110628,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85739, 53.68588],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7340388543438214,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85739, 53.68588],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1923757303286806,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86731, 53.73832],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.32084967126895925,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87741, 53.74648],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9317565827048424,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81811, 53.73935],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5885590671918617,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84944, 53.71168],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5189319520431968,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85366, 53.71153],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8896732904348115,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01225, 53.74213],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6263763040416035,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78048, 53.70126],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11567332014248821,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77668, 53.69847],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4613653882700892,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91188, 53.70889],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.21814874872600276,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90052, 53.71195],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5607988458854107,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88728, 53.72913],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2760588442051557,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85441, 53.71086],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.06793742197368435,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85441, 53.71086],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.27553811859005894,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94683, 53.72209],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.694762794235763,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87626, 53.71451],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.45772972840692305,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87767, 53.7409],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7148505980781319,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8778, 53.74398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.253006058982963,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87841, 53.74511],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7056917969016605,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87841, 53.74511],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11927523823880937,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87841, 53.74511],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5299814764548547,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87841, 53.74511],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5092507092415581,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8778, 53.74398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.47025309595838527,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.7869, 53.70739],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.12115557778086417,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78111, 53.70178],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3933581436874567,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78111, 53.70178],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3751909285183215,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78111, 53.70178],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7351207699657678,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78111, 53.70178],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2566345169033435,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77535, 53.70113],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.481690647399297,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77535, 53.70113],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.47783099463032497,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77124, 53.72281],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.42519756893372307,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77124, 53.72281],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6563938141407282,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77124, 53.72281],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8268651967082361,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77512, 53.69835],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.27740804510865447,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98981, 53.71955],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4024336533550368,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98981, 53.71955],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6390415086409134,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.9406, 53.67437],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.48593382786716965,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.9406, 53.67437],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8503751008208782,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94226, 53.67199],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.06330957013705141,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89491, 53.71029],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.36516703599912703,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90466, 53.7138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.17176393284335978,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85441, 53.71086],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.37446683419471083,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86448, 53.73401],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.44322127416103996,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0132, 53.74252],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3374477264711877,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0132, 53.74252],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5699798913421981,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.02776, 53.74078],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3069363602196311,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86591, 53.70143],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5754447979524979,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85774, 53.72005],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6944839641672078,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77535, 53.70113],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8367831996888935,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77518, 53.70351],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5981889173437505,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77535, 53.70278],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.969625553919127,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77779, 53.72052],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8784264980892622,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77935, 53.70222],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7235508473022871,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77924, 53.70376],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7012624611720923,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77924, 53.70376],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.012370372441153243,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78299, 53.70091],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.879761373059917,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78299, 53.70091],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.45980390259905546,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94683, 53.72209],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09413623252715686,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94683, 53.72209],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8215249795065886,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86913, 53.72068],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.19197851685711687,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86533, 53.72183],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.49854149376378243,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98981, 53.71955],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8185178846925218,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98981, 53.71955],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.05365587497835178,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89015, 53.72309],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.983196090002256,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85928, 53.72621],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07081985274876246,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85251, 53.71648],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9729806341507319,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01137, 53.74119],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07852338872779763,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78029, 53.70165],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6224768466443875,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77714, 53.71944],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8089817916317912,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77714, 53.71944],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.20693737192213546,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77639, 53.72463],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.27499015847826147,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78746, 53.69253],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7703428213689416,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78497, 53.69619],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22830053965510544,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78551, 53.69492],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.17381477463252581,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78551, 53.69492],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3712353213948938,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.76697, 53.69618],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7126414779344463,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.76697, 53.69618],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3389554008742015,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87492, 53.72171],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8500617199620921,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85926, 53.71933],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7922920713300245,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86115, 53.71908],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9977050352666061,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85761, 53.72165],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7012427850205105,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88195, 53.66385],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6102752266564166,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88362, 53.71566],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7591363060512832,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88621, 53.7231],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7020613156379307,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.02099, 53.74908],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3334886190362656,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.008, 53.70567],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9730989740264127,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01242, 53.74278],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8051087636937346,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88445, 53.74022],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3777700865717655,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88445, 53.74022],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.49861895658220323,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87353, 53.73921],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.34178018851916736,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86253, 53.72305],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9888763316090288,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84781, 53.70471],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8533185256196547,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10275, 53.6955],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.343624229524522,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97987, 53.7321],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.009026492012779164,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77583, 53.70144],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9765702117358765,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86631, 53.71951],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4448843343056357,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81078, 53.75595],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8444793848645822,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.16354594210637985,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01203, 53.74578],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3187875912682625,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88676, 53.7189],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.12152747671743036,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88148, 53.72316],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.21935392119567254,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.99222, 53.6959],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2388258173489679,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85636, 53.72122],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8684541997339956,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86834, 53.71928],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.45086547838475366,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86262, 53.72976],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.29609894582100216,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0132, 53.74252],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9509255955085005,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85636, 53.72122],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2306081679164791,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94367, 53.71695],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9960468056642269,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86911, 53.68819],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9256555375027136,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.99222, 53.6959],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6764657307190614,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85819, 53.72161],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.654555153168006,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98183, 53.73068],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1914942742719432,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01386, 53.74602],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.0194133142119175,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01386, 53.74602],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6791184835711348,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.05282807679933055,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87353, 53.73921],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8519001180151755,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85749, 53.72196],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.26650082179709034,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.30219590135952057,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83963, 53.68933],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.723457567889763,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7598088489892123,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98981, 53.71955],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.611619293282289,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83692, 53.68478],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7215508583311645,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81373, 53.75452],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.01951847443561716,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79777, 53.68457],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11416640206641016,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.93856, 53.73002],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.41994713987812515,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86631, 53.71951],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3462306466757361,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0089, 53.74368],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9960827370805141,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84468, 53.68604],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4513354999010384,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.05466, 53.72095],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.13669034729004736,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89631, 53.6775],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.864904003427764,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87917, 53.71542],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6303687471099997,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83519, 53.68286],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7345715256341692,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.93935, 53.7124],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6123309104965522,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85879, 53.70873],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6773761032414649,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01597, 53.74167],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.27529368058960824,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8803, 53.77656],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22962716321572318,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86098, 53.71289],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07871137517409066,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8748, 53.73802],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.13188025680520354,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85636, 53.72122],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.38864505222906565,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86753, 53.72419],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.15921617704939428,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8877, 53.76714],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2770993187979134,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83963, 53.68933],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07729036311727322,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86269, 53.70279],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.26034650907923296,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86269, 53.70279],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3608296624563676,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01203, 53.74578],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5044644635905438,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86894, 53.73936],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5360813585789819,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88012, 53.72007],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6674779961991473,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85749, 53.72196],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8902610117940164,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85749, 53.72196],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9101022806775616,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85749, 53.72196],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.49879774537914856,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77124, 53.72281],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6037305319479014,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98225, 53.73102],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.05549405114661998,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98004, 53.73675],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6551134887234282,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97378, 53.73086],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2740088876567779,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.12248, 53.72714],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.20447253655986208,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.12248, 53.72714],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5986626320234276,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81078, 53.75595],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.29256224016674404,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91152, 53.70678],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4446164112568165,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.13873, 53.73219],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.016385363250134954,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88146, 53.7257],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22786917671414209,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8626, 53.72018],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.491808542235868,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.82997, 53.7399],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5215031978177904,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01094, 53.74403],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9231403200611303,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.80467, 53.71481],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.40817585174405835,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87705, 53.72466],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.718453022332463,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88904, 53.74798],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3402807922053257,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.93807, 53.71317],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.057903469326236134,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94726, 53.66948],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.04091236387293118,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83229, 53.74501],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9337995153343477,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88418, 53.71746],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4624647652897642,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8748, 53.73802],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22541480292544747,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89495, 53.72278],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9087409288645438,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81466, 53.754],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1783029914559533,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83748, 53.6852],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.33510737873804297,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22096927098237185,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86655, 53.71977],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11500981940995558,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79773, 53.70804],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4741875885883531,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79773, 53.70804],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.572910786146835,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84176, 53.67321],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5809049595025635,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86115, 53.71908],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9537351694443821,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87341, 53.75466],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4176534409506729,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78063, 53.70214],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8291700688889889,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.20426749917432163,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.522409192520465,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.796, 53.70298],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8060097786200238,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.7882, 53.72626],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.04090094172898118,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7256922583225465,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88775, 53.71747],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.689446645481288,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87339, 53.69987],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8309451298569615,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8875, 53.72801],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9018322144192048,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8880676432188539,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86661, 53.72012],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7955101582649045,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79047, 53.73891],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4238280941216914,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89631, 53.6775],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.058025075166270534,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.95756, 53.70584],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09010483955715398,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85984, 53.72206],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6705510464056277,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77269, 53.70115],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5012413768763935,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87682, 53.72086],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1776919539952384,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87682, 53.72086],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7809981204909877,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85926, 53.71933],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2349565203811983,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01553, 53.74171],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.835076005039129,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85686, 53.71913],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09428150930215984,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85508, 53.72238],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3090163861149853,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.00962, 53.74577],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7964066163072374,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10275, 53.6955],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.930625198923916,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88093, 53.71678],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9823215646149397,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88169, 53.71981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.06173823912894716,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09601, 53.7163],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6260877136553737,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88775, 53.71747],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2252652240136075,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.95049, 53.72609],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2622259127697486,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01203, 53.74578],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.37208288119875355,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86513, 53.72054],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.46719488862266423,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.7814, 53.70095],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5805980638471135,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6807235589791276,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86631, 53.71951],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7464779565526107,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8633, 53.71979],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6046736787915326,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2841468127704283,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11314144941939919,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97568, 53.73022],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9407389806803665,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83932, 53.68758],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.17980658969492747,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83932, 53.68758],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5453284119448005,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.15242, 53.73343],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.12153790036396273,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85739, 53.68588],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6166865392364225,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01225, 53.74213],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.21418736916887138,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09601, 53.7163],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.06835799884909122,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86221, 53.7246],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.878591298238752,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88169, 53.71981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.0039324544126604355,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85998, 53.72102],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6036040940782172,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85998, 53.72102],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.00043899020040139014,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81547, 53.74203],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.21701287200279507,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81547, 53.74203],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3790422461077918,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86401, 53.73109],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8729858623914788,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86262, 53.72976],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6583791864078576,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81488, 53.72553],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6036424306256303,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81488, 53.72553],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9870518590692712,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86932, 53.72339],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.26224458062699507,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2723187043781028,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94544, 53.7197],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11580088228386676,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.82704, 53.73413],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7127947175603067,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87035, 53.72926],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8085426980369934,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87035, 53.72926],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8077936689489289,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87035, 53.72926],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4409784146851614,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81138, 53.72574],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1931177568513629,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85273, 53.70196],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8012204963580463,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83917, 53.6778],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3123822968047827,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83917, 53.6778],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.022047358663620065,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83917, 53.6778],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.929008566694473,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83917, 53.6778],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8329428252641593,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83917, 53.6778],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8184038483884135,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83917, 53.6778],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3715382017469251,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8668958352645804,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5108423231706394,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5406982423529616,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.028666361625829362,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4584254014829534,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.934617610505962,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85916, 53.72205],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7660591242828754,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87665, 53.74066],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8759648813238023,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8288, 53.73797],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9570207998375433,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8288, 53.73797],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.729515249415362,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86165, 53.70614],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.961075025424666,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87506, 53.70091],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8193748942673151,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86932, 53.72339],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.04885625157866036,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88039, 53.72318],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.39533858180996617,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88286, 53.72251],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.24908870345285217,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89806, 53.72309],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6208878640902014,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89806, 53.72309],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.729695695045173,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89038, 53.72258],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.612784174784768,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89038, 53.72258],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.474780938703669,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86798, 53.73802],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.91370712776655,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89843, 53.7268],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5896035281760887,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.96075, 53.73023],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4112497528686794,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94449, 53.72272],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2549148746395644,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94162, 53.72528],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8381225775991765,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86628, 53.71134],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8033357578102147,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4775246583735844,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9185952075114916,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8078, 53.71853],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.041962158598628285,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86221, 53.7246],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.27001580823353466,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88253, 53.71537],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5219329617047572,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88757, 53.71671],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.859322796477693,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87772, 53.71411],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4806170287128484,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94367, 53.71695],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7189205368372928,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94367, 53.71695],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3488571884777405,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94367, 53.71695],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.959722351171117,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87076, 53.72116],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.32733574996132897,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88283, 53.74337],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4551671585200612,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8791, 53.7161],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.25449771132308774,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8791, 53.7161],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.15998956864798086,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8791, 53.7161],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6737895248361594,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8791, 53.7161],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07078767250887497,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8379, 53.68593],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6453942776821882,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8379, 53.68593],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.43547570902799837,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8379, 53.68593],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.401201502389007,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83633, 53.6845],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3177507641539785,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6205333249491933,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6967727531816845,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.08309252864039718,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9544932480401249,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.12434894142749275,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86785, 53.71881],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4829009224738996,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86358, 53.73624],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.08730384446098172,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85248, 53.72913],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9902250916382778,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89038, 53.72258],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8051574712870924,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88286, 53.72251],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9237375114047226,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84757, 53.70421],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8369864015649109,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87076, 53.72116],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9259588796384539,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87076, 53.72116],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4777345693706563,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87076, 53.72116],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1651661961995825,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8728, 53.72455],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.43086202859178324,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88969, 53.65568],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7088869952127248,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84231, 53.71594],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.595756357135169,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86798, 53.72287],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.30325804383951427,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86481, 53.72113],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8458100843270326,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86481, 53.72113],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5921521632820668,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86598, 53.73637],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3211655524864414,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85567, 53.72792],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4663093298241743,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88141, 53.71527],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9283241538237041,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88162, 53.71492],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.566559377736674,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88141, 53.71527],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3286427700682353,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88162, 53.71492],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6087958673840197,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88162, 53.71492],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5193337247750238,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83826, 53.68401],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5392088048201744,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83826, 53.68401],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6585616830024144,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83234, 53.68588],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.18297710135185108,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87306, 53.71478],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4558636836491605,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86094, 53.72322],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9279563810946074,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86094, 53.72322],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22557509138235132,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87809, 53.72514],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.37276632983889924,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87946, 53.72489],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.26442734136125545,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9032539141023488,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.845, 53.68887],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9713966265844178,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84368, 53.68787],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8953009622708457,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7289550024977547,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.711120214468187,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85636, 53.72122],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.565140923574527,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84468, 53.68604],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1850279226291931,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84468, 53.68604],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2633026761090338,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84468, 53.68604],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6518120949434336,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88414, 53.74384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3269550360850133,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85937, 53.7224],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.30018099845660995,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7366441915500486,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.25864207346219636,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5811952656772108,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90285, 53.74714],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5798099077018819,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86556, 53.72154],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.917722468430807,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88065, 53.72072],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4468995484145726,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89072, 53.71936],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.005396783323707188,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89072, 53.71936],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4928402839011048,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88994, 53.71975],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6359540131480717,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87684, 53.72214],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7377984129593158,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.92553, 53.70576],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.15493016909982593,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.93966, 53.73211],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.20623704155460287,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85567, 53.72792],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9975724615005401,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81142, 53.72494],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9461641959026166,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86278, 53.72242],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.34574196455559525,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86885, 53.73545],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6149204843421405,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.80731, 53.75258],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.42147354616408506,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86262, 53.72976],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.21944061540738713,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86262, 53.72976],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8947561083206075,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86635, 53.72101],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2880972151780026,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86635, 53.72101],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6218929924299401,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84101, 53.74087],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9707526993714621,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81828, 53.72671],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6452897279167924,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6556025903975151,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8827, 53.72499],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.028310607168388735,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.81138, 53.72574],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5078254575837797,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84722, 53.72902],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7231683027722973,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84722, 53.72902],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2194825281139008,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.84722, 53.72902],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.13498683485865404,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86278, 53.72242],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9687466694565201,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88039, 53.72318],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2172177969653255,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88039, 53.72318],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2798364985061619,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87027, 53.72056],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7645466196821169,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86046, 53.72621],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.40498080955679705,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89426, 53.72677],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.10830327723748834,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89206, 53.72596],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9702844985245929,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89046, 53.72587],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4775398284011365,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87137, 53.72417],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6363447864564515,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87137, 53.72417],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7108438272647923,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86532, 53.73456],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.28506543742585877,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86532, 53.73456],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6640502487016358,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85589, 53.72045],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9988871203777552,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86397, 53.72824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.029994425747675413,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.0026348338496318124,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.35879470498254085,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.17571618869658634,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6600053286880057,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87357, 53.7526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9938109662207095,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83354, 53.6832],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.26560518827249235,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83354, 53.6832],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7411020027936872,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83354, 53.6832],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4833475590908969,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83638, 53.68635],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.23948340608771512,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86269, 53.70279],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.39551036808433615,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86269, 53.70279],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.16104964218768458,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.80871, 53.76299],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.38748310590013824,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0132, 53.74164],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7593174213855962,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0132, 53.74164],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7138720471838795,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0132, 53.74164],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.825672053315518,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.02833, 53.7525],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3852925642152043,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97264, 53.73053],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3635789727143224,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01203, 53.74578],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8084489518768876,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01203, 53.74578],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09000705401276465,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.76697, 53.69618],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22862711450473538,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.93823, 53.70531],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6671648102344139,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91296, 53.71069],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.17968927573811855,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91342, 53.71231],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.39022195678240856,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09642, 53.71662],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.010275127765962955,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0966, 53.71654],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2899744312095276,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.08671, 53.68075],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.781580836943194,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.098, 53.71316],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9430892520623069,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.098, 53.71316],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.33670947749890945,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89789, 53.71049],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2750967055537539,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.83238, 53.73857],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.06301950209226792,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.06713, 53.74423],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.21049264225622388,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97754, 53.72938],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8423322010488321,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97754, 53.72938],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.40972731285263286,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01263, 53.74382],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2879407749707763,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01263, 53.74382],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.10614397323131586,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01263, 53.74382],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8552846581443174,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1608017564168056,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.20225103514025844,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.48312417876024916,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3224729288302195,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.41747986792709213,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7296948044275275,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.28927690334532574,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.23016145842841773,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89992, 53.70919],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.41788673400895493,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01422, 53.74107],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.0446849954689954,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.00364, 53.70824],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5071106971567176,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87353, 53.73921],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.16869306414568985,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8748, 53.73802],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22086234962088303,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87379, 53.73603],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.873021083844085,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8786, 53.7432],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6700686166814749,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86785, 53.71881],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3057843023939728,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.14383777354804672,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.10030048243179701,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.1042, 53.70695],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7650381510702566,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10041, 53.6879],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8693812007659505,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10263, 53.70981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2965092123833828,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10263, 53.70981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6573654108527833,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91387, 53.7052],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5387487781514828,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91423, 53.70666],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5863926332938687,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88093, 53.71678],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8872400964503775,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88093, 53.71678],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6361711128620569,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88169, 53.71981],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.051472458434000945,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88146, 53.7257],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.12582729241787582,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85819, 53.72145],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2710472351799693,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85819, 53.72145],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.03803217485910326,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85819, 53.72145],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8429292630569627,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87991, 53.72414],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.12296932510097824,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87991, 53.72414],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4530865980653018,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98654, 53.73251],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9651547414626132,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98183, 53.73068],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3377762613740911,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0054, 53.76331],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5481558985761561,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88287, 53.65321],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7733512179794937,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.72888, 53.68311],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3180206245483497,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.72888, 53.68311],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7641099343460533,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90854, 53.71282],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7808724682643857,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.14252949358412192,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9269449526494251,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91449, 53.70588],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11437140491908249,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91449, 53.70588],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8024168081092131,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.33915103720820405,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.369943445400275,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10035, 53.71226],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5895718520599169,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09682, 53.7138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9348015285144384,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.06209, 53.71916],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4464141138364808,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.06209, 53.71916],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.47831876433325693,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.06209, 53.71916],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.06535211883230208,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09608, 53.71614],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7059825549128915,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09608, 53.71614],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.47860227853227455,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.040340855040936985,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.47834672621663854,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91505, 53.7048],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5114695026620955,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91387, 53.7052],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7653338972016521,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91033, 53.70894],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.38419507587551704,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01263, 53.74382],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9059762159882887,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01767, 53.7406],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9464872560364437,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01767, 53.7406],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.801107849388305,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01767, 53.7406],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8432161046831681,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01767, 53.7406],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7154149254212725,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01767, 53.7406],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7852725805021881,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01767, 53.7406],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5384483099136566,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94041, 53.67395],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07441673719313302,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94226, 53.67199],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.42399403680346337,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.92645, 53.69991],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9976335210598117,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.92645, 53.69991],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5277204091448,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.92645, 53.69991],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.28208646181697095,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.92645, 53.69991],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3395300506457417,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88159, 53.72476],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4114053363342012,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8505, 53.70715],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7809951388364649,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8505, 53.70715],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.26086066775837624,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.92139, 53.71927],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8315540806918564,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85984, 53.72206],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3861903311468222,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86001, 53.72121],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.283020282744739,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89019, 53.72525],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.11952497692194797,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88655, 53.72965],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.967459430258869,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89054, 53.72403],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6358382980885018,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.97342, 53.72961],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8761803788271962,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09528, 53.71702],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1479013091205379,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09777, 53.71293],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.052427496095264425,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09777, 53.71293],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6749626469228991,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09677, 53.71687],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2819091916034344,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09784, 53.71408],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9177055442442261,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09784, 53.71408],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8607756417401571,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90574, 53.70979],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7739693082269259,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87317, 53.72508],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.318819934239555,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88846, 53.7374],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1080493801256679,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01198, 53.74225],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9603566479892529,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.99218, 53.7326],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7721496011776998,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.98654, 53.73251],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.22776259623532624,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90283, 53.71024],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8872277650417792,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88401, 53.7178],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.49568869157769613,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87047, 53.72538],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.04989400266848221,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86436, 53.72417],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3325587195683024,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.87807, 53.72795],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5809906496184147,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10895, 53.70431],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8842755095991477,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09924, 53.71869],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2652064283379303,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.19975299954812864,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6676459685761296,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3304397481377743,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.060321411100983324,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.028997783433794,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09666, 53.71398],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3162348528311254,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10061, 53.68877],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9378514390865695,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.91038, 53.70634],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4847219524543136,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.95481, 53.66988],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5038067823256049,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86266, 53.6757],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.473354243125355,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86513, 53.72054],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3147614899683011,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.8553, 53.68828],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4919715364981607,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86911, 53.68819],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.12882595955077125,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86835, 53.69968],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4040949719064171,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78729, 53.72395],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.39901937478262606,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85508, 53.72238],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.3181670030395065,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86401, 53.7246],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5886645226898981,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86401, 53.7246],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.10873495819647916,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86924, 53.72074],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7875303453068982,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77639, 53.72463],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8068630364735996,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77639, 53.72463],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6447431953864342,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77714, 53.71944],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.08498519610317112,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78524, 53.69782],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.2605759802279324,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78524, 53.69782],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07859361991325153,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78765, 53.69591],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.10024697244065361,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78728, 53.705],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.256519090404711,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78807, 53.71496],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8170538528989646,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.11995, 53.72629],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4973417177588384,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.11813, 53.72591],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1734905892150258,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10712, 53.70164],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6781361324616229,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09642, 53.71662],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9831286979432894,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10168, 53.71191],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.26462759444614026,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10168, 53.71191],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8469916446498456,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85998, 53.72102],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7720843063531633,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.016, 53.74122],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9847320712241745,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.016, 53.74122],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.36013379351846186,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01698, 53.74138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9729589627672037,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01698, 53.74138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.09572840892073042,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01698, 53.74138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9012586194199668,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.01664, 53.74183],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4811624648800006,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.95113, 53.69971],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9017479519334517,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.89746, 53.71194],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6391269520951606,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.94902, 53.66526],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.19527114932185574,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77877, 53.70862],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.05489643715326453,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78301, 53.70037],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5910705887477605,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78301, 53.70037],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5290630362670614,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78301, 53.70037],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5002873214960759,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78301, 53.70037],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9723539561983834,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78231, 53.70098],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.37184165153498494,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.74481, 53.69345],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.15274088651074602,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10793, 53.70423],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8937487335846457,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.05537, 53.72499],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7096071108925592,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09635, 53.71384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9812285897362139,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09708, 53.71352],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7414495456285883,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09635, 53.71384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.14204428651907852,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09635, 53.71384],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8318284345384972,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09553, 53.71368],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6819542760704966,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09553, 53.71368],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.14963538817848998,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.08987, 53.71451],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.20209944553290815,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09874, 53.71291],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9267277746870695,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.86911, 53.68819],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5414563650685194,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.80884, 53.72593],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.07317426488574497,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.85505, 53.68655],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.17377039163247465,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90514, 53.71956],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6472273218230014,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88466, 53.71138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.8884875642922809,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88466, 53.71138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.6088829754190461,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.88466, 53.71138],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.1073851582351446,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77422, 53.70213],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7230529119283082,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.77422, 53.70213],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9107186603666382,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.78254, 53.70306],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.006231862049209003,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.79134, 53.69084],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.837984575663681,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.10448, 53.70581],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.4118077214208722,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09476, 53.72077],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5751993007419112,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.09744, 53.71297],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.9979454310223512,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-2.0966, 53.71654],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.5163962164401465,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.99222, 53.6959],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.7868030257055538,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.99222, 53.6959],
      },
    },
    {
      type: 'Feature',
      properties: {
        heatmap: {
          intensity: 0.0715031357359448,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [-1.90395, 53.70972],
      },
    },
  ],
};
