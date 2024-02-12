import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { createMapWidgetFormGroup } from './map-forms';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../../ui/map/interfaces/map.interface';
import { debounceTime, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { LayerModel } from '../../../models/layer.model';
import { MapComponent } from '../../ui/map';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { UILayoutService } from '@oort-front/ui';
import { DomPortal } from '@angular/cdk/portal';
import { WidgetSettings } from '../../../models/dashboard.model';

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
  implements
    OnInit,
    OnDestroy,
    AfterViewInit,
    WidgetSettings<typeof extendWidgetForm>
{
  /** Current widget */
  @Input() widget: any;
  /** Emit widget change */
  @Output() formChange: EventEmitter<ReturnType<typeof extendWidgetForm>> =
    new EventEmitter();
  /** Reference to map default container */
  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainer!: ViewContainerRef;
  /** Map settings */
  public mapSettings!: MapConstructorSettings;
  /** Current widget form group */
  public widgetFormGroup!: ReturnType<typeof extendWidgetForm>;
  /** Loaded layers */
  public openedLayers: (LayerModel | undefined)[] = [];
  /** Map dom portal ( this component initializes it ) */
  public mapPortal?: DomPortal;
  /** For map display */
  public mapComponent?: MapComponent;
  /** Layers controls right side nav. Store if sidenav is used, to be able to destroy it when closing the view. */
  private openedLayersSideNav = false;

  /**
   * Map widget settings editor.
   *
   * @param layoutService Shared layout service
   */
  constructor(private layoutService: UILayoutService) {
    super();
  }

  ngOnInit(): void {
    if (!this.widgetFormGroup) {
      this.buildSettingsForm();
    }
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
    // Generate map & attach it to dom portal
    const componentRef = this.mapContainer.createComponent(MapComponent);
    componentRef.instance.mapSettings = this.mapSettings;
    componentRef.instance.mapEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.handleMapEvent(event));
    componentRef.changeDetectorRef.detectChanges();
    this.mapPortal = new DomPortal(componentRef.instance.el);
    this.mapComponent = componentRef.instance;

    // Prevent sidenav to appear after closing dialog, when user clicks on "layers" button
    this.layoutService.rightSidenav$
      .pipe(takeUntil(this.destroy$))
      .subscribe((view: any) => {
        if (view?.inputs?.layersMenuExpanded) {
          this.openedLayersSideNav = true;
        }
      });
  }

  /**
   * Set form listeners
   */
  private setUpFormListeners() {
    if (!this.widgetFormGroup) return;

    this.widgetFormGroup?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.widgetFormGroup.markAsDirty({ onlySelf: true });
        this.formChange.emit(this.widgetFormGroup);
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
    this.widgetFormGroup
      .get('geographicExtents')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          geographicExtents: value,
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

  /**
   * Build the settings form, using the widget saved parameters
   */
  public buildSettingsForm() {
    this.widgetFormGroup = extendWidgetForm(
      createMapWidgetFormGroup(this.widget.id, this.widget.settings),
      this.widget.settings?.widgetDisplay
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    // Destroy layers control sidenav when closing the settings
    if (this.openedLayersSideNav) {
      this.layoutService.setRightSidenav(null);
    }
  }
}
