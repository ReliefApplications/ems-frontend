export type DataSourceEvent = 'layout' | 'aggregation' | 'refData';

/**
 * Event sent to build the parameters used for gis/feature API call
 */
export interface DataSourceChangeEvent {
  type: DataSourceEvent;
  id: string;
  origin: 'resource' | 'reference';
  geoField: any;
  latitudeField: any;
  longitudeField: any;
}
