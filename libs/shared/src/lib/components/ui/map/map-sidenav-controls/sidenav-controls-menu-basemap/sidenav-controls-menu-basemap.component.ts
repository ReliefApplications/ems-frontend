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
  /** Basemap */
  @Input() basemap!: L.Control.Layers.TreeObject;
  /** Map component */
  @Input() mapComponent!: MapComponent;
  /** Map level */
  @Input() level = 0;
  /** Map */
  map!: L.Map;
  /** Whether the item is expanded or not */
  expanded = false;
  /** Whether the item is checked or not */
  checked = false;

  /** Event emitter for change of checkbox */
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
