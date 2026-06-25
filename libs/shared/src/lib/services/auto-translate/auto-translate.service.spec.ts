import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { RestService } from '../rest/rest.service';
import { AutoTranslateService } from './auto-translate.service';

describe('AutoTranslateService', () => {
  let service: AutoTranslateService;
  let restService: { post: jest.Mock };

  beforeEach(() => {
    restService = { post: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AutoTranslateService,
        { provide: RestService, useValue: restService },
      ],
    });
    service = TestBed.inject(AutoTranslateService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('translateText', () => {
    it('returns an empty string without hitting the API for blank input', async () => {
      expect(await service.translateText('   ', 'en', 'fr')).toBe('');
      expect(restService.post).not.toHaveBeenCalled();
    });

    it('posts to /translate and unwraps the translation', async () => {
      restService.post.mockReturnValue(of({ translation: 'Bonjour' }));

      const result = await service.translateText('Hello', 'en', 'fr', 'plain');

      expect(restService.post).toHaveBeenCalledWith('/translate', {
        text: 'Hello',
        from: 'en',
        to: 'fr',
        format: 'plain',
      });
      expect(result).toBe('Bonjour');
    });

    it('sends null source language when none is provided (auto-detect)', async () => {
      restService.post.mockReturnValue(of({ translation: 'Bonjour' }));

      await service.translateText('Hello', null, 'fr');

      expect(restService.post).toHaveBeenCalledWith('/translate', {
        text: 'Hello',
        from: null,
        to: 'fr',
        format: undefined,
      });
    });

    it('returns an empty string when the response has no translation', async () => {
      restService.post.mockReturnValue(of({}));

      expect(await service.translateText('Hello', 'en', 'fr')).toBe('');
    });

    it('rethrows when the request fails', async () => {
      restService.post.mockReturnValue(throwError(() => new Error('boom')));
      jest.spyOn(console, 'error').mockImplementation();

      await expect(service.translateText('Hello', 'en', 'fr')).rejects.toThrow(
        'boom'
      );
    });
  });

  describe('handleFieldTranslation', () => {
    /**
     * Build a minimal SurveyJS question stub.
     *
     * @param name Question name
     * @param props translateField/translateTo/translateIf property values
     * @param props.translateField Source question name to translate from
     * @param props.translateTo Target language code
     * @param props.translateIf Optional condition expression
     * @param type SurveyJS question type (defaults to 'text')
     * @returns The question stub
     */
    const makeQuestion = (
      name: string,
      props: {
        translateField?: string;
        translateTo?: string;
        translateIf?: string;
      } = {},
      type = 'text'
    ) => ({
      name,
      valueName: undefined as string | undefined,
      getType: () => type,
      getPropertyValue: (key: string) => (props as any)[key],
    });

    /**
     * Build a SurveyJS sender stub wrapping the given questions.
     *
     * @param questions Questions returned by getAllQuestions
     * @returns The sender stub with jest spies on setValue/clearValue/runExpression
     */
    const makeSender = (questions: any[]) => ({
      getAllQuestions: () => questions,
      getQuestionByName: (n: string) =>
        questions.find((q) => q.name === n) || null,
      runExpression: jest.fn(),
      setValue: jest.fn(),
      clearValue: jest.fn(),
    });

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('does nothing when no target field points at the changed field', () => {
      const source = makeQuestion('title');
      const sender = makeSender([source]);
      const translateSpy = jest.spyOn(service, 'translateText');

      service.handleFieldTranslation(
        sender,
        { name: 'title', value: 'Hello' },
        new Map(),
        new Map(),
        new Map()
      );

      jest.runAllTimers();
      expect(translateSpy).not.toHaveBeenCalled();
    });

    it('translates the source value into the target field after the debounce', async () => {
      const source = makeQuestion('title');
      const target = makeQuestion('title_fr', {
        translateField: 'title',
        translateTo: 'fr',
      });
      const sender = makeSender([source, target]);
      const translateSpy = jest
        .spyOn(service, 'translateText')
        .mockResolvedValue('Bonjour');
      const timeouts = new Map();
      const latest = new Map();

      service.handleFieldTranslation(
        sender,
        { name: 'title', value: 'Hello' },
        timeouts,
        latest,
        new Map()
      );

      // Nothing happens before the debounce window elapses.
      expect(translateSpy).not.toHaveBeenCalled();
      expect(timeouts.has('title_fr')).toBe(true);

      jest.advanceTimersByTime(800);
      // Flush the async translate callback.
      await Promise.resolve();
      await Promise.resolve();

      expect(translateSpy).toHaveBeenCalledWith('Hello', null, 'fr', 'plain');
      expect(sender.setValue).toHaveBeenCalledWith('title_fr', 'Bonjour');
      expect(timeouts.has('title_fr')).toBe(false);
    });

    it('uses the html format for editor target fields', async () => {
      const source = makeQuestion('body');
      const target = makeQuestion(
        'body_fr',
        { translateField: 'body', translateTo: 'fr' },
        'editor'
      );
      const sender = makeSender([source, target]);
      const translateSpy = jest
        .spyOn(service, 'translateText')
        .mockResolvedValue('<p>Bonjour</p>');

      service.handleFieldTranslation(
        sender,
        { name: 'body', value: '<p>Hello</p>' },
        new Map(),
        new Map(),
        new Map()
      );
      jest.advanceTimersByTime(800);
      await Promise.resolve();
      await Promise.resolve();

      expect(translateSpy).toHaveBeenCalledWith(
        '<p>Hello</p>',
        null,
        'fr',
        'html'
      );
    });

    it('clears the target field when the source value is emptied', () => {
      const source = makeQuestion('title');
      const target = makeQuestion('title_fr', {
        translateField: 'title',
        translateTo: 'fr',
      });
      const sender = makeSender([source, target]);
      const translateSpy = jest.spyOn(service, 'translateText');
      const latest = new Map([['title_fr', 'Hello']]);

      service.handleFieldTranslation(
        sender,
        { name: 'title', value: '   ' },
        new Map(),
        latest,
        new Map()
      );

      expect(sender.clearValue).toHaveBeenCalledWith('title_fr');
      expect(latest.has('title_fr')).toBe(false);
      jest.runAllTimers();
      expect(translateSpy).not.toHaveBeenCalled();
    });

    it('skips translation when the translateIf condition fails', () => {
      const source = makeQuestion('title');
      const target = makeQuestion('title_fr', {
        translateField: 'title',
        translateTo: 'fr',
        translateIf: '{shouldTranslate} = true',
      });
      const sender = makeSender([source, target]);
      sender.runExpression.mockReturnValue(false);
      const translateSpy = jest.spyOn(service, 'translateText');

      service.handleFieldTranslation(
        sender,
        { name: 'title', value: 'Hello' },
        new Map(),
        new Map(),
        new Map()
      );

      jest.runAllTimers();
      expect(sender.runExpression).toHaveBeenCalledWith(
        '{shouldTranslate} = true'
      );
      expect(translateSpy).not.toHaveBeenCalled();
    });

    it('debounces rapid changes so only the latest value is translated', async () => {
      const source = makeQuestion('title');
      const target = makeQuestion('title_fr', {
        translateField: 'title',
        translateTo: 'fr',
      });
      const sender = makeSender([source, target]);
      const translateSpy = jest
        .spyOn(service, 'translateText')
        .mockResolvedValue('Salut');
      const timeouts = new Map();
      const latest = new Map();

      service.handleFieldTranslation(
        sender,
        { name: 'title', value: 'Hi' },
        timeouts,
        latest,
        new Map()
      );
      jest.advanceTimersByTime(400);
      service.handleFieldTranslation(
        sender,
        { name: 'title', value: 'Hello' },
        timeouts,
        latest,
        new Map()
      );
      jest.advanceTimersByTime(800);
      await Promise.resolve();
      await Promise.resolve();

      expect(translateSpy).toHaveBeenCalledTimes(1);
      expect(translateSpy).toHaveBeenCalledWith('Hello', null, 'fr', 'plain');
      expect(sender.setValue).toHaveBeenCalledWith('title_fr', 'Salut');
    });

    it('does not re-translate the echo of its own write in a two-way binding', async () => {
      // Two-way binding: en translates from fr, fr translates from en.
      const en = makeQuestion('title_en', {
        translateField: 'title_fr',
        translateTo: 'en',
      });
      const fr = makeQuestion('title_fr', {
        translateField: 'title_en',
        translateTo: 'fr',
      });
      const sender = makeSender([en, fr]);
      const translateSpy = jest
        .spyOn(service, 'translateText')
        .mockResolvedValue('Bonjour');
      const timeouts = new Map();
      const latest = new Map();
      const echo = new Map();

      // Fire the debounce timer and drain the async translate continuation.
      const flush = async () => {
        jest.advanceTimersByTime(800);
        await Promise.resolve();
        await Promise.resolve();
      };

      // User edits the English field.
      service.handleFieldTranslation(
        sender,
        { name: 'title_en', value: 'Hello' },
        timeouts,
        latest,
        echo
      );
      await flush();

      // The French field is written with the translation and marked as an echo.
      expect(sender.setValue).toHaveBeenCalledWith('title_fr', 'Bonjour');
      expect(echo.get('title_fr')).toBe('Bonjour');
      expect(translateSpy).toHaveBeenCalledTimes(1);

      // SurveyJS now fires onValueChanged for that programmatic write. The echo
      // must be recognized and must NOT trigger the reverse (fr -> en) translation.
      service.handleFieldTranslation(
        sender,
        { name: 'title_fr', value: 'Bonjour' },
        timeouts,
        latest,
        echo
      );
      await flush();

      expect(translateSpy).toHaveBeenCalledTimes(1);
      // Marker is consumed, so a later genuine edit of the same value still translates.
      expect(echo.has('title_fr')).toBe(false);

      // A genuine user edit of the French field DOES trigger the reverse
      // (fr -> en) translation: the echo only suppresses our own writes.
      service.handleFieldTranslation(
        sender,
        { name: 'title_fr', value: 'Salut' },
        timeouts,
        latest,
        echo
      );
      await flush();

      expect(translateSpy).toHaveBeenCalledTimes(2);
      expect(translateSpy).toHaveBeenLastCalledWith(
        'Salut',
        null,
        'en',
        'plain'
      );
    });
  });
});
