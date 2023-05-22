import { Component, Input, OnInit } from '@angular/core';
import { SafeArcGISService } from '../../../../../services/arc-gis.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';


/**
 * Online Layers configuration of Map Widget
 */
@Component({
  selector: 'safe-map-online-layers',
  templateUrl: './map-online-layers.component.html',
  styleUrls: ['./map-online-layers.component.scss'],
})
export class MapOnlineLayersComponent implements OnInit {
  public search = '';
  private searchChanged: Subject<string> = new Subject<string>();

  @Input() layers!: UntypedFormControl;
  public availableLayers: any[] = [];
  public tableColumns = ['title', 'actions'];

  

  /**
   * Online Layers configuration of Map Widget
   *
   * @param arcGisService Shared ArcGis service
   */
  constructor(private arcGisService: SafeArcGISService) {}

  ngOnInit(): void {
    this.arcGisService.clearSelectedLayer();
    this.arcGisService.searchLayers('');

    this.arcGisService.availableLayers$.subscribe((suggestions) => {
      this.availableLayers = suggestions;
    });

    this.arcGisService.selectedLayer$.subscribe((selectedLayer) => {
      const value = this.layers.value.concat(selectedLayer);
      this.layers.setValue(value);
    });

    this.searchChanged
      .pipe(
        debounceTime(300), // wait 300ms after the last event before emitting last event
        distinctUntilChanged()
      ) // only emit if value is different from previous value
      .subscribe((search) => {
        this.arcGisService.searchLayers(search);
      });
  }

  /**
   * Get Search layers content.
   *
   * @param search search text value
   */
  public onSearch(search: string): void {
    this.searchChanged.next(search);
  }

  /**
   * Selects a new layer.
   *
   * @param layer layer to select.
   */
  public addLayer(layer: any): void {
    this.search = '';
    this.arcGisService.searchLayers('');
    this.arcGisService.getLayer(layer.id);
  }

  /**
   * Removes a layer.
   *
   * @param id id of layer to remove
   */
  public removeLayer(id: any): void {
    const newValue = this.layers.value.filter((layer: any) => layer.id !== id);
    this.layers.setValue(newValue);
  }
}
