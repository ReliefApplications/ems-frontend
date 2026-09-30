import { Subject, of, throwError } from 'rxjs';
import {
  CHOICES_LOADER_VERSION_PROPERTY,
  ChoicesLoader,
  setChoicesLoader,
} from './choices-loader';
import { REMOTE_CHOICES_PAGE_SIZE, setupRemoteChoices } from './remote-choices';

/**
 * Builds a fake Kendo select widget, exposing what the remote choices rely on.
 *
 * @returns Fake widget
 */
const createFakeWidget = () => ({
  data: [] as any[],
  loading: true,
  disabled: true,
  opened: new Subject<void>(),
  virtual: { skip: 0 },
  optionsList: {
    content: { nativeElement: document.createElement('div') },
  },
});

/**
 * Scrolls the list of a fake widget.
 *
 * @param widget Fake widget
 * @param scroll Scroll metrics of the list
 * @param scroll.scrollTop Scroll position
 * @param scroll.clientHeight Visible height
 * @param scroll.scrollHeight Total height
 */
const scrollList = (
  widget: ReturnType<typeof createFakeWidget>,
  scroll: { scrollTop: number; clientHeight: number; scrollHeight: number }
) => {
  const content = widget.optionsList.content.nativeElement;
  Object.entries(scroll).forEach(([key, value]) =>
    Object.defineProperty(content, key, {
      value,
      configurable: true,
      writable: true,
    })
  );
  content.dispatchEvent(new Event('scroll'));
};

/**
 * Builds a fake select question, exposing what the remote choices rely on.
 *
 * @param loader Choices loader of the question
 * @param value Initial value of the question
 * @returns Fake question
 */
const createFakeQuestion = (
  loader: ChoicesLoader | null,
  value: any = null
) => {
  const properties: Record<string, any> = {};
  const callbacks: Record<string, () => void> = {};
  return {
    value,
    isReadOnly: false,
    choices: [] as any[],
    visibleChoices: [] as any[],
    survey: { locale: '' },
    choicesLoader: loader,
    getPropertyValue: (name: string) => properties[name],
    setPropertyValue: (name: string, newValue: any) => {
      properties[name] = newValue;
      callbacks[name]?.();
    },
    registerFunctionOnPropertyValueChanged: jest.fn(
      (name: string, func: () => void) => {
        callbacks[name] = func;
      }
    ),
    unRegisterFunctionOnPropertyValueChanged: jest.fn((name: string) => {
      delete callbacks[name];
    }),
  };
};

/**
 * Builds a fake loader.
 *
 * @param pages Items returned by each page load, in order
 * @param totalCount Total number of items
 * @param byValues Items returned when loading by values
 * @returns Fake loader, with jest mocks
 */
const createFakeLoader = (
  pages: { value: string; text: string }[][],
  totalCount: number,
  byValues: { value: string; text: string }[] = []
) => {
  let call = 0;
  return {
    load: jest.fn(() => of({ items: pages[call++] || [], totalCount })),
    loadByValues: jest.fn(() => of(byValues)),
  };
};

