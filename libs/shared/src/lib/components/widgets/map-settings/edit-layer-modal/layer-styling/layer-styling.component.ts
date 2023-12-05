import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { GeometryType } from '../../../../ui/map/interfaces/layer-settings.type';
import { Fields } from '../../../../../models/layer.model';
import { DomPortal } from '@angular/cdk/portal';

/** Available renderer types for point */
const POINT_RENDERER_TYPES = ['simple', 'heatmap', 'uniqueValue'];
/** Available renderer types for polygon */
const POLYGON_RENDERER_TYPES = ['simple', 'uniqueValue'];

/**
 * Layer styling component.
 */
@Component({
  selector: 'shared-layer-styling',
  templateUrl: './layer-styling.component.html',
  styleUrls: ['./layer-styling.component.scss'],
})
export class LayerStylingComponent implements OnInit {
  /** Type of layer geometry ( point / polygon ) */
  @Input() geometryType: GeometryType = 'Point';
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Map dom portal */
  @Input() mapPortal?: DomPortal;
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** Possible renderer types */
  public rendererTypes!: string[];

  ngOnInit(): void {
    switch (this.geometryType) {
      case 'Polygon':
        this.rendererTypes = POLYGON_RENDERER_TYPES;
        break;
      default:
      case 'Point':
        this.rendererTypes = POINT_RENDERER_TYPES;
        break;
    }
  }
}
