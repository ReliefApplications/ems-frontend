import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { Feature, Point } from 'geojson';
import { of } from 'rxjs';

jest.mock('../../components/ui/map/layer', () => ({
  EMPTY_FEATURE_COLLECTION: { type: 'FeatureCollection', features: [] },
  Layer: class {},
}));

import { AggregationService } from '../aggregation/aggregation.service';
import { ContextService } from '../context/context.service';
import { ReferenceDataService } from '../reference-data/reference-data.service';
import { RestService } from '../rest/rest.service';
import { WidgetService } from '../widget/widget.service';
import { AggregationBuilderService } from '../aggregation-builder/aggregation-builder.service';
import { QueryBuilderService } from '../query-builder/query-builder.service';
import { MapPolygonsService } from './map-polygons.service';
import { MapLayersService } from './map-layers.service';

describe('MapLayersService', () => {
  let service: MapLayersService;
  let restService: { apiUrl: string; post: jest.Mock };

  beforeEach(() => {
    restService = { apiUrl: '/api', post: jest.fn() };
    TestBed.configureTestingModule({
      providers: [
        MapLayersService,
        { provide: Apollo, useValue: {} },
        { provide: RestService, useValue: restService },
        { provide: QueryBuilderService, useValue: {} },
        { provide: AggregationBuilderService, useValue: {} },
        { provide: ContextService, useValue: {} },
        { provide: MapPolygonsService, useValue: {} },
        { provide: WidgetService, useValue: {} },
        { provide: ReferenceDataService, useValue: {} },
        { provide: AggregationService, useValue: {} },
        { provide: DOCUMENT, useValue: document },
      ],
    });
    service = TestBed.inject(MapLayersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads complete properties for compact popup features', async () => {
    const compactFeature: Feature<Point> = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [1, 2] },
      properties: {
        __oortPopup: { cacheKey: 'gis:popup:key', featureIndex: 3 },
      },
    };
    const completeFeature: Feature<Point> = {
      ...compactFeature,
      properties: { name: 'Popup data' },
    };
    restService.post.mockReturnValue(of({ features: [completeFeature] }));

    await expect(service.loadPopupData([compactFeature])).resolves.toEqual([
      completeFeature,
    ]);
    expect(restService.post).toHaveBeenCalledWith('/api/gis/feature/popup', {
      cacheKey: 'gis:popup:key',
      featureIndexes: [3],
    });
  });

  it('keeps compact features when no popup-cache reference exists', async () => {
    const feature: Feature<Point> = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [1, 2] },
      properties: {},
    };

    await expect(service.loadPopupData([feature])).resolves.toEqual([feature]);
    expect(restService.post).not.toHaveBeenCalled();
  });
});
