import { Injectable } from '@angular/core';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { eq, get } from 'lodash';
import { MapWidgetComponent } from '../../components/widgets/map/map.component';

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
   * Execute an automation rule.
   *
   * @param rule Rule to be executed.
   */
  public async executeAutomationRule(rule: any) {
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
              default: {
                break;
              }
            }
          }
        }
      }
    } catch {
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
