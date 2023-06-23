import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Layer Polygon renderer component
 */
@Component({
  selector: 'safe-polygon-renderer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './polygon-renderer.component.html',
  styleUrls: ['./polygon-renderer.component.scss'],
})
export class PolygonRendererComponent {
  @Input() control!: FormGroup;
}
