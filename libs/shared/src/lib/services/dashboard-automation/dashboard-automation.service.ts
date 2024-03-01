import { Injectable } from '@angular/core';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import {
  eq,
  get,
  isArray,
  isEmpty,
  isNil,
  isObject,
  isString,
  mapValues,
  set,
} from 'lodash';
import { MapWidgetComponent } from '../../components/widgets/map/map.component';
import { MapPolygonsService } from '../map/map-polygons.service';
import { first, firstValueFrom } from 'rxjs';
import { ContextService } from '../context/context.service';

/**
 * Dashboard automation services.
 * Runs operations defined in widgets, in automation tab.
 * To be injected in dashboard components.
 */
@Injectable()
export class DashboardAutomationService {
  /** Reference to the current dashboard ( unique per service instance ) */
  public dashboard!: DashboardComponent;
  /** Regex used to replace values in rule components */
  public automationRegex = /["']?{{automation\.(.*?)}}["']?/;

  /**
   * Dashboard automation services.
   * Runs operations defined in widgets, in automation tab.
   * To be injected in dashboard components.
   *
   * @param mapPolygonsService Map Polygons service
   * @param contextService Shared context service
   */
  constructor(
    private mapPolygonsService: MapPolygonsService,
    private contextService: ContextService
  ) {}

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
              case 'set.context': {
                const mapping = get(component, 'value.mapping', '');
                console.log(typeof mapping);
                console.log(mapping);
                const mappingAsJSON = this.parseJSONValues(JSON.parse(mapping));
                console.log(mappingAsJSON);
                const toString = JSON.stringify(mappingAsJSON);
                console.log(toString);
                const replaced = toString.replace(
                  new RegExp(this.automationRegex, 'g'),
                  (match) => {
                    const field = match
                      .replace(/["']?\{\{automation\./, '')
                      .replace(/\}\}["']?/, '');
                    const fieldValue = get(context, field);
                    return isNil(fieldValue)
                      ? match
                      : JSON.stringify(fieldValue);
                  }
                );
                const parsed = JSON.parse(replaced);
                this.contextService.removeEmptyPlaceholders(parsed);
                if (!isEmpty(parsed)) {
                  this.contextService.context = parsed;
                  console.log(this.contextService.context);
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

  /**
   * Parse JSON values of object.
   *
   * @param obj object to transform
   * @returns object, where string properties that can be transformed to objects, are returned as objects
   */
  private parseJSONValues(obj: any): any {
    if (isArray(obj)) {
      return obj.map((element: any) => this.parseJSONValues(element));
    }
    return mapValues(obj, (value: any) => {
      if (isString(value)) {
        try {
          return isObject(JSON.parse(value)) ? JSON.parse(value) : value;
        } catch (error) {
          // If parsing fails, return the original string value
          return value;
        }
      } else if (isArray(value)) {
        // If the value is an array, recursively parse each element
        return value.map((element: any) => this.parseJSONValues(element));
      } else if (isObject(value)) {
        // If the value is an object, recursively parse it
        return this.parseJSONValues(value);
      } else {
        // If the value is neither a string nor an object, return it as is
        return value;
      }
    });
  }
}