describe('remote choices', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('loads the first page of choices and enables the widget', () => {
    const items = [
      { value: '1', text: 'One' },
      { value: '2', text: 'Two' },
    ];
    const loader = createFakeLoader([items], 2);
    const widget = createFakeWidget();
    const question = createFakeQuestion(loader);

    setupRemoteChoices(widget as any, question, new Subject<void>());

    expect(loader.load).toHaveBeenCalledWith({
      search: '',
      skip: 0,
      take: REMOTE_CHOICES_PAGE_SIZE,
    });
    expect(widget.data).toEqual(items);
    expect(widget.loading).toBe(false);
    expect(widget.disabled).toBe(false);
  });

  it('fetches the selected value when it is not part of the loaded page, and keeps it displayed', () => {
    const page = [{ value: '1', text: 'One' }];
    const selected = { value: '42', text: 'Forty two' };
    const loader = createFakeLoader([page, page], 1, [selected]);
    const widget = createFakeWidget();
    const question = createFakeQuestion(loader, '42');

    const remoteChoices = setupRemoteChoices(
      widget as any,
      question,
      new Subject<void>()
    );

    expect(loader.loadByValues).toHaveBeenCalledWith(['42']);
    // Selected value first, then the page
    expect(widget.data).toEqual([selected, ...page]);

    // A search does not remove the selected value from the widget data
    remoteChoices.search('on');
    expect(loader.load).toHaveBeenLastCalledWith({
      search: 'on',
      skip: 0,
      take: REMOTE_CHOICES_PAGE_SIZE,
    });
    expect(widget.data).toEqual([selected, ...page]);
  });

  it('does not fetch the selected value again when it is already displayed', () => {
    const page = [{ value: '1', text: 'One' }];
    const loader = createFakeLoader([page], 1);
    const widget = createFakeWidget();
    const question = createFakeQuestion(loader, '1');

    const remoteChoices = setupRemoteChoices(
      widget as any,
      question,
      new Subject<void>()
    );
    remoteChoices.ensureSelected();

    expect(loader.loadByValues).not.toHaveBeenCalled();
  });

  it('fetches the values selected in a multi select question', () => {
    const loader = createFakeLoader([[]], 0, [
      { value: 'a', text: 'A' },
      { value: 'b', text: 'B' },
    ]);
    const widget = createFakeWidget();
    const question = createFakeQuestion(loader, ['a', 'b']);

    setupRemoteChoices(widget as any, question, new Subject<void>());

    expect(loader.loadByValues).toHaveBeenCalledWith(['a', 'b']);
    expect(widget.data).toEqual([
      { value: 'a', text: 'A' },
      { value: 'b', text: 'B' },
    ]);
  });

  it('loads the next page when the end of the list is reached', () => {
    const firstPage = [{ value: '1', text: 'One' }];
    const secondPage = [{ value: '2', text: 'Two' }];
    const loader = createFakeLoader([firstPage, secondPage], 2);
    const widget = createFakeWidget();
    const question = createFakeQuestion(loader);

    setupRemoteChoices(widget as any, question, new Subject<void>());
    widget.opened.next();

    // Far from the end of the list: nothing to load
    scrollList(widget, { scrollTop: 0, clientHeight: 200, scrollHeight: 1500 });
    expect(loader.load).toHaveBeenCalledTimes(1);

    scrollList(widget, {
      scrollTop: 1300,
      clientHeight: 200,
      scrollHeight: 1500,
    });

    expect(loader.load).toHaveBeenLastCalledWith({
      search: '',
      skip: 1,
      take: REMOTE_CHOICES_PAGE_SIZE,
    });
    expect(widget.data).toEqual([...firstPage, ...secondPage]);

    // Everything is loaded: no more query
    scrollList(widget, {
      scrollTop: 2800,
      clientHeight: 200,
      scrollHeight: 3000,
    });
    expect(loader.load).toHaveBeenCalledTimes(2);
  });

  it('keeps the rendered choices of the list when a page is appended', () => {
    const loader = createFakeLoader(
      [[{ value: '1', text: 'One' }], [{ value: '2', text: 'Two' }]],
      3
    );
    const widget = createFakeWidget();
    const question = createFakeQuestion(loader);

    setupRemoteChoices(widget as any, question, new Subject<void>());
    widget.opened.next();
    widget.virtual.skip = 44;
    // The widget restarts from the first choice when its data changes
    let data: any[] = [];
    Object.defineProperty(widget, 'data', {
      get: () => data,
      set: (value: any[]) => {
        data = value;
        widget.virtual.skip = 0;
      },
    });

    scrollList(widget, {
      scrollTop: 2800,
      clientHeight: 200,
      scrollHeight: 3000,
    });

    expect(widget.data).toHaveLength(2);
    expect(widget.virtual.skip).toBe(44);
  });

  it('reloads the choices when the loader of the question changes', () => {
    const loader = createFakeLoader([[{ value: '1', text: 'One' }]], 1);
    const widget = createFakeWidget();
    const question = createFakeQuestion(loader);
    setupRemoteChoices(widget as any, question, new Subject<void>());

    const newItems = [{ value: '9', text: 'Nine' }];
    const newLoader = createFakeLoader([newItems], 1);
    setChoicesLoader(question, newLoader);

    expect(newLoader.load).toHaveBeenCalledTimes(1);
    expect(widget.data).toEqual(newItems);
  });

  it('keeps the question choices ( e.g. newly created records ) displayed', () => {
    const page = [{ value: '1', text: 'One' }];
    const loader = createFakeLoader([page], 1);
    const widget = createFakeWidget();
    const question = createFakeQuestion(loader);
    const remoteChoices = setupRemoteChoices(
      widget as any,
      question,
      new Subject<void>()
    );

    question.visibleChoices = [{ value: 'new', text: 'New record' }];
    remoteChoices.syncQuestionChoices();

    expect(widget.data).toEqual([
      { value: 'new', text: 'New record' },
      ...page,
    ]);
  });

  it('shows an empty list when the loader fails', () => {
    const loader = {
      load: jest.fn(() => throwError(() => new Error('failure'))),
      loadByValues: jest.fn(() => of([])),
    };
    const widget = createFakeWidget();
    const question = createFakeQuestion(loader);

    setupRemoteChoices(widget as any, question, new Subject<void>());

    expect(widget.data).toEqual([]);
    expect(widget.loading).toBe(false);
  });

  it('releases the loader change callback when disposed', () => {
    const loader = createFakeLoader([[]], 0);
    const widget = createFakeWidget();
    const question = createFakeQuestion(loader);
    const remoteChoices = setupRemoteChoices(
      widget as any,
      question,
      new Subject<void>()
    );

    remoteChoices.dispose();

    expect(
      question.unRegisterFunctionOnPropertyValueChanged
    ).toHaveBeenCalledWith(CHOICES_LOADER_VERSION_PROPERTY, expect.any(String));
  });
});
