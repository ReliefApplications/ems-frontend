import {
  addGridTeardown,
  destroyGrid,
  registerGridForCleanup,
} from './grid-cleanup';

/**
 * Builds a fake survey exposing a spied `dispose` method, mimicking the
 * SurveyModel surface the utility relies on.
 *
 * @returns Fake survey with a jest-mocked `dispose`
 */
const createFakeSurvey = () => {
  const dispose = jest.fn();
  return { dispose } as any;
};

/**
 * Builds a fake grid component reference.
 *
 * @param id Identifier to tell refs apart in assertions
 * @returns Fake grid ref
 */
const createFakeGrid = (id: number) => ({ id } as any);

/**
 * Builds a fake DomService with a spied `removeComponentFromBody`.
 *
 * @returns Fake DomService
 */
const createFakeDomService = () =>
  ({ removeComponentFromBody: jest.fn() } as any);

describe('grid-cleanup', () => {
  describe('registerGridForCleanup', () => {
    it('destroys every registered grid when the survey is disposed', () => {
      const survey = createFakeSurvey();
      const originalDispose = survey.dispose;
      const domService = createFakeDomService();
      const grid1 = createFakeGrid(1);
      const grid2 = createFakeGrid(2);

      registerGridForCleanup(survey, grid1, domService);
      registerGridForCleanup(survey, grid2, domService);

      survey.dispose();

      expect(domService.removeComponentFromBody).toHaveBeenCalledTimes(2);
      expect(domService.removeComponentFromBody).toHaveBeenCalledWith(grid1);
      expect(domService.removeComponentFromBody).toHaveBeenCalledWith(grid2);
      // The original dispose still runs, exactly once.
      expect(originalDispose).toHaveBeenCalledTimes(1);
    });

    it('runs attached teardown callbacks on dispose', () => {
      const survey = createFakeSurvey();
      const domService = createFakeDomService();
      const grid = createFakeGrid(1);
      const teardown = jest.fn();

      registerGridForCleanup(survey, grid, domService);
      addGridTeardown(grid, teardown);

      survey.dispose();

      expect(teardown).toHaveBeenCalledTimes(1);
    });

    it('patches dispose only once regardless of how many grids register', () => {
      const survey = createFakeSurvey();
      const patchedAfterNothing = survey.dispose;
      const domService = createFakeDomService();

      registerGridForCleanup(survey, createFakeGrid(1), domService);
      const patchedOnce = survey.dispose;
      registerGridForCleanup(survey, createFakeGrid(2), domService);
      const patchedTwice = survey.dispose;

      expect(patchedOnce).not.toBe(patchedAfterNothing); // patched on first call
      expect(patchedTwice).toBe(patchedOnce); // not re-patched on second
    });

    it('is a no-op when survey or grid is missing', () => {
      const domService = createFakeDomService();
      expect(() =>
        registerGridForCleanup(undefined, createFakeGrid(1), domService)
      ).not.toThrow();
      const survey = createFakeSurvey();
      const originalDispose = survey.dispose;
      registerGridForCleanup(survey, undefined, domService);
      // Dispose was not patched, so no tracking set was created.
      expect(survey.dispose).toBe(originalDispose);
    });

    it('is a no-op when the survey has no dispose method', () => {
      const domService = createFakeDomService();
      const surveyWithoutDispose = {} as any;
      expect(() =>
        registerGridForCleanup(
          surveyWithoutDispose,
          createFakeGrid(1),
          domService
        )
      ).not.toThrow();
    });

    it('swallows teardown and removal errors so dispose still completes', () => {
      const survey = createFakeSurvey();
      const originalDispose = survey.dispose;
      const domService = createFakeDomService();
      domService.removeComponentFromBody.mockImplementation(() => {
        throw new Error('already detached');
      });
      const grid = createFakeGrid(1);
      addGridTeardown(grid, () => {
        throw new Error('boom');
      });

      registerGridForCleanup(survey, grid, domService);

      expect(() => survey.dispose()).not.toThrow();
      expect(originalDispose).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroyGrid', () => {
    it('removes the grid, runs its teardown and stops tracking it', () => {
      const survey = createFakeSurvey();
      const domService = createFakeDomService();
      const grid = createFakeGrid(1);
      const teardown = jest.fn();

      registerGridForCleanup(survey, grid, domService);
      addGridTeardown(grid, teardown);

      destroyGrid(survey, grid, domService);

      expect(teardown).toHaveBeenCalledTimes(1);
      expect(domService.removeComponentFromBody).toHaveBeenCalledTimes(1);
      expect(domService.removeComponentFromBody).toHaveBeenCalledWith(grid);

      // After destroyGrid unregistered it, disposing must not destroy it again.
      survey.dispose();
      expect(domService.removeComponentFromBody).toHaveBeenCalledTimes(1);
    });

    it('is a no-op when the grid ref is undefined', () => {
      const survey = createFakeSurvey();
      const domService = createFakeDomService();
      expect(() => destroyGrid(survey, undefined, domService)).not.toThrow();
      expect(domService.removeComponentFromBody).not.toHaveBeenCalled();
    });
  });

  describe('addGridTeardown', () => {
    it('accumulates multiple teardown callbacks and runs them all once', () => {
      const survey = createFakeSurvey();
      const domService = createFakeDomService();
      const grid = createFakeGrid(1);
      const first = jest.fn();
      const second = jest.fn();

      addGridTeardown(grid, first);
      addGridTeardown(grid, second);
      registerGridForCleanup(survey, grid, domService);

      survey.dispose();

      expect(first).toHaveBeenCalledTimes(1);
      expect(second).toHaveBeenCalledTimes(1);
    });
  });
});
