import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, pairwise } from 'rxjs';
import localForage from 'localforage';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { cloneDeep } from '@apollo/client/utilities';
import {
  isNil,
  isEmpty,
  get,
  isEqual,
  isObject,
  set,
  has,
  isArray,
  every,
  mapValues,
  mergeWith,
  uniq,
  isString,
} from 'lodash';
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
import { DashboardState } from '../../models/dashboard.model';
import { DashboardService } from '../dashboard/dashboard.service';

/**
 * Dashboard context service
 * Used to get filter value
 */
@Injectable({
  providedIn: 'root',
})
export class ContextService {
  /** To update/keep the current filter */
  public filter = new BehaviorSubject<Record<string, any>>({});
  /** To update/keep the current filter structure  */
  public filterStructure = new BehaviorSubject<any>(null);
  /** To update/keep the current filter position  */
  public filterPosition = new BehaviorSubject<{
    position: FilterPosition;
    dashboardId: string;
  } | null>(null);
  /** Dashboard state regex */
  public dashboardStateRegex = /(?<={{dashboard\.)(.*?)(?=}})/gim;
  /** To keep the history of previous dashboard filter values */
  public filterValues = new BehaviorSubject<any>(null);
  /** Is filter opened */
  public filterOpened = new BehaviorSubject<boolean>(false);
  /** Regex used to allow widget refresh */
  public filterRegex = /["']?{{filter\.(.*?)}}["']?/;
  /** Regex to detect the value of {{filter.}} in object */
  public filterValueRegex = /(?<={{filter\.)(.*?)(?=}})/gim;
  /** Context regex */
  public contextRegex = /{{context\.(.*?)}}/;
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
  /** Resource update to trigger widgets refresh if necessary */
  public resourceId?: string;

  /** @returns filter value as observable */
  get filter$() {
    return this.filter.pipe(
      pairwise(),
      // We only emit a filter value if filter value changes and we send back the actual(curr) value
      // ot if exists a resourceId update that should trigger widgets that use it refresh
      filter(
        ([prev, curr]: [Record<string, any>, Record<string, any>]) =>
          !isEqual(prev, curr) || !isNil(this.resourceId)
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map(([prev, curr]: [Record<string, any>, Record<string, any>]) => ({
        previous: prev,
        current: curr,
        resourceId: this.resourceId,
      }))
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

  /** @returns filterValues value as observable */
  get filterValues$() {
    return this.filterValues.asObservable();
  }

  /** @returns filterOpened value as observable */
  get filterOpened$() {
    return this.filterOpened.asObservable();
  }

  /** Used to update the state of whether the filter is enabled */
  public isFilterEnabled = new BehaviorSubject<boolean>(false);

  /** @returns  isFilterEnable value as observable */
  get isFilterEnabled$() {
    return this.isFilterEnabled.asObservable();
  }

  /** Current dashboard context */
  public context: {
    [key: string]: any;
  } | null = null;

  /**
   * Dashboard context service
   *
   * @param dialog The Dialog service
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param formBuilderService Form builder service
   * @param applicationService Shared application service
   * @param router Angular router
   * @param dashboardService Shared dashboard service
   */
  constructor(
    private dialog: Dialog,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private formBuilderService: FormBuilderService,
    private applicationService: ApplicationService,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.filterPosition$.subscribe(
      (value: { position: FilterPosition; dashboardId: string } | null) => {
        if (value && value.position && value.dashboardId) {
          localForage.setItem(
            this.positionKey(value.dashboardId),
            value.position
          );
        }
      }
    );
    this.applicationService.application$.subscribe((value) => {
      if (!value) {
        // Reset filter when leaving application
        this.filter.next({});
      }
    });
  }

  /**
   * Sets the filter to match the one of the dashboard
   *
   * @param dashboard dashboard to get filter from
   */
  public setFilter(dashboard?: Dashboard) {
    {
      if (dashboard && dashboard.id) {
        this.filterStructure.next(dashboard.filter?.structure);
        localForage.getItem(this.positionKey(dashboard.id)).then((position) => {
          if (position) {
            this.filterPosition.next({
              position: position as FilterPosition,
              dashboardId: dashboard.id ?? '',
            });
          } else {
            this.filterPosition.next({
              position:
                (dashboard.filter?.position as FilterPosition) ??
                FilterPosition.BOTTOM,
              dashboardId: dashboard.id ?? '',
            });
          }
        });
      } else {
        this.filterStructure.next(null);
        this.filterPosition.next(null);
      }
    }
  }

  /**
   * Return the filter position key
   *
   * @param dashboardId Current dashboard id
   * @returns key for storing position of filter
   */
  private positionKey(dashboardId?: string): string {
    return dashboardId + ':filterPosition';
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
    return JSON.parse(
      JSON.stringify(object).replace(
        new RegExp(this.contextRegex, 'g'),
        (match) => {
          const field = match.replace('{{context.', '').replace('}}', '');
          return get(context, field) || match;
        }
      )
    );
  }

  /**
   * Parse JSON values of object.
   *
   * @param obj object to transform
   * @returns object, where string properties that can be transformed to objects, are returned as objects
   */
  private parseJSONValues(obj: any): any {
    return mapValues(obj, (value: any) => {
      if (isString(value)) {
        try {
          return isObject(JSON.parse(value)) ? JSON.parse(value) : value;
        } catch (error) {
          // If parsing fails, return the original string value
          return value;
        }
      } else if (isArray(value)) {
        // If the value is an array, recursively parse each element
        return value.map((element: any) => this.parseJSONValues(element));
      } else if (isObject(value)) {
        // If the value is an object, recursively parse it
        return this.parseJSONValues(value);
      } else {
        // If the value is neither a string nor an object, return it as is
        return value;
      }
    });
  }

  /**
   * Replace {{filter}} placeholders in object, with filter values
   *
   * @param object object with placeholders
   * @param filter filter value
   * @returns object with replaced placeholders
   */
  public replaceFilter(
    object: any,
    filter = this.filterValue(this.filter.getValue())
  ): any {
    if (isEmpty(filter)) {
      return this.parseJSONValues(object);
    }
    // Transform all string fields into object ones when possible
    const objectAsJSON = this.parseJSONValues(object);
    const toString = JSON.stringify(objectAsJSON);
    const replaced = toString.replace(
      new RegExp(this.filterRegex, 'g'),
      (match) => {
        const field = match
          .replace(/["']?\{\{filter\./, '')
          .replace(/\}\}["']?/, '');
        const fieldValue = get(filter, field);
        return isNil(fieldValue) ? match : JSON.stringify(fieldValue);
      }
    );
    const parsed = JSON.parse(replaced);
    return parsed;
  }

  /**
   * Remove placeholders from object
   *
   * @param obj object to clean
   */
  public removeEmptyPlaceholders(obj: any) {
    for (const key in obj) {
      if (has(obj, key)) {
        if (isArray(obj[key])) {
          // If the value is an array, recursively parse each element
          obj[key].forEach((element: any) => {
            this.removeEmptyPlaceholders(element);
          });
          obj[key] = obj[key].filter((element: any) =>
            isObject(element) ? !isEmpty(element) : true
          );
        } else if (isObject(obj[key])) {
          // Recursively call the function for nested objects
          this.removeEmptyPlaceholders(obj[key]);
        } else if (
          isString(obj[key]) &&
          obj[key].startsWith('{{') &&
          obj[key].endsWith('}}')
        ) {
          delete obj[key];
        }
      }
    }
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
    const filterValue = this.filterValue(this.filter.getValue());
    // Regex to detect {{filter.}} in object
    const filterRegex = this.filterValueRegex;
    // Regex to detect {{context.}} in object
    const contextRegex = /(?<={{context\.)(.*?)(?=}})/gim;
    // Regex to detect {{application.}} in object
    const applicationRegex = /(?<={{application\.)(.*?)(?=}})/gim;

    if ('field' in filter && filter.field) {
      // If it's a filter descriptor, replace value ( if string )
      if (filter.value && typeof filter.value === 'string') {
        const stateName = filter.value?.match(this.dashboardStateRegex)?.[0];
        const filterName = filter.value?.match(filterRegex)?.[0];
        const contextName = filter.value?.match(contextRegex)?.[0];
        const appField = filter.value?.match(applicationRegex)?.[0];
        if (filterName) {
          filter.value = get(filterValue, filterName);
        } else if (contextName) {
          filter.value = get(this.context, contextName);
        } else if (appField) {
          filter.value = get(
            this.applicationService.application.getValue(),
            appField
          );
        } else if (stateName) {
          const states = this.dashboardService.states.getValue();
          filter.value = states.find(
            (state: DashboardState) => state.name === stateName
          )?.value;
        }
      }
    } else if ('filters' in filter && filter.filters) {
      // If it's a composite filter, replace values in filters
      filter.filters = filter.filters
        .map((f) => this.injectContext(f))
        .filter((f) => {
          // Filter out fields that are not in the available filter field
          // Meaning, their values are still using the {{filter.}} syntax
          if ('value' in f && !f.field?.toString().startsWith('__FILTER__.')) {
            // @TODO: Figure out better way of sending filters to aggregation queries
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
      const filterValue = this.filterValue(this.filter.getValue());
      if (get(filterValue, atFilterName)) {
        return new Date(get(filterValue, atFilterName));
      }
    }
    return undefined;
  }

  /**
   * Opens the modal to edit filters
   *
   * @param dashboard Current dashboard
   */
  public onEditFilter(dashboard?: Dashboard) {
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
          this.saveFilter(dashboard);
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

    // set each question value manually otherwise the defaultValueExpression is not loaded
    // commented this out because was causing an error when navigating between dashboards
    // in case they had resource questions
    // It also didn't seem to be necessary, as even when without it, the defaultValueExpression was still being loaded
    // forEach(this.filterValues.getValue(), (value, key) => {
    //   if (survey.getQuestionByName(key)) {
    //     survey.getQuestionByName(key).value = value;
    //   }
    // });

    // prevent the default value from being applied when a question has been intentionally cleared
    const handleValueChanged = (sender: any, options: any) => {
      const history = this.filterValues.getValue() ?? {};
      set(history, options.name, options.value);
      this.filterValues.next(history);
    };

    survey.onValueChanged.add(handleValueChanged);

    return survey;
  }

  /**
   * If context data exists, returns an object containing context content mapped settings and widget's original settings
   *
   * @param settings Widget settings
   * @param dashboard Current dashboard
   * @returns context content mapped settings and original settings
   */
  public updateSettingsContextContent(
    settings: any,
    dashboard?: Dashboard
  ): {
    settings: any;
    originalSettings?: any;
  } {
    if (dashboard?.contextData) {
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
   * @param route Angular current page
   * @param dashboard Current dashboard
   */
  public onContextChange(
    value: string | number | undefined | null,
    route: ActivatedRoute,
    dashboard?: Dashboard
  ): void {
    if (!dashboard?.id || !dashboard.page?.id || !dashboard.page.context) {
      return;
    }
    if (value) {
      this.router.navigate(['.'], {
        relativeTo: route,
        queryParams: {
          id: value,
          createIfMissing: true,
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
   * @param dashboard Current dashboard
   * @param callback additional callback
   */
  public initContext(dashboard: Dashboard, callback: any): void {
    if (!dashboard?.page?.context || !dashboard?.id) return;
    // Checks if the dashboard has context attached to it
    const contentWithContext = dashboard?.page?.contentWithContext || [];
    const id = dashboard.id;
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

  /**
   * Saves the dashboard contextual filter using the editDashboard mutation
   *
   * @param dashboard Current dashboard
   */
  private saveFilter(dashboard?: Dashboard): void {
    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD_FILTER,
        variables: {
          id: dashboard?.id,
          filter: {
            ...dashboard?.filter,
            structure: this.filterStructure.getValue(),
          },
        },
      })
      .subscribe(({ errors, data }) => {
        this.handleFilterMutationResponse({ data, errors }, dashboard);
      });
  }

  /**
   * Handle filter update mutation response depending of mutation type, for filter structure or position
   *
   * @param response Graphql mutation response
   * @param response.data response data
   * @param response.errors response errors
   * @param dashboard Current dashboard
   */
  private handleFilterMutationResponse(
    response: { data: any; errors: any },
    dashboard?: Dashboard
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
      if (dashboard?.filter?.position) {
        this.filterPosition.next({
          position: dashboard.filter.position as FilterPosition,
          dashboardId: dashboard.id ?? '',
        });
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

  /**
   * Should refresh widget, based on definition and previous & next filter values.
   * Compare if definitions of widget, injecting previous & next filter values, are the same.
   *
   * @param widget widget definition
   * @param previous previous filter value
   * @param current next filter value
   * @returns true if needs refresh
   */
  shouldRefresh(widget: any, previous: any, current: any) {
    if (
      !isEqual(
        this.replaceFilter(widget, this.filterValue(previous)),
        this.replaceFilter(widget, this.filterValue(current))
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Transforms form value into filter value that can be used by widgets.
   *
   * @param obj form value
   * @returns available filter value
   */
  public filterValue(obj: Record<string, any>): Record<string, any> {
    // Detect if property is a tagbox using non-primitive reference data
    const isTextAndFieldArray = (value: any) =>
      isArray(value) &&
      every(
        value,
        // In order to find tagbox using non-primitive reference data
        (item) => isObject(item) && has(item, 'text') && has(item, 'value')
      );
    // Transform the filter values, so tagbox using non-primitive reference data can be read.
    const transformFilter = (obj: any): any => {
      return mapValues(obj, (value) => {
        if (isTextAndFieldArray(value)) {
          const transformedValues = value.map((item: any) => item.value);
          const mergedObject = mergeWith(
            {},
            ...transformedValues,
            (objValue: any, srcValue: any) => {
              if (objValue) {
                if (isArray(objValue)) {
                  return objValue.concat(srcValue);
                } else {
                  return [srcValue];
                }
              } else {
                return [srcValue];
              }
            }
          );
          const resultObject: Record<string, any[]> = {};
          Object.keys(mergedObject).forEach((property) => {
            resultObject[property] = uniq(mergedObject[property]);
          });
          return resultObject;
        } else {
          return value;
        }
      });
    };
    return transformFilter(obj);
  }

  /**
   * Set resource id list and trigger filter change to update widgets, if necessary.
   *
   * @param resourceId resource updated
   */
  public setWidgets(resourceId?: string): void {
    this.resourceId = resourceId;
    if (this.resourceId) {
      this.filter.next(this.filter.getValue());
      setTimeout(() => {
        this.resourceId = undefined; // clear resource
      }, 500);
    }
  }
}
