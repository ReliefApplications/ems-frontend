import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Feature, Point } from 'geojson';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

/** Component for a popup that has information on multiple points */
@Component({
  selector: 'safe-grouped-points-popup',
  templateUrl: './grouped-points-popup.component.html',
  styleUrls: ['./grouped-points-popup.component.scss'],
})
export class GroupedPointsPopupComponent
  extends SafeUnsubscribeComponent
  implements AfterContentInit
{
  @Input() points: Feature<Point>[] = [];
  @Input() template = '';

  @Output() close = new EventEmitter<void>();
  public currentHtml: SafeHtml = '';
  public current = new BehaviorSubject<number>(0);

  /** @returns current as an observable */
  get current$() {
    return this.current.asObservable();
  }

  /** @returns the current value */
  get currValue() {
    return this.current.value;
  }

  /**
   * Component for a popup that has information on multiple points
   *
   * @param sanitizer The dom sanitizer, to sanitize the template
   */
  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  ngAfterContentInit(): void {
    this.setInnerHtml();
    this.current$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setInnerHtml();
    });
  }

  /** Updates the html for the current point */
  public setInnerHtml() {
    const properties = this.points[this.currValue].properties;
    const regex = /{{(.*?)}}/g;
    // if no properties, return the template replacing all matches with empty string
    // if there are properties, replace the matches with the corresponding property
    const html = properties
      ? this.template.replace(regex, (match) => {
          const key = match.replace(/{{|}}/g, '');
          const value = properties[key];
          return value ? value : '';
        })
      : this.template.replace(regex, '');

    const scriptRegex = /<script>(.*?)<\/script>/g;
    // remove all script tags
    const sanitizedHtml = html.replace(scriptRegex, '');
    this.currentHtml = this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }
}
