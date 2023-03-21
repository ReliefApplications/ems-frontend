import { Component, Input, OnInit } from '@angular/core';
import { MapSettingsService } from '../../map-settings.service';

/**
 * Fields interface
 */
interface Fields {
  label: string;
  name: string;
  type: string;
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
  // todo(gis): remove test data
  @Input() fields: Fields[] = [
    {
      label: 'test',
      name: 'test',
      type: 'test',
    },
  ];

  /**
   * Class constructor
   *
   * @param mapSettingsService MapSettingsService
   */
  constructor(private mapSettingsService: MapSettingsService) {}

  ngOnInit(): void {
    this.mapSettingsService.mapSettingsCurrentTabTitle.next(
      'components.widget.settings.map.edit.fields'
    );
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
