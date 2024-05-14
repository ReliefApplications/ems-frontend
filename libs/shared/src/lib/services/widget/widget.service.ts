import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ShadowDomService } from '@oort-front/ui';
import { isEqual, set } from 'lodash';
import get from 'lodash/get';
import { ContextService } from '../context/context.service';
import { DashboardAutomationService } from '../dashboard-automation/dashboard-automation.service';
import { ActionWithValue } from '../../models/automation.model';
import { compileString } from 'sass';

/**
 * Shared widget service.
 * Handles common operations, like:
 * - adding custom style
 * - widget click
 * - variables injection
 */
@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  /** Renderer */
  private renderer!: Renderer2;

  /**
   * Shared widget service.
   *
   * @param document Document reference
   * @param shadowDomService Shared shadow dom service
   * @param contextService Shared context service
   * @param _renderer RendererFactory2
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private shadowDomService: ShadowDomService,
    private contextService: ContextService,
    _renderer: RendererFactory2
  ) {
    this.renderer = _renderer.createRenderer(null, null);
  }

  /**
   * Create custom style html element
   *
   * @param id id of widget or element to style
   * @param widget widget definition
   * @returns Promise with html style element ( if any )
   */
  public createCustomStyle(id: string, widget: any) {
    return new Promise<HTMLStyleElement | void>((resolve) => {
      // Get style from widget definition
      const style = get(widget, 'settings.widgetDisplay.style') || '';
      if (style) {
        try {
          const scss = `#${id} {
            ${style}
          }`;
          // Compile to css ( we store style as scss )
          const css = compileString(scss).css;
          const customStyle = this.document.createElement('style');
          customStyle.appendChild(this.document.createTextNode(css));
          if (this.shadowDomService.isShadowRoot) {
            // Add it to shadow root
            this.shadowDomService.currentHost.appendChild(customStyle);
          } else {
            // Add to head of document
            const head = this.document.getElementsByTagName('head')[0];
            head.appendChild(customStyle);
          }
          resolve(customStyle);
        } catch {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }

  /**
   * Performs any action attached to the content clicked in the given widget, like context filtering or automation rules
   *
   * @param event Click event received from the widget
   * @param widgetNodeName Current clicked widget node name
   * @param dashboardAutomationService Dashboard automation service, provided by widget
   * @param automationRules Automation rules from the widget settings to trigger if needed
   */
  public handleWidgetContentClick(
    event: PointerEvent,
    widgetNodeName: string,
    dashboardAutomationService: DashboardAutomationService,
    automationRules:
      | Partial<{
          id: any;
          name: any;
          components: ActionWithValue[] | undefined;
        }>[]
      | undefined
  ) {
    let filterButtonIsClicked = !!(event?.target as HTMLElement)?.dataset
      .filterField;
    let currentNode = event.target as HTMLElement;
    const currentFilters = { ...this.contextService.filter.getValue() };
    const updatedFilters = { ...currentFilters };
    // Check for filter fields
    if (!filterButtonIsClicked) {
      // Check parent node if contains the dataset for filtering until we hit the host node or find the node with the filter dataset
      while (
        currentNode.localName !== widgetNodeName &&
        !filterButtonIsClicked
      ) {
        currentNode = this.renderer.parentNode(currentNode);
        filterButtonIsClicked = !!currentNode.dataset.filterField;
      }
    }
    if (filterButtonIsClicked) {
      const { filterField = '', filterValue = '' } = currentNode.dataset;
      // Cleanup filter value from the span set by default in the tinymce calculated field if exists
      const cleanContent = filterValue.match(/(?<=>)(.*?)(?=<)/gi);
      const cleanFilterValue = cleanContent ? cleanContent[0] : filterValue;
      // If current filters contains the field but there is no value set, delete it
      if (filterField in currentFilters && !cleanFilterValue) {
        delete updatedFilters[filterField];
      }
      // Update filter object with existing fields and values
      if (cleanFilterValue) {
        set(updatedFilters, filterField, cleanFilterValue);
      }
    }

    // Check for automation rules
    let ruleButtonIsClicked = !!(event?.target as HTMLElement)?.dataset
      ?.ruleTarget;
    currentNode = event.target as HTMLElement; // reset the node
    if (!ruleButtonIsClicked) {
      // Check parent node if contains the dataset for filtering until we hit the host node or find the node with the filter dataset
      while (currentNode.localName !== widgetNodeName && !ruleButtonIsClicked) {
        currentNode = this.renderer.parentNode(currentNode);
        ruleButtonIsClicked = !!currentNode.dataset?.ruleTarget;
      }
    }
    if (ruleButtonIsClicked && automationRules) {
      const ruleTarget = currentNode.dataset?.ruleTarget;
      const rule = automationRules.find((rule: any) => rule.id === ruleTarget);
      if (rule) {
        dashboardAutomationService?.executeAutomationRule(rule);
      }
    }

    // Check for filter reset
    let resetButtonIsClicked = !!(event?.target as HTMLElement)?.dataset
      ?.filterReset;
    currentNode = event.target as HTMLElement; // reset the node
    if (!resetButtonIsClicked) {
      // Check parent node if contains the dataset for filtering until we hit the host node or find the node with the filter dataset
      while (
        currentNode.localName !== widgetNodeName &&
        !resetButtonIsClicked
      ) {
        currentNode = this.renderer.parentNode(currentNode);
        resetButtonIsClicked = !!currentNode.dataset.filterReset;
      }
    }
    if (resetButtonIsClicked) {
      // Get all the fields that need to be cleared
      const resetList = currentNode.dataset.filterReset
        ?.split(';')
        .map((item: any) => item.trim());
      for (const key of Object.keys(updatedFilters)) {
        // If key is in list of fields that need to be cleared, remove it
        if (resetList?.includes(key)) {
          delete updatedFilters[key];
        }
      }
    }

    // If filter is affected, update it
    if (!isEqual(currentFilters, updatedFilters)) {
      this.contextService.filter.next(updatedFilters);
    }
  }

  /**
   * Gets graphQLVariables from target source
   *
   * @param source source we need the mapping variables from
   * @param additionalLogic additional logic, for widgets that use other placeholders than filter & context
   * @returns the graphql query variables object
   */
  public mapGraphQLVariables(
    source: string | undefined,
    additionalLogic?: (mapping: any) => any
  ): object | null {
    try {
      let mapping = JSON.parse(source || '');
      mapping = this.contextService.replaceContext(mapping);
      mapping = this.contextService.replaceFilter(mapping);
      // Apply additional logic if provided
      if (additionalLogic) {
        mapping = additionalLogic(mapping);
      }
      this.contextService.removeEmptyPlaceholders(mapping);
      return mapping || {};
    } catch {
      return {};
    }
  }
}
