import { Injectable } from '@angular/core';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { eq, get, set } from 'lodash';
import { MapWidgetComponent } from '../../components/widgets/map/map.component';
import { MapPolygonsService } from '../map/map-polygons.service';
import { first, firstValueFrom } from 'rxjs';

/**
 * Dashboard automation services.
 * Runs operations defined in widgets, in automation tab.
 * To be injected in dashboard components.
 */
@Injectable()
export class DashboardAutomationService {
  /** Reference to the current dashboard ( unique per service instance ) */
  public dashboard!: DashboardComponent;

  /**
   * Dashboard automation services.
   * Runs operations defined in widgets, in automation tab.
   * To be injected in dashboard components.
   *
   * @param mapPolygonsService Map Polygons service
   */
  constructor(private mapPolygonsService: MapPolygonsService) {}

  /**
   * Execute an automation rule.
   *
   * @param rule Rule to be executed.
   * @param value initial value ( trigger action result )
   */
  public async executeAutomationRule(rule: any, value?: any) {
    // Automation context
    const context = {};
    try {
      for (const component of rule.components) {
        switch (component.component) {
          case 'trigger': {
            break;
          }
          case 'action':
          default: {
            switch (component.type) {
              case 'add.layer': {
                const widget = this.findWidget(component.value.widget);
                const layerIds = component.value.layers;
                if (
                  widget &&
                  widget.widgetContentComponent instanceof MapWidgetComponent
                ) {
                  const layers =
                    widget.widgetContentComponent.mapComponent.layers.filter(
                      (layer) => layerIds.includes(layer.id)
                    );
                  const map = widget.widgetContentComponent.mapComponent;
                  layers.forEach((layer) => {
                    layer.getLayer().then((l) => {
                      (l as any).shouldDisplay = true;
                      map.addLayer(layer);
                    });
                  });
                }
                break;
              }
              case 'hide.layer': {
                const widget = this.findWidget(component.value.widget);
                const layerIds = component.value.layers;
                if (
                  widget &&
                  widget.widgetContentComponent instanceof MapWidgetComponent
                ) {
                  const layers =
                    widget.widgetContentComponent.mapComponent.layers.filter(
                      (layer) => layerIds.includes(layer.id)
                    );
                  const map = widget.widgetContentComponent.mapComponent;
                  layers.forEach((layer) => {
                    layer.getLayer().then((l) => {
                      (l as any).shouldDisplay = false;
                      map.removeLayer(layer);
                    });
                  });
                }
                break;
              }
              case 'map.get.country': {
                await firstValueFrom(
                  this.mapPolygonsService.admin0sReady$.pipe(first((v) => v))
                ).then(() => {
                  if (value.latlng) {
                    const country =
                      this.mapPolygonsService.findCountryFromPoint(
                        value.latlng
                      );
                    set(context, 'admin0', country);
                  }
                });
                break;
              }
              default: {
                break;
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      console.error('Fail to execute automation rule');
    }
  }

  /**
   * Find a widget by its id.
   *
   * @param id widget id
   * @returns widget, from grid of widgets
   */
  private findWidget(id: number) {
    return this.dashboard.widgetGridComponent.widgetComponents.find((x) =>
      eq(get(x, 'widget.id'), id)
    );
  }
}
