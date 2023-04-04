import { Component, OnInit } from '@angular/core';
import { SafeMapLayersService } from '../../../../../services/map/map-layers.service';

/**
 * Fields interface
 */
export interface Fields {
  label: string;
  name: string;
  type: string;
  [key: string]: string;
}
/**
 * Map layer fields settings component.
 */
@Component({
  selector: 'safe-layer-fields',
  templateUrl: './layer-fields.component.html',
  styleUrls: ['./layer-fields.component.scss'],
})
export class LayerFieldsComponent implements OnInit {
  public fields!: Fields[];

  /**
   * Creates an instance of LayerFieldsComponent.
   *
   * @param mapLayersService Shared map layer Service.
   */
  constructor(private mapLayersService: SafeMapLayersService) {}

  ngOnInit(): void {
    // Listen to fields changes
    this.mapLayersService.fields$.subscribe((value) => {
      this.fields = value;
    });
  }

  /**
   * Save value of the input
   *
   * @param event event of the input.
   * @param index index of the field.
   */
  saveLabel(event: string, index: number): void {
    if (event && this.fields[index]) {
      this.fields[index].label = event;
    }
  }
}
