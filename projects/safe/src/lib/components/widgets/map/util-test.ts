const latBounds = [-90, 90];
const lngBounds = [-180, 180];

export const generateGeoJSONPoints = (featuresCount: number = 100) => {
  const features = [];
  for (let i = 0; i < featuresCount; i++) {
    const lat =
      Math.random() * (latBounds[1] - latBounds[0] + 1) + latBounds[0];
    const lng =
      Math.random() * (lngBounds[1] - lngBounds[0] + 1) + lngBounds[0];
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lat, lng],
      },
      properties: {
        title: 'point_' + i,
        'marker-symbol': 'harbor',
        weight: 1, // for heatmap -> if there is no other field, that should just be one
      },
    });
  }
  return {
    type: 'FeatureCollection',
    features,
  };
};

export const geoJSONHeatMap = {
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
  ],
};
