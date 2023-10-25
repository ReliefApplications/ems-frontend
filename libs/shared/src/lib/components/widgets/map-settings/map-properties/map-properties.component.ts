import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { MapConstructorSettings } from '../../../ui/map/interfaces/map.interface';
import { BASEMAPS } from '../../../ui/map/const/baseMaps';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

/**
 * Map Properties of Map widget.
 */
@Component({
  selector: 'shared-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss'],
})
export class MapPropertiesComponent
  extends UnsubscribeComponent
  implements AfterViewInit
{
  @Input() form!: UntypedFormGroup;
  @Input() mapSettings!: MapConstructorSettings;
  @Input() currentMapContainerRef!: BehaviorSubject<ViewContainerRef | null>;

  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainerRef!: ViewContainerRef;

  @Input() destroyTab$!: Subject<boolean>;

  public baseMaps = BASEMAPS;

  /** @returns the form group for the map controls */
  get controlsFormGroup() {
    return this.form.get('controls') as UntypedFormGroup;
  }

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();

  /**
   * Map Properties of Map widget.
   */
  constructor() {
    super();
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

  /**
   * Set the latitude and longitude of the center of the map using the one in the preview map.
   */
  onSetByMap(): void {
    this.form
      .get('initialState.viewpoint')
      ?.setValue(this.mapSettings.initialState.viewpoint, {
        emitEvent: false,
      });
  }

  /**
   * Reset given form field value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param formField Current form field
   * @param event click event
   */
  clearFormField(formField: string, event: Event) {
    if (this.form.get(formField)?.value) {
      this.form.get(formField)?.setValue(null);
    }
    event.stopPropagation();
  }
}
