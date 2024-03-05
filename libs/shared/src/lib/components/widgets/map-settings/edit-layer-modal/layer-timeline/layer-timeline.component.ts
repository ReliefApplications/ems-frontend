import { Component, Input } from '@angular/core';
import { Fields } from '../../../../../models/layer.model';
import { Observable } from 'rxjs';
import { DomPortal } from '@angular/cdk/portal';
import { createTimelineForm } from '../../map-forms';
import { DATE_FORMATS } from '../../../../../pipes/date/date.pipe';

/** Component for the timeline settings of a layer */
@Component({
  selector: 'shared-layer-timeline',
  templateUrl: './layer-timeline.component.html',
  styleUrls: ['./layer-timeline.component.scss'],
})
export class LayerTimelineComponent {
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** Map dom portal */
  @Input() mapPortal?: DomPortal;
  /** Angular form group for the options */
  @Input() form!: ReturnType<typeof createTimelineForm>;
  /** Available date formats */
  public dateFormats = DATE_FORMATS;
  /** Example date to show different date formats */
  public exampleDate = new Date();
}
