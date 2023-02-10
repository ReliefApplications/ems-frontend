import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerGroupComponent } from './layer-group/layer-group.component';
import { LayerComponent } from './layer/layer.component';
import { SafeIconModule } from '../../icon/icon.module';

@Component({
  selector: 'safe-map-layer-tree',
  standalone: true,
  imports: [CommonModule, LayerGroupComponent, LayerComponent, SafeIconModule],
  templateUrl: './map-layer-tree.component.html',
  styleUrls: ['./map-layer-tree.component.scss'],
})
export class MapLayerTreeComponent {
  @Input() layers: any[] = [];
  public expanded = true;

  public toggleVisibility() {
    this.expanded = !this.expanded;
  }
}
