import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { SafeChartComponent } from '../widgets/chart/chart.component';
import { SafeEditorComponent } from '../widgets/editor/editor.component';
import { SafeGridWidgetComponent } from '../widgets/grid/grid.component';
import { SafeMapWidgetComponent } from '../widgets/map/map.component';
import { SafeSummaryCardComponent } from '../widgets/summary-card/summary-card.component';

/** Component for the widgets */
@Component({
  selector: 'safe-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class SafeWidgetComponent {
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
}
