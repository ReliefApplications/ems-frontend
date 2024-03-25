import { Dialog } from '@angular/cdk/dialog';
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
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { DataTemplateService } from '../../../../services/data-template/data-template.service';
import { WidgetService } from '../../../../services/widget/widget.service';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { HtmlWidgetContentComponent } from '../../common/html-widget-content/html-widget-content.component';
import { SummaryCardFormT } from '../../summary-card-settings/summary-card-settings.component';
import { SummaryCardItemComponent } from '../summary-card-item/summary-card-item.component';
import { DashboardAutomationService } from '../../../../services/dashboard-automation/dashboard-automation.service';

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
   * Listen to click events from host element, and trigger any action attached to the content clicked in the summary card item
   *
   * @param event Click event from host element
   */
  @HostListener('click', ['$event'])
  onContentClick(event: any) {
    this.widgetService.handleWidgetContentClick(
      event,
      'shared-summary-card-item-content',
      this.dashboardAutomationService,
      this.settings.automationRules
    );
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
   * @param renderer Angular renderer2 service
   * @param el Element ref
   * @param router Angular router
   * @param widgetService Shared widget service
   * @param dashboardAutomationService Dashboard automation service (Optional, so not active while editing widget)
   */
  constructor(
    private dataTemplateService: DataTemplateService,
    private dialog: Dialog,
    @Optional() public parent: SummaryCardItemComponent,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    private widgetService: WidgetService,
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
