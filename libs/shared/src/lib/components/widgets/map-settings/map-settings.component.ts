import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  ViewContainerRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { createMapWidgetFormGroup } from './map-forms';
import { UntypedFormGroup } from '@angular/forms';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../../ui/map/interfaces/map.interface';
import { BehaviorSubject, Subject, debounceTime, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { LayerModel } from '../../../models/layer.model';
import { MapComponent } from '../../ui/map';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { UILayoutService } from '@oort-front/ui';

/**
 * Map widget settings editor.
 */
@Component({
  selector: 'shared-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss'],
})
export class MapSettingsComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  /** Current widget */
  @Input() widget: any;
  /** Emit widget change */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();
  /** Map settings */
  public mapSettings!: MapConstructorSettings;
  /** Current widget form group */
  public widgetFormGroup!: UntypedFormGroup;
  /** Loaded layers */
  public openedLayers: (LayerModel | undefined)[] = [];
  /** Layers controls right side nav. Store if sidenav is used, to be able to destroy it when closing the view. */
  private openedLayersSideNav = false;

  /** For map display */
  public mapComponent?: MapComponent;
  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainerRef!: ViewContainerRef;

  public currentMapContainerRef = new BehaviorSubject<ViewContainerRef | null>(
    null
  );
  destroyTab$: Subject<boolean> = new Subject<boolean>();

  /**
   * Map widget settings editor.
   *
   * @param cdr ChangeDetectorRef
   * @param layoutService Shared layout service
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private layoutService: UILayoutService
  ) {
    super();
  }

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.widgetFormGroup = extendWidgetForm(
      createMapWidgetFormGroup(this.widget.id, this.widget.settings),
      this.widget.settings?.widgetDisplay
    );

    this.change.emit(this.widgetFormGroup);

    const defaultMapSettings: MapConstructorSettings = {
      basemap: this.widgetFormGroup.value.basemap,
      initialState: this.widgetFormGroup.get('initialState')?.value,
      controls: this.widgetFormGroup.value.controls,
      arcGisWebMap: this.widgetFormGroup.value.arcGisWebMap,
      layers: this.widgetFormGroup.value.layers,
    };
    this.updateMapSettings(defaultMapSettings);
    this.setUpFormListeners();
  }

  ngAfterViewInit(): void {
    const componentRef = this.mapContainerRef.createComponent(MapComponent);
    componentRef.instance.mapSettings = this.mapSettings;
    componentRef.instance.mapEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.handleMapEvent(event));
    this.mapComponent = componentRef.instance;
    this.currentMapContainerRef.next(this.mapContainerRef);

    this.layoutService.rightSidenav$
      .pipe(takeUntil(this.destroy$))
      .subscribe((view: any) => {
        if (view?.inputs?.layersMenuExpanded) {
          this.openedLayersSideNav = true;
        }
      });
  }

  /**
   * Change on selected index.
   */
  selectedIndexChange(): void {
    this.destroyTab$.next(true);
    const currentContainerRef = this.currentMapContainerRef.getValue();
    if (currentContainerRef) {
      const view = currentContainerRef.detach();
      if (view) {
        this.mapContainerRef.insert(view);
        this.currentMapContainerRef.next(this.mapContainerRef);
        this.destroyTab$.next(false);
      }
    }
  }

  /**
   * Set form listeners
   */
  private setUpFormListeners() {
    if (!this.widgetFormGroup) return;

    this.widgetFormGroup?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.change.emit(this.widgetFormGroup);
      });
    this.widgetFormGroup
      .get('initialState')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          initialState: value,
        } as MapConstructorSettings)
      );
    this.widgetFormGroup
      .get('basemap')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({ basemap: value } as MapConstructorSettings)
      );
    this.widgetFormGroup
      .get('controls')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateMapSettings({
          controls: value,
        } as MapConstructorSettings);
      });
    this.widgetFormGroup
      .get('arcGisWebMap')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          arcGisWebMap: value,
        } as MapConstructorSettings)
      );
    this.widgetFormGroup
      .get('layers')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          layers: value,
        } as MapConstructorSettings)
      );
  }

  /**
   * Update map settings
   *
   * @param settings new settings
   */
  private updateMapSettings(settings: MapConstructorSettings) {
    if (this.mapSettings) {
      this.mapSettings = {
        ...this.mapSettings,
        ...settings,
      };
    } else {
      this.mapSettings = settings;
    }
    if (this.mapComponent) {
      this.mapComponent.mapSettings = this.mapSettings;
    }
  }

  /**
   * Handle leaflet map events
   *
   * @param event leaflet map event
   */
  handleMapEvent(event: MapEvent) {
    if (!this.widgetFormGroup) return;
    switch (event.type) {
      case MapEventType.MOVE_END:
        this.mapSettings.initialState.viewpoint.center.latitude =
          event.content.center.lat;
        this.mapSettings.initialState.viewpoint.center.longitude =
          event.content.center.lng;
        break;
      case MapEventType.ZOOM_END:
        this.mapSettings.initialState.viewpoint.zoom = event.content.zoom;
        this.widgetFormGroup
          .get('initialState.viewpoint.zoom')
          ?.setValue(this.mapSettings.initialState.viewpoint.zoom, {
            emitEvent: false,
          });
        break;
      default:
        break;
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.mapContainerRef.detach();
    // Destroy layers control sidenav when closing the settings
    if (this.openedLayersSideNav) {
      this.layoutService.setRightSidenav(null);
    }
  }
}
