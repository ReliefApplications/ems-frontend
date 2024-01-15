import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { FilterPosition } from './enums/dashboard-filters.enum';
import { Model, SurveyModel } from 'survey-core';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { ContextService } from '../../services/context/context.service';
import { SidenavContainerComponent } from '@oort-front/ui';
import { DatePipe } from '../../pipes/date/date.pipe';
import { DateTranslateService } from '../../services/date-translate/date-translate.service';
import { Dashboard } from '../../models/dashboard.model';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { renderGlobalProperties } from '../../survey/render-global-properties';
import { ReferenceDataService } from '../../services/reference-data/reference-data.service';
import { DOCUMENT } from '@angular/common';

/**
 * Interface for quick filters
 */
interface QuickFilter {
  label: string;
  tooltip?: string;
}

/**  Dashboard contextual filter component. */
@Component({
  selector: 'shared-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['../../style/survey.scss', './dashboard-filter.component.scss'],
})
export class DashboardFilterComponent
  extends UnsubscribeComponent
  implements OnDestroy, OnChanges, AfterViewInit
{
  /** Is editable */
  @Input() editable = false;
  /** Is fullscreen */
  @Input() isFullScreen = false;
  /** Filter variant ( defines style ) */
  @Input() variant = 'default';
  /** Is drawer opened */
  @Input() opened = false;
  /** Is closable */
  @Input() closable = true;
  /** Current position of filter */
  public position!: FilterPosition;
  /** Dashboard the filter belongs to */
  public dashboard?: Dashboard;
  /** Either left, right, top or bottom */
  public filterPosition = FilterPosition;
  /** computed width of the parent container (or the window size if fullscreen) */
  public containerWidth!: string;
  /** computed height of the parent container (or the window size if fullscreen) */
  public containerHeight!: string;
  /** computed left offset of the parent container (or 0 if fullscreen) */
  public containerTopOffset!: string;
  /** computed top offset of the parent container (or 0 if fullscreen) */
  public containerLeftOffset!: string;
  /** Filter template */
  public survey: Model = new Model();
  /** Filter template structure */
  public surveyStructure: any = {};
  /** Quick filter display */
  public quickFilters: QuickFilter[] = [];
  /** Indicate empty status of filter */
  public empty = true;
  /** Resize observer for the sidenav container */
  private resizeObserver!: ResizeObserver;

  /**
   * Dashboard contextual filter component.
   *
   * @param dashboardService Shared dashboard service
   * @param contextService Context service
   * @param ngZone Triggers html changes
   * @param referenceDataService Reference data service
   * @param changeDetectorRef Change detector reference
   * @param dateTranslate Service used for date formatting
   * @param document Document
   * @param _host sidenav container host
   */
  constructor(
    private dashboardService: DashboardService,
    public contextService: ContextService,
    private ngZone: NgZone,
    private referenceDataService: ReferenceDataService,
    private changeDetectorRef: ChangeDetectorRef,
    private dateTranslate: DateTranslateService,
    @Inject(DOCUMENT) private document: Document,
    @Optional() private _host: SidenavContainerComponent
  ) {
    super();
  }

  ngAfterViewInit(): void {
    if (this._host) {
      this.resizeObserver = new ResizeObserver(() => {
        this.setFilterContainerDimensions();
      });
      this.resizeObserver.observe(this._host.contentContainer.nativeElement);
    }
    this.contextService.filter$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.survey.data = value;
      });
    this.contextService.filterOpened$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.opened = value;
      });
    this.dashboardService.dashboard$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dashboard: Dashboard | null) => {
        if (dashboard) {
          this.dashboard = dashboard;
        }
      });
    this.contextService.filterStructure$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.surveyStructure = value || '';
        this.initSurvey();
      });
    this.contextService.filterPosition$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: FilterPosition | undefined) => {
        if (value) {
          this.position = value as FilterPosition;
        } else {
          this.position = FilterPosition.BOTTOM; // case where there are no default position set up
        }
        this.setFilterContainerDimensions();
      });
    if (!this.variant) {
      this.variant = 'default';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isFullScreen) {
      this.setFilterContainerDimensions();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.resizeObserver.disconnect();
  }

  // add ngOnChanges there

  /**
   * Set the drawer height and width on resize
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setFilterContainerDimensions();
  }

  /**
   * Event to close drawer on esc
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEsc() {
    if (this.variant === 'default') {
      this.opened = false;
    }
  }

  /** Toggle visibility on click */
  public onToggleVisibility() {
    this.contextService.filterOpened.next(!this.opened);
  }

  /**
   * Set the current position of the filter wrapper
   *
   * @param position Position to set
   */
  public changeFilterPosition(position: FilterPosition) {
    this.position = position;
    this.contextService.filterPosition.next(position);
  }

  /** Render the survey using the saved structure */
  private initSurvey(): void {
    this.survey = this.contextService.initSurvey();

    this.setAvailableFiltersForContext();

    this.survey.showCompletedPage = false; // Hide completed page from the survey
    this.survey.showNavigationButtons = false; // Hide navigation buttons from the survey

    this.survey.onValueChanged.add(this.onValueChange.bind(this));
    this.survey.onAfterRenderSurvey.add(this.onAfterRenderSurvey.bind(this));
    // we should render the custom questions somewhere, let's do it here
    this.survey.onAfterRenderQuestion.add((_, options: any) => {
      const parent = options.htmlElement.parentElement;
      if (parent) {
        parent.style['min-width'] = '0px';
      }
      renderGlobalProperties(this.referenceDataService);
    });
    this.onValueChange();
  }

  /**
   * Set the available filters of dashboard filter in the shared context service
   */
  private setAvailableFiltersForContext() {
    this.contextService.availableFilterFields = this.survey.getAllQuestions()
      .length
      ? this.survey
          .getAllQuestions()
          .map((question) => ({ name: question.title, value: question.name }))
      : [];
  }

  /**
   * Subscribe to survey render to see if survey is empty or not.
   *
   * @param survey survey model
   */
  public onAfterRenderSurvey(survey: SurveyModel) {
    this.empty = survey.getAllQuestions().length === 0;
  }

  /**
   * Checks if value is a date to format it with the date pipe.
   *
   * @param questionName the name of the question that the value is being checked
   * @param value value to check if is a date
   * @returns If value is a date or not, and if it's the formatted value (questionName: formatted)
   */
  private isDate(
    questionName: string,
    value: any
  ): { isDate: boolean; formattedValue?: string } {
    const checkDate = (str: any) => {
      if (typeof str === 'string') {
        // Checks the date or datetime in the input string
        // (datetimes are formatted as date)
        const datePart = str.match(
          /\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}\.\d{3}Z)?/
        );
        if (!datePart) {
          return false; // Invalid format
        }
        // Check if date is valid
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [y, M, d, h, m, s] = str.split(/[- : T Z]/);
        return y && parseFloat(M) <= 12 && parseFloat(d) <= 31 ? true : false;
      } else {
        // Don't check objects (time questions included)
        return false;
      }
    };
    if (checkDate(value)) {
      const date = new Date(value);
      const formatted = new DatePipe(this.dateTranslate).transform(
        date,
        'shortDate'
      );
      return { isDate: true, formattedValue: `${questionName}: ${formatted}` };
    } else {
      return { isDate: false };
    }
  }

  /**
   * Get survey values whether are primitives or not,
   * if there are not primitives, we have to map them one level from the value property in order to make the filters in the context service work
   *
   * @returns mapped survey filter values
   */
  private getSurveyValues() {
    return Object.keys(this.survey.data).reduce((acc, currentKey) => {
      acc = {
        ...acc,
        [currentKey]:
          this.survey.data[currentKey as any].value ??
          this.survey.data[currentKey as any],
      };
      return acc;
    }, {});
  }

  /**
   * Updates the filter in the context service with the latest survey data
   * when a value changes.
   */
  private onValueChange() {
    const surveyData = this.getSurveyValues();
    // Get the plain data of the form in order to handle it easier
    const displayValues = this.survey.getPlainData();
    /* Get the isPrimitiveValue property of the questions involved in the filter 
    with the question name as key to set the correct label in the dashboard selection
    */
    const isValuePrimitiveKeys = this.survey
      .getAllQuestions()
      .reduce(function (acc, question) {
        acc = {
          ...acc,
          // isPrimitiveValue property is just for the tagbox/dropdown/checkbox/radio questions
          // So if undefined, we can just skip it if for the other type of fields
          [question.name]: question.isPrimitiveValue ?? true,
        };
        return acc;
      }, {});
    this.contextService.filter.next(surveyData);
    this.ngZone.run(() => {
      this.quickFilters = displayValues
        .filter((question) => !!question.value)
        .map((question) => {
          let mappedQuestion;
          if (question.value instanceof Array && question.value.length > 2) {
            mappedQuestion = {
              label: question.title + ` (${question.value.length})`,
              tooltip: question.displayValue,
            };
          } else {
            // To check if the value used is primitive
            const isPrimitive =
              isValuePrimitiveKeys[
                question.name as keyof typeof isValuePrimitiveKeys
              ];
            // If the value used is not primitive, use the text label to display selection in the filter
            if (!isPrimitive) {
              // Check if value is a date to format it with the date pipe
              const checkValue = this.isDate(
                question.name as string,
                question.displayValue.text
              );
              mappedQuestion = {
                label: checkValue.isDate
                  ? checkValue.formattedValue
                  : question.displayValue.text,
              };
            } else {
              // else for primitive values, the selected display value
              const checkValue = this.isDate(
                question.name as string,
                question.displayValue
              );
              mappedQuestion = {
                label: checkValue.isDate
                  ? checkValue.formattedValue
                  : question.displayValue,
              };
            }
          }
          return mappedQuestion;
        });
    });
  }

  /**
   * Set filter container dimensions for the current parent container wrapper
   */
  private setFilterContainerDimensions() {
    // also check if fullscreen !
    if (this.isFullScreen) {
      this.containerWidth = `${window.innerWidth}px`;
      this.containerHeight = `${window.innerHeight}px`;
      this.containerLeftOffset = `${0}px`;
      this.containerTopOffset = `${0}px`;
    } else {
      if (this._host) {
        if (this._host.showSidenav[0]) {
          // remove width from left sidenav if opened
          this.containerWidth = `${
            this.document.getElementById('appPageContainer')?.offsetWidth
          }px`;
          this.containerHeight = `${this._host.el.nativeElement.offsetHeight}px`;
          // Add width from left sidenav as left offset
          this.containerLeftOffset = `${
            this._host.el.nativeElement.offsetLeft +
            this._host.sidenav.get(0).nativeElement.offsetWidth
          }px`;
          this.containerTopOffset = `${this._host.el.nativeElement.offsetTop}px`;
        } else {
          this.containerWidth = `${this._host.el.nativeElement.offsetWidth}px`;
          this.containerHeight = `${this._host.el.nativeElement.offsetHeight}px`;
          this.containerLeftOffset = `${this._host.el.nativeElement.offsetLeft}px`;
          this.containerTopOffset = `${this._host.el.nativeElement.offsetTop}px`;
        }
      }
    }
    // force change detection
    this.changeDetectorRef.detectChanges();
  }
}
