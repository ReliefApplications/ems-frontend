import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FilterPosition } from './enums/dashboard-filters.enum';
import { Dialog } from '@angular/cdk/dialog';
import * as Survey from 'survey-angular';
import { Apollo } from 'apollo-angular';
import { SafeApplicationService } from '../../services/application/application.service';
import { Application } from '../../models/application.model';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import {
  EDIT_APPLICATION_FILTER,
  EDIT_APPLICATION_FILTER_POSITION,
  EditApplicationMutationResponse,
} from './graphql/mutations';
import { TranslateService } from '@ngx-translate/core';
import { ContextService } from '../../services/context/context.service';
import { SidenavContainerComponent, SnackbarService } from '@oort-front/ui';
import { SafeReferenceDataService } from '../../services/reference-data/reference-data.service';
import { renderGlobalProperties } from '../../survey/render-global-properties';

/**
 * Interface for quick filters
 */
interface QuickFilter {
  label: string;
  tooltip?: string;
}

/**  Dashboard contextual filter component. */
@Component({
  selector: 'safe-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class DashboardFilterComponent
  extends SafeUnsubscribeComponent
  implements OnDestroy, OnChanges, AfterViewInit
{
  // Filter
  position!: FilterPosition;
  public positionList = [
    FilterPosition.LEFT,
    FilterPosition.TOP,
    FilterPosition.BOTTOM,
    FilterPosition.RIGHT,
  ] as const;
  public isDrawerOpen = false;
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
  /** Represents the survey's value */
  private value: Record<string, any> | undefined;

  /** Resize observer for the sidenav container */
  private resizeObserver!: ResizeObserver;

  // Survey
  public survey: Survey.Model = new Survey.Model();
  public surveyStructure: any = {};
  @ViewChild('dashboardSurveyCreatorContainer')
  dashboardSurveyCreatorContainer!: ElementRef<HTMLElement>;
  public quickFilters: QuickFilter[] = [];

  public applicationId?: string;

  /** Indicate empty status of filter */
  public empty = true;

  @Input() editable = false;
  @Input() isFullScreen = false;

  /**
   * Class constructor
   *
   * @param dialog The Dialog service
   * @param apollo Apollo client
   * @param applicationService Shared application service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param contextService Context service
   * @param ngZone Triggers html changes
   * @param referenceDataService Reference data service
   * @param changeDetectorRef Change detector reference
   * @param _host sidenav container host
   */
  constructor(
    private dialog: Dialog,
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private contextService: ContextService,
    private ngZone: NgZone,
    private referenceDataService: SafeReferenceDataService,
    private changeDetectorRef: ChangeDetectorRef,
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.value = value;
      });
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.applicationId = application.id;
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
    this.isDrawerOpen = false;
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

  /**
   * Opens the modal to edit filters
   */
  public onEditFilter() {
    import('./filter-builder-modal/filter-builder-modal.component').then(
      ({ FilterBuilderModalComponent }) => {
        const dialogRef = this.dialog.open(FilterBuilderModalComponent, {
          data: { surveyStructure: this.surveyStructure },
          autoFocus: false,
        });
        dialogRef.closed
          .pipe(takeUntil(this.destroy$))
          .subscribe((newStructure) => {
            if (newStructure) {
              this.surveyStructure = newStructure;
              this.initSurvey();
              this.saveFilter();
            }
          });
      }
    );
  }

  /** Saves the application contextual filter using the editApplication mutation */
  private saveFilter(): void {
    this.apollo
      .mutate<EditApplicationMutationResponse>({
        mutation: EDIT_APPLICATION_FILTER,
        variables: {
          id: this.applicationId,
          contextualFilter: this.surveyStructure,
        },
      })
      .subscribe(({ errors, data }) => {
        if (errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectNotUpdated', {
              type: this.translate.instant('common.filter.one'),
              error: errors ? errors[0].message : '',
            }),
            { error: true }
          );
        } else {
          this.contextService.filterStructure.next(this.surveyStructure);
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectUpdated', {
              type: this.translate.instant('common.filter.one').toLowerCase(),
              value: data?.editApplication.name ?? '',
            })
          );
        }
      });
  }

  /** Render the survey using the saved structure */
  private initSurvey(): void {
    Survey.StylesManager.applyTheme();
    const surveyStructure = this.surveyStructure;
    this.survey = new Survey.Model(surveyStructure);

    if (this.value) {
      this.survey.data = this.value;
    }

    this.setAvailableFiltersForContext();

    this.survey.showCompletedPage = false; // Hide completed page from the survey
    this.survey.showNavigationButtons = false; // Hide navigation buttons from the survey

    this.survey.onValueChanged.add(this.onValueChange.bind(this));
    this.survey.onAfterRenderSurvey.add(this.onAfterRenderSurvey.bind(this));

    // we should render the custom questions somewhere, let's do it here
    this.survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.referenceDataService)
    );
    this.survey.render(this.dashboardSurveyCreatorContainer?.nativeElement);
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
  public onAfterRenderSurvey(survey: Survey.SurveyModel) {
    this.empty = survey.getAllQuestions().length === 0;
  }

  /**
   * Opens the settings modal
   */
  public openSettings() {
    import('./filter-settings-modal/filter-settings-modal.component').then(
      ({ FilterSettingsModalComponent }) => {
        const dialogRef = this.dialog.open(FilterSettingsModalComponent, {
          data: { positionList: this.positionList },
        });
        dialogRef.closed
          .pipe(takeUntil(this.destroy$))
          .subscribe((defaultPosition) => {
            if (defaultPosition) {
              this.saveSettings(defaultPosition as FilterPosition);
            }
          });
      }
    );
  }

  /**
   *  Saves the filter settings
   *
   * @param defaultPosition default position for the filter to be registered
   */
  private saveSettings(defaultPosition: FilterPosition): void {
    this.apollo
      .mutate<EditApplicationMutationResponse>({
        mutation: EDIT_APPLICATION_FILTER_POSITION,
        variables: {
          id: this.applicationId,
          contextualFilterPosition: defaultPosition,
        },
      })
      .subscribe(({ errors, data }) => {
        if (errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectNotUpdated', {
              type: this.translate.instant('common.filter.one'),
              error: errors ? errors[0].message : '',
            }),
            { error: true }
          );
        } else {
          this.position = defaultPosition;
          this.contextService.filterPosition.next(defaultPosition);
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectUpdated', {
              type: this.translate.instant('common.filter.one').toLowerCase(),
              value: data?.editApplication.name ?? '',
            })
          );
        }
      });
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
          [question.name]: question.isPrimitiveValue,
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
            mappedQuestion = {
              // If the value used is not primitive, use the text label to display selection in the filter
              label: !isValuePrimitiveKeys[
                question.name as keyof typeof isValuePrimitiveKeys
              ]
                ? question.displayValue.text
                : // else for primitive values, the selected display value
                  question.displayValue,
            };
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
            this._host.el.nativeElement.offsetWidth -
            this._host.sidenav.get(0).nativeElement.offsetWidth
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
