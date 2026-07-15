import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

// jsdom does not implement object URLs, but esri-leaflet-vector needs them at import time
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = window.URL.createObjectURL || (() => '');
  window.URL.revokeObjectURL = window.URL.revokeObjectURL || (() => undefined);
}
