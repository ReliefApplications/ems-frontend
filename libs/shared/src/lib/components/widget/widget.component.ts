import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostBinding,
  OnInit,
  OnDestroy,
  Inject,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import { ChartComponent } from '../widgets/chart/chart.component';
import { EditorComponent } from '../widgets/editor/editor.component';
import { GridWidgetComponent } from '../widgets/grid/grid.component';
import { MapWidgetComponent } from '../widgets/map/map.component';
import { SummaryCardComponent } from '../widgets/summary-card/summary-card.component';
import { v4 as uuidv4 } from 'uuid';
import get from 'lodash/get';
import { RestService } from '../../services/rest/rest.service';
import { DOCUMENT } from '@angular/common';

/** Component for the widgets */
@Component({
  selector: 'shared-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent implements OnInit, OnDestroy {
  @Input() widget: any;
  @Input() header = true;
  @Input() canUpdate = false;
  @Input() headerLeftTemplate?: TemplateRef<any>;
  @Input() headerRightTemplate?: TemplateRef<any>;

  /** @returns would component block navigation */
  get canDeactivate() {
    if (this.widgetContentComponent instanceof GridWidgetComponent) {
      return this.widgetContentComponent.canDeactivate;
    } else {
      return true;
    }
  }

  private customStyle?: HTMLStyleElement;

  @HostBinding()
  id = `widget-${uuidv4()}`;

  @ViewChild('widgetContent')
  widgetContentComponent!:
    | ChartComponent
    | GridWidgetComponent
    | MapWidgetComponent
    | EditorComponent
    | SummaryCardComponent;

  // === EMIT EVENT ===
  @Output() edit: EventEmitter<any> = new EventEmitter();

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() changeStep: EventEmitter<number> = new EventEmitter();

  /**
   * Widget component
   *
   * @param restService Shared rest service
   * @param document document
   * @param elementRef reference to element
   */
  constructor(
    private restService: RestService,
    @Inject(DOCUMENT) private document: Document,
    public elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Get style from widget definition
    const style = get(this.widget, 'settings.widgetDisplay.style') || '';
    if (style) {
      const scss = `#${this.id} {
        ${style}
      }`;
      // Compile to css ( we store style as scss )
      this.restService
        .post('style/scss-to-css', { scss }, { responseType: 'text' })
        .subscribe((css) => {
          // Add to head of document
          const head = this.document.getElementsByTagName('head')[0];
          this.customStyle = this.document.createElement('style');
          this.customStyle.appendChild(this.document.createTextNode(css));
          head.appendChild(this.customStyle);
        });
    }
  }

  ngOnDestroy(): void {
    // Remove style from head if exists, to avoid too many styles to be active at same time
    if (this.customStyle) {
      this.document
        .getElementsByTagName('head')[0]
        .removeChild(this.customStyle);
    }
  }
}
