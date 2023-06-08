import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
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
import localForage from 'localforage';
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
  selector: 'safe-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class DashboardFilterComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy
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
  public filterPosition = FilterPosition;
  public containerWidth!: string;
  public containerHeight!: string;
  public containerTopOffset!: string;
  public containerLeftOffset!: string;
  private value: any;

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

  /**
   * Class constructor
   *
   * @param uiSidenav MatDrawerContent
   * @param hostElement Host/Component Element
   * @param dialog The material dialog service
   * @param apollo Apollo client
   * @param applicationService Shared application service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param contextService Context service
   * @param ngZone Triggers html changes
   */
  constructor(
    @Optional() private uiSidenav: SidenavContainerComponent,
    private hostElement: ElementRef<HTMLElement>,
    private dialog: Dialog,
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private contextService: ContextService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngOnInit(): void {
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
          localForage
            .getItem(this.applicationId + 'contextualFilter')
            .then((contextualFilter) => {
              if (contextualFilter) {
                this.surveyStructure = contextualFilter;
                this.initSurvey();
              } else if (application.contextualFilter) {
                this.surveyStructure = application.contextualFilter;
                this.initSurvey();
              }
            });
          localForage
            .getItem(this.applicationId + 'contextualFilterPosition')
            .then((contextualFilterPosition) => {
              if (contextualFilterPosition) {
                this.position = contextualFilterPosition as FilterPosition;
              } else if (application.contextualFilterPosition) {
                this.position = application.contextualFilterPosition;
              } else {
                this.position = FilterPosition.BOTTOM; //case where there are no default position set up
              }
            });
        }
      });
    this.setFilterContainerDimensions();
  }

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
              localForage.setItem(
                this.applicationId + 'contextualFilter',
                this.surveyStructure
              );
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

    this.survey.showCompletedPage = false;
    this.survey.showNavigationButtons = false;

    this.survey.onValueChanged.add(this.onValueChange.bind(this));
    this.survey.onAfterRenderSurvey.add(this.onAfterRenderSurvey.bind(this));

    this.survey.render(this.dashboardSurveyCreatorContainer?.nativeElement);
  }

  /**
   * Set the available filters of dashboard filter in the shared context service
   */
  private setAvailableFiltersForContext() {
    const questions = this.survey.getAllQuestions().length
      ? this.survey
          .getAllQuestions()
          .map((question) => ({ [question.name]: question.value }))
      : null;

    if (questions) {
      let questionsObj = {};
      questions.forEach((q) => {
        questionsObj = {
          ...questionsObj,
          ...q,
        };
      });
      this.contextService.availableFilterFields = questionsObj;
    }
  }

  /**
   * Subscribe to survey render to see if survey is empty or not.
   *
   * @param survey survey model
   */
  public onAfterRenderSurvey(survey: Survey.SurveyModel) {
    this.empty = !(survey.getAllQuestions().length > 0);
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
          localForage.setItem(
            this.applicationId + 'contextualFilterPosition',
            defaultPosition
          );
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
   * Updates the filter in the context service with the latest survey data
   * when a value changes.
   */
  private onValueChange() {
    const surveyData = this.survey.data;
    const displayValues = this.survey.getPlainData();
    this.contextService.filter.next(surveyData);
    this.ngZone.run(() => {
      this.quickFilters = displayValues
        .filter((question) => !!question.value)
        .map((question: any) => {
          let mappedQuestion;
          if (question.value instanceof Array && question.value.length > 2) {
            mappedQuestion = {
              label: question.title + ` (${question.value.length})`,
              tooltip: question.displayValue,
            };
          } else {
            mappedQuestion = {
              label: question.displayValue,
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
    const parentRect = this.getParentReferenceClientRect();
    this.containerWidth = `${parentRect?.width}px`;
    this.containerHeight = `${parentRect?.height}px`;
    this.containerLeftOffset = `${parentRect?.x}px`;
    this.containerTopOffset = `${parentRect?.y}px`;
  }

  /**
   * Get current parent DOM client rect reference
   *
   * @returns DOMRect | undefined
   */
  private getParentReferenceClientRect() {
    // If no sidenav wrapper, default behavior would be filter horizontal sidenav Content
    let parentRect = this.document
      .getElementById('horizontalSidenavContent')
      ?.getBoundingClientRect();
    if (this.uiSidenav) {
      parentRect = this.uiSidenav.content.nativeElement.getBoundingClientRect();
    }
    return parentRect;
  }
}
