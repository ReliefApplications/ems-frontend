/** List of regions and their geometry */
export const REGIONS = [
  {
    name: 'EMRO',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-13.175, -1.6748],
          [77.6971, -1.6748],
          [77.6971, 39.7805],
          [-13.175, 39.7805],
          [-13.175, -1.6748],
        ],
      ],
    },
  },
  {
    name: 'AFRO',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-25.3604, -40.4038],
          [63.4987, -40.4038],
          [63.4987, 37.0915],
          [-25.3604, 37.0915],
          [-25.3604, -40.4038],
        ],
      ],
    },
  },
  {
    name: 'SEARO',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [68.1867, -10.93],
          [141.007, -10.93],
          [141.007, 43.0083],
          [68.1867, 43.0083],
          [68.1867, -10.93],
        ],
      ],
    },
  },
  {
    name: 'AMRO',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-179.142, -55.9197],
          [-29.84, -55.9197],
          [-29.84, 83.1139],
          [-179.142, 83.1139],
          [-179.142, -55.9197],
        ],
      ],
    },
  },
  {
    name: 'WPRO',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-180, -54.7539],
          [180, -54.7539],
          [180, 53.5545],
          [-180, 53.5545],
          [-180, -54.7539],
        ],
      ],
    },
  },
  {
    name: 'EURO',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-180, 27.6375],
          [180, 27.6375],
          [180, 83.6237],
          [-180, 83.6237],
          [-180, 27.6375],
        ],
      ],
    },
  },
];

export default REGIONS;
