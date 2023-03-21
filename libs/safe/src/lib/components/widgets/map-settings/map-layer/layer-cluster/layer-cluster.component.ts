import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FA_ICONS } from '../../../../ui/map/const/fa-icons';
import { createClusterForm } from '../../map-forms';
import { MapSettingsService } from '../../map-settings.service';

/** Layer cluster settings */
@Component({
  selector: 'safe-layer-cluster',
  templateUrl: './layer-cluster.component.html',
  styleUrls: ['./layer-cluster.component.scss'],
})
export class LayerClusterComponent implements OnInit {
  public form: UntypedFormGroup;
  public expansivePanels = ['fields', 'label', 'popups'];
  public iconList = [...FA_ICONS];

  /**
   * Creates an instance of LayerClusterComponent.
   *
   * @param mapSettingsService MapSettingsService
   */
  constructor(private mapSettingsService: MapSettingsService) {
    this.form = createClusterForm();
  }
  ngOnInit(): void {
    this.mapSettingsService.mapSettingsCurrentTabTitle.next(
      'components.widget.settings.map.edit.cluster.clusterSettings'
    );
  }
}
