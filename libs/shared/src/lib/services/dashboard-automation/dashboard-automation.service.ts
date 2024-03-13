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
import {
  BehaviorSubject,
  Observable,
  Subscriber,
  filter,
  first,
  firstValueFrom,
  merge,
} from 'rxjs';
import { ContextService } from '../context/context.service';
import { TabsComponent } from '../../components/widgets/tabs/tabs.component';

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
  /** Automation rule subject used to queue all rules triggered */
  public executeRuleQueue = new BehaviorSubject<{
    rule: any;
    value?: any;
  } | null>(null);
  /** Automation rule subject used to queue all rules triggered as observable */
  private executeRuleQueue$ = this.executeRuleQueue.asObservable();

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
  ) {
    const notNull = <T>(value: T | null): value is T => value !== null;

    this.executeRuleQueue$
      .pipe(
        filter(notNull),
        this.triggerSubscriptionOn(this.contextService.areLayersFiltering)
      )
      .subscribe({
        next: ({ rule, value }) => {
          this.executeAutomationRule(rule, value);
        },
      });
  }

  /**
   * Handle rule queue, if one of the rules wants to be applied while layer filters are applied in a map component
   *
   * @param isLayerFiltering Flag to tell to the automation rule queue if layers in a map component are filtering
   * @returns Observable from execute rule queue
   */
  private triggerSubscriptionOn<T>(isLayerFiltering: BehaviorSubject<boolean>) {
    const triggerRuleSentToStream = (
      queuedAutomationRules: any[],
      subscriber: Subscriber<T>
    ) => {
      let numberOfRulesSent = 0;
      if (!isLayerFiltering.getValue()) {
        queuedAutomationRules.forEach((rule) => {
          /** Keep checking as one of the sent rules could trigger map layer filtering in the meantime */
          if (!isLayerFiltering.getValue()) {
            subscriber.next(rule);
            numberOfRulesSent++;
          }
        });
        /** And take all sent rules from the actual queue */
        queuedAutomationRules.splice(0, numberOfRulesSent);
      }
    };
    return (observable: Observable<T>) =>
      new Observable<T>((subscriber) => {
        const queuedAutomationRules = new Array<any>();
        const subscription = merge(observable, isLayerFiltering).subscribe({
          /**
           * Handle rule queue, if one of the rules wants to be applied while layer filters are applied in a map component
           * Then are queued and later on returned once the isLayerFiltering flag is set to false
           *
           * @param value Could be a rule or flag from map widget that layer filters are applied
           */
          next(value) {
            /** If new rule comes, push it to the queue */
            if (!(typeof value === 'boolean')) {
              queuedAutomationRules.push(value);
            }
            triggerRuleSentToStream(queuedAutomationRules, subscriber);
          },
          /**
           * On error from observable
           *
           * @param err Error thrown
           */
          error(err) {
            subscriber.error(err);
          },
          /** On complete  */
          complete() {
            if (queuedAutomationRules.length === 0) {
              subscriber.complete();
            }
          },
        });
        return () => {
          subscription.unsubscribe();
        };
      });
  }

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
              case 'remove.layer': {
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
                );
                if (value.latlng) {
                  const country = this.mapPolygonsService.findCountryFromPoint(
                    value.latlng
                  );
                  if (country) {
                    set(context, 'admin0', country);
                  } else {
                    return;
                  }
                }
                break;
              }
              case 'set.context': {
                const mapping = get(component, 'value.mapping', '');
                const mappingAsJSON = this.parseJSONValues(JSON.parse(mapping));
                const toString = JSON.stringify(mappingAsJSON);
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
                }
                break;
              }
              case 'add.tab': {
                const widget = this.findWidget(component.value.widget);
                const tabIds = component.value.tabs;
                if (
                  widget &&
                  widget.widgetContentComponent instanceof TabsComponent
                ) {
                  for (const id of tabIds) {
                    const tab = widget.widgetContentComponent.tabs.find(
                      (x) => x.id === id
                    );
                    if (tab) {
                      tab.hide = false;
                    }
                  }
                }
                break;
              }
              case 'remove.tab': {
                const widget = this.findWidget(component.value.widget);
                const tabIds = component.value.tabs;
                if (
                  widget &&
                  widget.widgetContentComponent instanceof TabsComponent
                ) {
                  for (const id of tabIds) {
                    const tab = widget.widgetContentComponent.tabs.find(
                      (x) => x.id === id
                    );
                    if (tab) {
                      tab.hide = true;
                    }
                  }
                }
                break;
              }
              case 'open.tab': {
                const widget = this.findWidget(component.value.widget);
                const tabId = component.value.tab;
                if (
                  widget &&
                  widget.widgetContentComponent instanceof TabsComponent
                ) {
                  const index = widget.widgetContentComponent.tabs
                    .filter((x) => !x.hide)
                    .findIndex((x) => x.id === tabId);
                  if (index > -1) {
                    const tab =
                      widget.widgetContentComponent.tabGroup?.tabs.find(
                        (tab) => tab.id === tabId
                      );
                    if (tab) {
                      widget.widgetContentComponent.tabGroup?.showContent(tab);
                    } else {
                      widget.widgetContentComponent.selectedIndex = index;
                    }
                  }
                }
                break;
              }
              case 'display.collapse': {
                const widget = this.findWidget(component.value.widget);
                if (widget && widget.showExpand && widget.expanded) {
                  widget.onResize();
                }
                break;
              }
              case 'display.expand': {
                const widget = this.findWidget(component.value.widget);
                if (widget && widget.showExpand && !widget.expanded) {
                  widget.onResize();
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
