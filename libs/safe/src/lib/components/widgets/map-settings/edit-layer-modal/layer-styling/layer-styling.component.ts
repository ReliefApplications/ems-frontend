import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { GeometryType } from '../../../../ui/map/interfaces/layer-settings.type';
import { Fields } from '../../../../../models/layer.model';

/** Available renderer types for point */
const POINT_RENDERER_TYPES = ['simple', 'heatmap', 'uniqueValue'];
/** Available renderer types for polygon */
const POLYGON_RENDERER_TYPES = ['simple', 'uniqueValue'];

/**
 * Layer styling component.
 */
@Component({
  selector: 'safe-layer-styling',
  templateUrl: './layer-styling.component.html',
  styleUrls: ['./layer-styling.component.scss'],
})
export class LayerStylingComponent implements AfterViewInit, OnInit {
  @Input() geometryType: GeometryType = 'Point';
  @Input() formGroup!: FormGroup;
  public rendererTypes!: string[];
  @Input() fields$!: Observable<Fields[]>;

  // Display of map
  @Input() currentMapContainerRef!: BehaviorSubject<ViewContainerRef | null>;
  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainerRef!: ViewContainerRef;
  @Input() destroyTab$!: Subject<boolean>;

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

  ngAfterViewInit(): void {
    this.currentMapContainerRef
      .pipe(takeUntil(this.destroyTab$))
      .subscribe((viewContainerRef) => {
        if (viewContainerRef) {
          if (viewContainerRef !== this.mapContainerRef) {
            const view = viewContainerRef.detach();
            if (view) {
              this.mapContainerRef.insert(view);
              this.currentMapContainerRef.next(this.mapContainerRef);
            }
          }
        }
      });
  }
}
