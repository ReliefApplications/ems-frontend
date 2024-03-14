import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Renderer2,
  SkipSelf,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { DataTemplateService } from '../../../../services/data-template/data-template.service';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { Dialog } from '@angular/cdk/dialog';
import { HtmlWidgetContentComponent } from '../../common/html-widget-content/html-widget-content.component';
import { takeUntil } from 'rxjs';
import { SummaryCardItemComponent } from '../summary-card-item/summary-card-item.component';
import { ContextService } from '../../../../services/context/context.service';
import { Router } from '@angular/router';
import { SummaryCardFormT } from '../../summary-card-settings/summary-card-settings.component';
import { DashboardAutomationService } from '../../../../services/dashboard-automation/dashboard-automation.service';
import { isEqual, set } from 'lodash';

/**
 * Content component of Single Item of Summary Card.
 * Build html from item definition and queried record.
 */
@Component({
  selector: 'shared-summary-card-item-content',
  templateUrl: './summary-card-item-content.component.html',
  styleUrls: ['./summary-card-item-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SummaryCardItemContentComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  /** Html template */
  @Input() html = '';
  /** Available fields */
  @Input() fields: any[] = [];
  /** Fields value */
  @Input() fieldsValue: any;
  /** Styles to load */
  @Input() styles: any[] = [];
  /** Should style apply to whole card */
  @Input() wholeCardStyles = false;
  /** Widget settings */
  @Input() settings!: SummaryCardFormT['value'];
  /** Reference to html content component */
  @ViewChild(HtmlWidgetContentComponent)
  htmlContentComponent!: HtmlWidgetContentComponent;
  /** Formatted html, to be rendered */
  public formattedHtml: SafeHtml = '';
  /** Formatted style, to be applied */
  public formattedStyle?: string;
  /** Timeout to init active filter */
  private timeoutListener!: NodeJS.Timeout;

  /**
   * Listen to click events from host element, if record editor is clicked, open record editor modal
   *
   * @param event Click event from host element
   */
  @HostListener('click', ['$event'])
  onContentClick(event: any) {
    let filterButtonIsClicked = !!event.target.dataset.filterField;
    let currentNode = event.target;
    const currentFilters = { ...this.contextService.filter.getValue() };
    const updatedFilters = { ...currentFilters };
    // Check for filter fields
    if (!filterButtonIsClicked) {
      // Check parent node if contains the dataset for filtering until we hit the host node or find the node with the filter dataset
      while (
        currentNode.localName !== 'shared-summary-card-item-content' &&
        !filterButtonIsClicked
      ) {
        currentNode = this.renderer.parentNode(currentNode);
        filterButtonIsClicked = !!currentNode.dataset.filterField;
      }
    }
    if (filterButtonIsClicked) {
      const { filterField, filterValue } = currentNode.dataset;
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
    let ruleButtonIsClicked = !!event.target.dataset?.ruleTarget;
    currentNode = event.target; // reset the node
    if (!ruleButtonIsClicked) {
      // Check parent node if contains the dataset for filtering until we hit the host node or find the node with the filter dataset
      while (
        currentNode.localName !== 'shared-editor' &&
        !ruleButtonIsClicked
      ) {
        currentNode = this.renderer.parentNode(currentNode);
        ruleButtonIsClicked = !!currentNode.dataset?.ruleTarget;
      }
    }
    if (ruleButtonIsClicked) {
      const ruleTarget = currentNode.dataset?.ruleTarget;
      const rule = (this.settings.automationRules || []).find(
        (rule: any) => rule.id === ruleTarget
      );
      if (rule) {
        this.dashboardAutomationService?.executeAutomationRule(rule as any);
      }
    }

    // Check for filter reset
    let resetButtonIsClicked = !!event.target.dataset.filterReset;
    currentNode = event.target;
    if (!resetButtonIsClicked) {
      // Check parent node if contains the dataset for filtering until we hit the host node or find the node with the filter dataset
      while (
        currentNode.localName !== 'shared-summary-card-item-content' &&
        !resetButtonIsClicked
      ) {
        currentNode = this.renderer.parentNode(currentNode);
        resetButtonIsClicked = !!currentNode.dataset.filterReset;
      }
    }
    if (resetButtonIsClicked) {
      // Get all the fields that need to be cleared
      const resetList = currentNode.dataset.filterReset
        .split(';')
        .map((item: any) => item.trim());
      for (const key of Object.keys(updatedFilters)) {
        // If key is in list of fields that need to be cleared, remove it
        if (resetList.includes(key)) {
          delete updatedFilters[key];
        }
      }
    }

    // If filter is affected, update it
    if (!isEqual(currentFilters, updatedFilters)) {
      this.contextService.filter.next(updatedFilters);
    }

    const content = this.htmlContentComponent.el.nativeElement;
    const editorTriggers = content.querySelectorAll('.record-editor');
    editorTriggers.forEach((recordEditor: HTMLElement) => {
      if (recordEditor.contains(event.target)) {
        this.openEditRecordModal();
      }
    });
  }

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param dataTemplateService Shared data template service, used to render content from template
   * @param dialog CDK Dialog service
   * @param parent Reference to parent summary card item component
   * @param contextService Context service
   * @param renderer Angular renderer2 service
   * @param el Element ref
   * @param router Angular router
   * @param dashboardAutomationService Dashboard automation service (Optional, so not active while editing widget)
   */
  constructor(
    private dataTemplateService: DataTemplateService,
    private dialog: Dialog,
    @Optional() public parent: SummaryCardItemComponent,
    private contextService: ContextService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    @Optional()
    @SkipSelf()
    private dashboardAutomationService: DashboardAutomationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setHtml();
  }

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    this.setHtml();
  }

  /**
   * Set widget html.
   */
  private setHtml() {
    this.formattedStyle = this.dataTemplateService.renderStyle(
      this.wholeCardStyles,
      this.fieldsValue,
      this.styles
    );
    this.formattedHtml = this.dataTemplateService.renderHtml(this.html, {
      fields: this.fields,
      data: this.fieldsValue,
      styles: this.styles,
    });
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
    this.timeoutListener = setTimeout(() => {
      // Timeout allows to wait for content to be ready
      const anchorElements = this.el.nativeElement.querySelectorAll('a');
      anchorElements.forEach((anchor: HTMLElement) => {
        this.renderer.listen(anchor, 'click', (event: Event) => {
          // Prevent the default behavior of the anchor tag
          event.preventDefault();
          // Use the Angular Router to navigate to the desired route ( if needed )
          const href = anchor.getAttribute('href');
          const target = anchor.getAttribute('target');
          if (href) {
            if (target === '_blank') {
              // Open link in a new tab, don't use Angular router
              window.open(href, '_blank');
            } else {
              if (href?.startsWith('./')) {
                // Navigation inside the app builder
                this.router.navigateByUrl(href.substring(1));
              } else {
                // Default navigation
                window.location.href = href;
              }
            }
          }
        });
      });
    }, 500);
  }

  /**
   * Pass click event to data template service
   *
   * @param event Click event
   */
  public onClick(event: any) {
    this.dataTemplateService.onClick(event, this.fieldsValue);
  }

  /**
   * Open edit record modal.
   */
  private async openEditRecordModal() {
    if (
      this.parent.card.resource &&
      this.parent.card.layout &&
      this.fieldsValue.canUpdate
    ) {
      const { FormModalComponent } = await import(
        '../../../form-modal/form-modal.component'
      );
      const dialogRef = this.dialog.open(FormModalComponent, {
        disableClose: true,
        data: {
          recordId: this.fieldsValue.id,
          template: this.parent.card.template,
        },
        autoFocus: false,
      });
      dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        if (value) {
          this.parent.refresh();
          // Update the record, based on new configuration
          // this.getRecord().then(() => {
          //   this.formattedStyle = this.dataTemplateService.renderStyle(
          //     this.settings.wholeCardStyles || false,
          //     this.fieldsValue,
          //     this.styles
          //   );
          //   this.formattedHtml = this.dataTemplateService.renderHtml(
          //     this.settings.text,
          //     this.fieldsValue,
          //     this.fields,
          //     this.styles
          //   );
          // });
        }
      });
    }
  }
}
