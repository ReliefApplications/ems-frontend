import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerComponent } from '../layer/layer.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { SafeButtonModule } from '../../../button/button.module';

@Component({
  selector: 'safe-layer-group',
  standalone: true,
  imports: [CommonModule, LayerComponent, MatCheckboxModule, SafeButtonModule],
  templateUrl: './layer-group.component.html',
  styleUrls: ['./layer-group.component.scss'],
})
export class LayerGroupComponent {
  @Input() layer: any;
  public expanded = true;

  get indeterminate(): boolean {
    return this.layer.children.filter((child: any) => !child.visible);
  }

  public toggleVisibility() {
    this.expanded = !this.expanded;
  }
}
