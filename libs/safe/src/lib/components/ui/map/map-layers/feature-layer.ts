import * as L from 'leaflet';
import { Feature, Geometry } from 'geojson';
import { featureSatisfiesFilter } from '../layer';
import { SafeIconDisplayPipe } from '../../../../pipes/icon-display/icon-display.pipe';

/**
 * layer style, in progress
 */
interface LayerStyle {
  style: string;
  symbol: { color: string; icon: string };
}

/**
 * default style for the layers
 */
export const DEFAULT_LAYER_STYLE = {
  style: '',
  symbol: { color: 'black', icon: 'location-dot' },
};

/**
 * Custom class for heatmap layers
 */
export class FeatureLayer extends L.Layer {
  private data;
  private labelField;
  private styling;
  private pipe;
  private fontFamily;

  /**
   * Custom class for heatmap layers
   *
   * @param data Data for the features layer
   * @param labelField label field
   * @param styling styling
   */
  constructor(data: any, labelField: string, styling: any) {
    super();
    this.data = data;
    this.labelField = labelField;
    this.styling = styling;
    this.pipe = new SafeIconDisplayPipe();
    this.fontFamily = 'fa';
  }

  /**
   * Custom legend for the feature layers
   *
   * @returns empty legend
   */
  get legend() {
    const items: {
      label: string;
      color: string;
      icon?: string;
    }[] = [];

    let legend = 'FEATURE LAYER';
    const features =
      this.data.type === 'FeatureCollection' ? this.data.features : [this.data];
    console.log('entering', legend);
    try {
      features.forEach((feature: any) => {
        if ('properties' in feature) {
          // check if feature is a point
          // @TODO structure sent from backend follows the feature.type structure
          const isPoint = feature.geometry?.type
            ? feature.geometry.type === 'Point'
            : (feature as any).type === 'Point';
          const style = this.getFeatureStyle(feature);
          items.push({
            label: this.labelField
              ? feature.properties?.[this.labelField] ?? ''
              : '',
            color: style.symbol.color,
            icon: isPoint ? style.symbol.icon : undefined,
          });
          legend =
            legend +
            `<li class="flex items-center">
        <i style="color: ${style.symbol.color};" class="${this.pipe.transform(
              style.symbol.icon,
              this.fontFamily
            )}"></i></li>
        `;
        }
      });
    } catch (error) {
      console.error(error);
    }
    console.log('legend', legend);
    return legend;
  }

  /**
   * Gets the style for a feature
   * If no style is found, returns the default style
   *
   * @param feature Feature to get the style for
   * @returns the style for the feature
   */
  private getFeatureStyle(feature: Feature<Geometry>): Required<LayerStyle> {
    // if the feature has a style property, use it
    const featureStyle = feature.properties?.style;
    if (featureStyle) return { ...DEFAULT_LAYER_STYLE, ...featureStyle };

    const style = this.styling?.find(
      (s: any) => featureSatisfiesFilter(feature, s.filter) && s.style
    );

    // If no style is found, return the default style
    return style?.style
      ? { ...DEFAULT_LAYER_STYLE, ...style?.style }
      : DEFAULT_LAYER_STYLE;
  }
}
