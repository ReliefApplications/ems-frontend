import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, pairwise } from 'rxjs';
import localForage from 'localforage';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { cloneDeep } from '@apollo/client/utilities';
import { isNil, isEmpty, get, isEqual, isObject, merge } from 'lodash';
import { DashboardService } from '../dashboard/dashboard.service';
import {
  Dashboard,
  EditDashboardMutationResponse,
} from '../../models/dashboard.model';
import { FilterPosition } from '../../components/dashboard-filter/enums/dashboard-filters.enum';
import { Dialog } from '@angular/cdk/dialog';
import { EDIT_DASHBOARD_FILTER } from './graphql/mutations';
import { Apollo } from 'apollo-angular';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { SurveyModel } from 'survey-core';
import { FormBuilderService } from '../form-builder/form-builder.service';
import { ApplicationService } from '../application/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordQueryResponse } from '../../models/record.model';
import { GET_RECORD_BY_ID } from './graphql/queries';

/**
 * Dashboard context service
 * Used to get filter value
 */
@Injectable({
  providedIn: 'root',
})
export class ContextService {
  /** Current dashboard filter available questions*/
  public availableFilterFields: {
    name: string;
    value: string;
  }[] = [];

  /** To update/keep the current filter */
  public filter = new BehaviorSubject<Record<string, any>>({});
  /** To update/keep the current filter structure  */
  public filterStructure = new BehaviorSubject<any>(null);
  /** To update/keep the current filter position  */
  public filterPosition = new BehaviorSubject<any>(null);
  /** Is filter opened */
  public filterOpened = new BehaviorSubject<boolean>(false);
  /** Regex used to allow widget refresh */
  public filterRegex = /{{filter\.[^}]+}}/;
  /** Dashboard object */
  public dashboard?: Dashboard;
  /** Available filter positions */
  public positionList = [
    FilterPosition.LEFT,
    FilterPosition.TOP,
    FilterPosition.BOTTOM,
    FilterPosition.RIGHT,
  ] as const;
  /** Has the translation for the tooltips of each button */
  public FilterPositionTooltips: Record<FilterPosition, string> = {
    [FilterPosition.LEFT]:
      'components.application.dashboard.filter.filterPosition.left',
    [FilterPosition.TOP]:
      'components.application.dashboard.filter.filterPosition.top',
    [FilterPosition.BOTTOM]:
      'components.application.dashboard.filter.filterPosition.bottom',
    [FilterPosition.RIGHT]:
      'components.application.dashboard.filter.filterPosition.right',
  };

  /** @returns filter value as observable */
  get filter$() {
    return this.filter.asObservable().pipe(
      pairwise(),
      // We only emit a filter value if filter value changes and we send back the actual(curr) value
      filter(
        ([prev, curr]: [Record<string, any>, Record<string, any>]) =>
          !isEqual(prev, curr)
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map(([prev, curr]: [Record<string, any>, Record<string, any>]) => curr)
    );
  }

  /** @returns filterStructure value as observable */
  get filterStructure$() {
    return this.filterStructure.asObservable();
  }

  /** @returns filterPosition value as observable */
  get filterPosition$() {
    return this.filterPosition.asObservable();
  }

  /** @returns filterOpened value as observable */
  get filterOpened$() {
    return this.filterOpened.asObservable();
  }

  /** @returns key for storing position of filter */
  get positionKey(): string {
    return this.dashboard?.id + ':filterPosition';
  }

  /** Used to update the state of whether the filter is enabled */
  public isFilterEnabled = new BehaviorSubject<boolean>(false);

  /** @returns  isFilterEnable value as observable */
  get isFilterEnabled$() {
    return this.isFilterEnabled.asObservable();
  }

  /** @returns current question values from the filter */
  get availableFilterFieldsValue(): Record<string, any> {
    return this.filter.getValue();
  }

  /** Current dashboard context */
  public context: {
    [key: string]: any;
  } | null = null;

  /**
   * Dashboard context service
   *
   * @param dashboardService Shared dashboard service
   * @param dialog The Dialog service
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param formBuilderService Form builder service
   * @param applicationService Shared application service
   * @param router Angular router
   */
  constructor(
    private dashboardService: DashboardService,
    private dialog: Dialog,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private formBuilderService: FormBuilderService,
    private applicationService: ApplicationService,
    private router: Router
  ) {
    this.dashboardService.dashboard$.subscribe(
      (dashboard: Dashboard | null) => {
        if (dashboard) {
          if (this.dashboard?.id !== dashboard.id) {
            this.dashboard = dashboard;
          }
          this.filterStructure.next(dashboard.filter?.structure);
          localForage.getItem(this.positionKey).then((position) => {
            if (position) {
              this.filterPosition.next(position);
            } else {
              this.filterPosition.next(
                dashboard.filter?.position ?? FilterPosition.BOTTOM
              );
            }
          });
        } else {
          this.filterStructure.next(null);
          this.filterPosition.next(null);
          this.dashboard = undefined;
        }
      }
    );
    this.filterPosition$.subscribe((position: any) => {
      if (position && this.dashboard?.id) {
        localForage.setItem(this.positionKey, position);
      }
    });
    this.applicationService.application$.subscribe((value) => {
      if (!value) {
        // Reset filter when leaving application
        this.filter.next({});
      }
    });
  }

  /**
   * Replace {{context}} placeholders in object, with context values
   *
   * @param object object with placeholders
   * @returns object with replaced placeholders
   */
  public replaceContext(object: any): any {
    const context = this.context;
    if (!context) {
      return object;
    }
    const regex = /{{context\.(.*?)}}/g;
    return JSON.parse(
      JSON.stringify(object).replace(regex, (match) => {
        const field = match.replace('{{context.', '').replace('}}', '');
        return get(context, field) || match;
      })
    );
  }

  /**
   * Injects current context into an object.
   *
   * @param f filter to inject context into
   * @returns filter with values from context
   */
  public injectContext<T extends CompositeFilterDescriptor | FilterDescriptor>(
    f: T
  ): T {
    const filter = cloneDeep(f);
    // if (!this.isFilterEnabled.getValue() && 'filters' in filter) {
    //   filter.filters = [];
    //   return filter;
    // }
    // Regex to detect {{filter.}} in object
    const filterRegex = /(?<={{filter\.)(.*?)(?=}})/gim;
    // Regex to detect {{context.}} in object
    const contextRegex = /(?<={{context\.)(.*?)(?=}})/gim;

    if ('field' in filter && filter.field) {
      // If it's a filter descriptor, replace value ( if string )
      if (filter.value && typeof filter.value === 'string') {
        const filterName = filter.value?.match(filterRegex)?.[0];
        if (filterName) {
          filter.value = get(this.availableFilterFieldsValue, filterName);
        } else {
          const contextName = filter.value?.match(contextRegex)?.[0];
          if (contextName) {
            filter.value = get(this.context, contextName);
          }
        }
      }
    } else if ('filters' in filter && filter.filters) {
      // If it's a composite filter, replace values in filters
      filter.filters = filter.filters
        .map((f) => this.injectContext(f))
        .filter((f) => {
          // Filter out fields that are not in the available filter field
          // Meaning, their values are still using the {{filter.}} syntax
          if ('value' in f) {
            return isObject(f.value)
              ? !isNil(f.value) && !isEmpty(f.value)
              : !isNil(f.value);
          } else {
            return true;
          }
        });
    }
    return filter;
  }

  /**
   * Get the 'at' argument value from the filter field selected
   *
   * @param atField filter field that should be used as 'at' param
   * @returns 'at' value
   */
  public atArgumentValue(atField: string): Date | undefined {
    if (this.isFilterEnabled.getValue()) {
      const regex = /(?<={{filter\.)(.*?)(?=}})/gim;
      const atFilterName = atField.match(regex)?.[0] ?? '';
      if (get(this.availableFilterFieldsValue, atFilterName)) {
        return new Date(get(this.availableFilterFieldsValue, atFilterName));
      }
    }
    return undefined;
  }

  /**
   * Opens the modal to edit filters
   */
  public onEditFilter() {
    import(
      '../../components/dashboard-filter/filter-builder-modal/filter-builder-modal.component'
    ).then(({ FilterBuilderModalComponent }) => {
      const dialogRef = this.dialog.open(FilterBuilderModalComponent, {
        data: { surveyStructure: this.filterStructure.getValue() },
        autoFocus: false,
      });
      dialogRef.closed.subscribe((newStructure) => {
        if (newStructure) {
          this.filterStructure.next(newStructure);
          this.initSurvey();
          this.saveFilter();
        }
      });
    });
  }

  /**
   * Render the survey using the saved structure
   *
   * @returns survey model created from the structure
   */
  public initSurvey(): SurveyModel {
    const surveyStructure = this.filterStructure.getValue();
    const survey = this.formBuilderService.createSurvey(surveyStructure);

    // get questions default value
    const data = survey
      .getAllQuestions()
      .reduce(function (result: any, question: any) {
        result[question.name] = question.defaultValue;
        return result;
      }, {});

    // merge filter values with default values
    if (!isEmpty(this.filter.getValue())) {
      merge(data, this.filter.getValue());
    }

    survey.data = data;
    return survey;
  }

  /**
   * If context data exists, returns an object containing context content mapped settings and widget's original settings
   *
   * @param settings Widget settings
   * @returns context content mapped settings and original settings
   */
  public updateSettingsContextContent(settings: any): {
    settings: any;
    originalSettings?: any;
  } {
    if (this.dashboard?.contextData) {
      // If tile has context, replace the templates with the values
      // and keep the original, to be used for the widget settings
      const mappedContextContentSettings = this.replaceContext(settings);
      const originalSettings = settings;
      return { settings: mappedContextContentSettings, originalSettings };
    }
    // else return settings as given
    return { settings };
  }

  /**
   * Handle dashboard context change by simply updating the url.
   *
   * @param value id of the element or record
   * @param contextType type of context element
   * @param route Angular current page
   */
  public onContextChange(
    value: string | number | undefined | null,
    contextType: 'record' | 'element' | undefined,
    route: ActivatedRoute
  ): void {
    if (
      !this.dashboard?.id ||
      !this.dashboard?.page?.id ||
      !this.dashboard.page.context ||
      !contextType
    )
      return;
    if (value) {
      this.router.navigate(['.'], {
        relativeTo: route,
        queryParams: {
          id: value,
        },
      });
      // const urlArr = this.router.url.split('/');
      // urlArr[urlArr.length - 1] = `${parentDashboardId}?id=${value}`;
      // this.router.navigateByUrl(urlArr.join('/'));
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'models.dashboard.context.notifications.loadDefault'
        )
      );
      this.router.navigate(['.'], { relativeTo: route });
      // const urlArr = this.router.url.split('/');
      // urlArr[urlArr.length - 1] = parentDashboardId;
      // this.router.navigateByUrl(urlArr.join('/'));
    }
  }

  /**
   * Initializes the dashboard context
   *
   * @param callback additional callback
   */
  public initContext(callback: any): void {
    if (!this.dashboard?.page?.context || !this.dashboard?.id) return;
    // Checks if the dashboard has context attached to it
    const contentWithContext = this.dashboard?.page?.contentWithContext || [];
    const id = this.dashboard.id;
    const dContext = contentWithContext.find((c) => c.content === id);

    if (!dContext) return;

    if ('element' in dContext) {
      // Returns context element
      callback({ element: dContext.element });
    } else if ('record' in dContext) {
      // Get record by id
      this.apollo
        .query<RecordQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: dContext.record,
          },
        })
        .subscribe((res) => {
          if (res?.data) {
            callback({
              record: dContext.record,
              recordData: res.data.record,
            });
          }
        });
    }
  }

  /** Saves the dashboard contextual filter using the editDashboard mutation */
  private saveFilter(): void {
    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD_FILTER,
        variables: {
          id: this.dashboard?.id,
          filter: {
            ...this.dashboard?.filter,
            structure: this.filterStructure.getValue(),
          },
        },
      })
      .subscribe(({ errors, data }) => {
        this.handleFilterMutationResponse({ data, errors });
      });
  }

  /**
   * Handle filter update mutation response depending of mutation type, for filter structure or position
   *
   * @param response Graphql mutation response
   * @param response.data response data
   * @param response.errors response errors
   * @param defaultPosition filter position
   */
  private handleFilterMutationResponse(
    response: { data: any; errors: any },
    defaultPosition?: FilterPosition
  ) {
    const { data, errors } = response;
    if (errors) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectNotUpdated', {
          type: this.translate.instant('common.filter.one'),
          error: errors ? errors[0].message : '',
        }),
        { error: true }
      );
    } else {
      if (defaultPosition) {
        this.filterPosition.next(defaultPosition);
      } else {
        this.filterStructure.next(data.editDashboard.filter?.structure);
      }
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectUpdated', {
          type: this.translate.instant('common.filter.one').toLowerCase(),
          value: data?.editDashboard.name ?? '',
        })
      );
    }
  }
}
