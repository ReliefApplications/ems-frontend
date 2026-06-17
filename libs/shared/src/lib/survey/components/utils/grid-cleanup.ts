import { ComponentRef } from '@angular/core';
import { SurveyModel } from 'survey-core';
import { DomService } from '../../../services/dom/dom.service';

/** Key under which the set of active grid refs is tracked on a survey. */
const GRID_REFS_KEY = '__resourceGridRefs';
/** Key under which a grid ref's teardown callbacks are stored. */
const TEARDOWN_KEY = '__teardown';

/** A grid component reference, with optional attached teardown callbacks. */
type GridRef = ComponentRef<any> & { [TEARDOWN_KEY]?: Array<() => void> };

/**
 * Attaches a teardown callback to a grid ref, to be run when the grid is
 * destroyed ( e.g. unsubscribe a subscription, remove an event handler ).
 *
 * @param gridRef Grid component reference
 * @param teardown Callback to run on destruction
 */
export const addGridTeardown = (
  gridRef: GridRef,
  teardown: () => void
): void => {
  const list = gridRef[TEARDOWN_KEY] ?? [];
  list.push(teardown);
  gridRef[TEARDOWN_KEY] = list;
};

/**
 * Runs and clears a grid ref's teardown callbacks.
 *
 * @param gridRef Grid component reference
 */
const runTeardown = (gridRef: GridRef): void => {
  (gridRef[TEARDOWN_KEY] ?? []).forEach((fn) => {
    try {
      fn();
    } catch {
      /* ignore teardown errors */
    }
  });
  gridRef[TEARDOWN_KEY] = [];
};

/**
 * Registers a grid so it is fully destroyed when its survey is disposed.
 *
 * Grids are appended through {@link DomService} and attached to the Angular
 * `ApplicationRef`, so they are NOT released when the survey is disposed and
 * leak after the form / modal is closed. This patches the survey's `dispose`
 * ( once ) to tear down every tracked grid first.
 *
 * @param survey Survey owning the grid
 * @param gridRef Grid component reference
 * @param domService DOM service used to detach / destroy the component
 */
export const registerGridForCleanup = (
  survey: SurveyModel | undefined,
  gridRef: GridRef | undefined,
  domService: DomService
): void => {
  if (!survey || !gridRef) {
    return;
  }
  const host = survey as SurveyModel & Record<string, any>;
  if (!host[GRID_REFS_KEY]) {
    const refs = new Set<GridRef>();
    host[GRID_REFS_KEY] = refs;
    const originalDispose = survey.dispose.bind(survey);
    // Patch dispose once: destroy every tracked grid before the survey is gone.
    survey.dispose = (...args: any[]) => {
      refs.forEach((ref) => {
        runTeardown(ref);
        try {
          domService.removeComponentFromBody(ref);
        } catch {
          /* component already detached */
        }
      });
      refs.clear();
      return (originalDispose as (...a: any[]) => void)(...args);
    };
  }
  host[GRID_REFS_KEY].add(gridRef);
};

/**
 * Destroys a single grid: runs its teardown callbacks, detaches / destroys the
 * Angular component and stops tracking it on its survey. Use this instead of
 * calling `domService.removeComponentFromBody` directly so subscriptions and
 * event handlers are released as well.
 *
 * @param survey Survey owning the grid
 * @param gridRef Grid component reference ( no-op if undefined )
 * @param domService DOM service used to detach / destroy the component
 */
export const destroyGrid = (
  survey: SurveyModel | undefined,
  gridRef: GridRef | undefined,
  domService: DomService
): void => {
  if (!gridRef) {
    return;
  }
  runTeardown(gridRef);
  const refs: Set<GridRef> | undefined = (survey as any)?.[GRID_REFS_KEY];
  refs?.delete(gridRef);
  try {
    domService.removeComponentFromBody(gridRef);
  } catch {
    /* component already detached */
  }
};
