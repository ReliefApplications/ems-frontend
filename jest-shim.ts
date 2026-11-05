import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

// jsdom does not implement object URLs, but esri-leaflet-vector needs them at import time
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = window.URL.createObjectURL || (() => '');
  window.URL.revokeObjectURL = window.URL.revokeObjectURL || (() => undefined);

  // jsdom does not implement matchMedia, but tinymce needs it at import time
  window.matchMedia =
    window.matchMedia ||
    ((query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      } as MediaQueryList));
}
