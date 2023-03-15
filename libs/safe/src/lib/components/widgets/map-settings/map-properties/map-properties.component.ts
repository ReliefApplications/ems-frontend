import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { MapConstructorSettings } from '../../../ui/map/interfaces/map.interface';
import { BASEMAPS } from '../../../ui/map/const/baseMaps';
import { ArcgisService } from '../../../../../lib/services/map/arcgis.service';
import { MatSelect } from '@angular/material/select';

/**
 * Map Properties of Map widget.
 */
@Component({
  selector: 'safe-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss'],
})
export class MapPropertiesComponent extends SafeUnsubscribeComponent {
  @Input() form!: UntypedFormGroup;
  @Input() mapSettings!: MapConstructorSettings;

  public baseMaps = BASEMAPS;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();

  public items: any[] = [];

  private start = 1;
  private loading = true;
  private nextPage = true;

  @Output()
  selectionChange = new EventEmitter<string>();

  @ViewChild('arcGisWebMap') elementSelect?: MatSelect;

  /**
   * Map Properties of Map widget.
   *
   * @param arcgis service
   */
  constructor(private arcgis: ArcgisService) {
    super();
  }

  /**
   * Subscribe to settings changes to update map.
   */
  ngOnInit(): void {
    this.search();
  }

  /**
   * Search for webmap data in argcis-rest-request using arcgis service
   */
  private search(): void {
    this.arcgis.searchItems({ start: this.start }).then((search) => {
      if (search.nextStart > this.start) {
        this.start = search.nextStart;
      } else {
        this.nextPage = false;
      }
      this.items = this.items.concat(search.results);
      this.loading = false;
    });
  }

  /**
   * Deals with open change
   *
   * @param event handler
   */
  openedChange(event: any): void {
    if (event && this.elementSelect) {
      const panel = this.elementSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
      );
    }
  }

  /**
   * Load on Scroll
   *
   * @param event handler
   */
  private loadOnScroll(event: any): void {
    if (
      event.target.scrollHeight -
        (event.target.clientHeight + event.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.nextPage) {
        this.loading = true;
        this.search();
      }
    }
  }
}
