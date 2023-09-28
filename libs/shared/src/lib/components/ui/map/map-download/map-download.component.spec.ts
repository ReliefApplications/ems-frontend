import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDownloadComponent } from './map-download.component';

describe('MapDownloadComponent', () => {
  let component: MapDownloadComponent;
  let fixture: ComponentFixture<MapDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapDownloadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
