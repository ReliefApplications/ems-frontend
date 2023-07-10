require('./FeatureLayerHook');
const { Renderer } = require('./Renderers/Renderer');
const {
  SimpleRenderer,
  simpleRenderer,
} = require('./Renderers/SimpleRenderer');
const {
  ClassBreaksRenderer,
  classBreaksRenderer,
} = require('./Renderers/ClassBreaksRenderer');
const {
  UniqueValueRenderer,
  uniqueValueRenderer,
} = require('./Renderers/UniqueValueRenderer');

const { Symbol } = require('./Symbols/Symbol');
const { PointSymbol, pointSymbol } = require('./Symbols/PointSymbol');
const { LineSymbol, lineSymbol } = require('./Symbols/LineSymbol');
const { PolygonSymbol, polygonSymbol } = require('./Symbols/PolygonSymbol');

module.exports = {
  Renderer,
  SimpleRenderer,
  simpleRenderer,
  ClassBreaksRenderer,
  classBreaksRenderer,
  UniqueValueRenderer,
  uniqueValueRenderer,
  Symbol,
  PointSymbol,
  pointSymbol,
  LineSymbol,
  lineSymbol,
  PolygonSymbol,
  polygonSymbol,
};
