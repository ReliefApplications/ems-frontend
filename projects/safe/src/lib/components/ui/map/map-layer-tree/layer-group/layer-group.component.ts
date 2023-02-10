import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerComponent } from '../layer/layer.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

@Component({
  selector: 'safe-layer-group',
  standalone: true,
  imports: [CommonModule, LayerComponent, MatCheckboxModule],
  templateUrl: './layer-group.component.html',
  styleUrls: ['./layer-group.component.scss'],
})
export class LayerGroupComponent {
  @Input() layer: any;

  get indeterminate(): boolean {
    return this.layer.children.filter((child: any) => !child.visible);
  }
}
