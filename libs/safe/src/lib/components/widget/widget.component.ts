import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostBinding,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { SafeChartComponent } from '../widgets/chart/chart.component';
import { SafeEditorComponent } from '../widgets/editor/editor.component';
import { SafeGridWidgetComponent } from '../widgets/grid/grid.component';
import { SafeMapWidgetComponent } from '../widgets/map/map.component';
import { SafeSummaryCardComponent } from '../widgets/summary-card/summary-card.component';
import { v4 as uuidv4 } from 'uuid';
import get from 'lodash/get';
import { SafeRestService } from '../../services/rest/rest.service';

/** Component for the widgets */
@Component({
  selector: 'safe-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class SafeWidgetComponent implements OnInit, OnDestroy {
  @Input() widget: any;
  @Input() header = true;
  @Input() canUpdate = false;

  /** @returns would component block navigation */
  get canDeactivate() {
    if (this.widgetContentComponent instanceof SafeGridWidgetComponent) {
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
    | SafeChartComponent
    | SafeGridWidgetComponent
    | SafeMapWidgetComponent
    | SafeEditorComponent
    | SafeSummaryCardComponent;

  // === EMIT EVENT ===
  @Output() edit: EventEmitter<any> = new EventEmitter();

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() changeStep: EventEmitter<number> = new EventEmitter();

  /**
   * Widget component
   *
   * @param restService Shared rest service
   */
  constructor(private restService: SafeRestService) {}

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
          const head = document.getElementsByTagName('head')[0];
          this.customStyle = document.createElement('style');
          this.customStyle.appendChild(document.createTextNode(css));
          head.appendChild(this.customStyle);
        });
    }
  }

  ngOnDestroy(): void {
    // Remove style from head if exists, to avoid too many styles to be active at same time
    if (this.customStyle) {
      document.getElementsByTagName('head')[0].removeChild(this.customStyle);
    }
  }
}
