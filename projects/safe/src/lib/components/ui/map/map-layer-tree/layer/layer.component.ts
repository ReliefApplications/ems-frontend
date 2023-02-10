import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

@Component({
  selector: 'safe-layer',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule],
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss'],
})
export class LayerComponent {
  @Input() layer: any;
}
