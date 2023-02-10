import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLayerTreeComponent } from './map-layer-tree.component';

describe('MapLayerTreeComponent', () => {
  let component: MapLayerTreeComponent;
  let fixture: ComponentFixture<MapLayerTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MapLayerTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapLayerTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
