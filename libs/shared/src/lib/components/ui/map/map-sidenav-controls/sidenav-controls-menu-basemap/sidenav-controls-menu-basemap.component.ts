import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapComponent } from '../../map.component';
import { CommonModule } from '@angular/common';
import { ButtonModule, RadioModule } from '@oort-front/ui';

/**
 * basemap item
 */
@Component({
  selector: 'shared-sidenav-controls-menu-basemap',
  templateUrl: './sidenav-controls-menu-basemap.component.html',
  styleUrls: ['./sidenav-controls-menu-basemap.component.scss'],
  imports: [CommonModule, RadioModule, ButtonModule],
  standalone: true,
})
export class SidenavControlsMenuBasemapComponent implements OnInit {
  @Input() basemap!: L.Control.Layers.TreeObject;
  @Input() mapComponent!: MapComponent;
  @Input() level = 0;
  map!: L.Map;
  expanded = false;
  checked = false;

  @Output() checkedChange = new EventEmitter();

  ngOnInit(): void {
    this.map = this.mapComponent.map;
    if (this.basemap.layer)
      this.checked = this.map.hasLayer(this.basemap.layer);
  }

  /**
   * updates the basemap
   */
  updateBasemap() {
    //this.mapComponent.setBasemap(this.map, this.basemap);
    this.checkedChange.emit();
  }

  /** toggles expansion for menus with children */
  toggleExpansion() {
    this.expanded = !this.expanded;
  }
}
