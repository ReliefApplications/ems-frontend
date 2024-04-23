/* eslint-disable no-import-assign */

/** This file has the correct feature to add intensity to the features of the heat array */
/** Issue taken as source: https://github.com/Leaflet/Leaflet.heat/issues/74 */
import * as L from 'leaflet';
import simpleheat from 'simpleheat';
import { isNil } from 'lodash';

L.HeatLayer = (L.Layer ? L.Layer : L.Class).extend({
  initialize: function (latlngs, options) {
    this._latlngs = latlngs;
    L.setOptions(this, options);
  },

  setLatLngs: function (latlngs) {
    this._latlngs = latlngs;
    return this.redraw();
  },

  addLatLng: function (latlng) {
    this._latlngs.push(latlng);
    return this.redraw();
  },

  setOptions: function (options) {
    L.setOptions(this, options);
    if (this._heat) {
      this._updateOptions();
    }
    return this.redraw();
  },

  redraw: function () {
    if (this._heat && !this._frame && this._map && !this._map._animating) {
      this._frame = L.Util.requestAnimFrame(this._redraw, this);
    }
    return this;
  },

  onAdd: function (map) {
    this._map = map;

    if (!this._canvas) {
      this._initCanvas();
    }

    if (this.options.pane) {
      this.getPane().appendChild(this._canvas);
    } else {
      map._panes.overlayPane.appendChild(this._canvas);
    }

    map.on('moveend', this._reset, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    this._reset();
  },

  onRemove: function (map) {
    if (this.options.pane) {
      this.getPane().removeChild(this._canvas);
    } else {
      map.getPanes().overlayPane.removeChild(this._canvas);
    }

    map.off('moveend', this._reset, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  _initCanvas: function () {
    var canvas = (this._canvas = L.DomUtil.create(
      'canvas',
      'leaflet-heatmap-layer leaflet-layer'
    ));

    var originProp = L.DomUtil.testProp([
      'transformOrigin',
      'WebkitTransformOrigin',
      'msTransformOrigin',
    ]);
    canvas.style[originProp] = '50% 50%';

    var size = this._map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;

    var animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(
      canvas,
      'leaflet-zoom-' + (animated ? 'animated' : 'hide')
    );

    this._heat = simpleheat(canvas);
    this._updateOptions();
  },

  _updateOptions: function () {
    this._heat.radius(
      this.options.radius || this._heat.defaultRadius,
      this.options.blur
    );

    if (this.options.gradient) {
      this._heat.gradient(this.options.gradient);
    }
    if (!isNil(this.options.opacity)) {
      this._heat._canvas.style.opacity = this.options.opacity;
    }
  },

  _reset: function () {
    var topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);

    var size = this._map.getSize();

    if (this._heat._width !== size.x) {
      this._canvas.width = this._heat._width = size.x;
    }
    if (this._heat._height !== size.y) {
      this._canvas.height = this._heat._height = size.y;
    }

    this._redraw();
  },

  _redraw: function () {
    if (!this._map) {
      return;
    }
    var data = [],
      r = this._heat._r,
      size = this._map.getSize(),
      bounds = new L.Bounds(L.point([-r, -r]), size.add([r, r])),
      cellSize = r / 2,
      grid = [],
      panePos = this._map._getMapPanePos(),
      offsetX = panePos.x % cellSize,
      offsetY = panePos.y % cellSize,
      i,
      len,
      p,
      cell,
      x,
      y,
      j,
      len2;

    console.log('cellsize: ', cellSize);
    console.log('offset x: ', offsetX);
    console.log('offset y: ', offsetY);

    this._max = 1;

    console.log('Origin: ', this._map.getPixelOrigin());
    console.log('Pane pos: ', this._map._getMapPanePos());

    console.log(
      'Origin to latlng: ',
      this._map.containerPointToLatLng(this._map.getPixelOrigin())
    );

    console.log(
      'Origin at base zoom: ',
      this._map.project(
        this._map.containerPointToLatLng(this._map.getPixelOrigin()),
        2
      )
    );

    console.log(
      'bottom right at base zoom: ',
      this._map.project([-90, 180], 2)
    );

    console.log(
      'bottom right at current zoom: ',
      this._map.project([-90, 180])
    );

    const scaleDiff =
      this._map.getZoomScale(this._map.getZoom()) / this._map.getZoomScale(2);

    console.log('scale diff is: ', scaleDiff);

    // const pointDiff = this._map
    //   .project([0, 0])
    //   .subtract(this._map.project([0, 0], 2).subtract(panePos));
    // console.log('Diff is: ', pointDiff);

    const newCenter = this._map.latLngToContainerPoint([0, 0]);
    console.log('New center is: ', newCenter);
    const oldCenter = this._map
      .project([0, 0], 2)
      ._round()
      ._subtract(this._map.getPixelOrigin())
      .add(panePos);
    console.log('Old center is: ', oldCenter);
    const pointDiff = newCenter.subtract(oldCenter);
    console.log('Diff is: ', pointDiff);

    // console.time('process');
    for (i = 0, len = this._latlngs.length; i < len; i++) {
      p = this._map
        .project(this._latlngs[i], 2)
        ._round()
        ._subtract(this._map.getPixelOrigin())
        .add(panePos);
      // const copy = p.clone();
      // for (let i = 0; i < scaleDiff; i++) {
      //   p.add(copy);
      // }
      // if (i == 0) {
      // console.log(p);
      // console.log(p.distanceTo(this._map.latLngToContainerPoint([0, 0])));
      // console.log(this._map.latLngToContainerPoint(this._latlngs[i]));
      // }
      // console.log(p);
      // console.log(this._map.project(this._latlngs[i], 2));
      x = Math.floor((p.x - offsetX) / cellSize) + 2 + pointDiff.x;
      y = Math.floor((p.y - offsetY) / cellSize) + 2 + pointDiff.y;

      var alt =
        this._latlngs[i].alt !== undefined
          ? this._latlngs[i].alt
          : this._latlngs[i][2] !== undefined
          ? +this._latlngs[i][2]
          : 1;

      grid[y] = grid[y] || [];
      cell = grid[y][x];

      p = p.add(pointDiff);

      if (!cell) {
        cell = grid[y][x] = [p.x, p.y, alt];
        cell.p = p;
      } else {
        cell[0] = (cell[0] * cell[2] + p.x * alt) / (cell[2] + alt); // x
        cell[1] = (cell[1] * cell[2] + p.y * alt) / (cell[2] + alt); // y
        cell[2] += alt; // cumulated intensity value
      }

      // Set the max for the current zoom level
      if (cell[2] > this._max) {
        this._max = cell[2];
      }
    }

    this._heat.max(this._max);

    for (i = 0, len = grid.length; i < len; i++) {
      if (grid[i]) {
        for (j = 0, len2 = grid[i].length; j < len2; j++) {
          cell = grid[i][j];
          if (cell) {
            data.push([
              Math.round(cell[0]),
              Math.round(cell[1]),
              Math.min(cell[2], this._max),
            ]);
          }
          // if (cell && bounds.contains(cell.p)) {
          //   data.push([
          //     Math.round(cell[0]),
          //     Math.round(cell[1]),
          //     Math.min(cell[2], this._max),
          //   ]);
          // }
        }
      }
    }
    // console.timeEnd('process');

    // console.time('draw ' + data.length);
    this._heat.data(data).draw(this.options.minOpacity);
    // console.timeEnd('draw ' + data.length);

    this._frame = null;
    console.log('=== end draw, should transform ===');
    // this._canvas.style.transform =
    //   this._canvas.style.transform + ` scale(${scaleDiff})`;
  },

  _animateZoom: function (e) {
    var scale = this._map.getZoomScale(e.zoom),
      offset = this._map
        ._getCenterOffset(e.center)
        ._multiplyBy(-scale)
        .subtract(this._map._getMapPanePos());

    if (L.DomUtil.setTransform) {
      L.DomUtil.setTransform(this._canvas, offset, scale);
    } else {
      this._canvas.style[L.DomUtil.TRANSFORM] =
        L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
    }
  },
});

L.heatLayer = function (latlngs, options) {
  return new L.HeatLayer(latlngs, options);
};
